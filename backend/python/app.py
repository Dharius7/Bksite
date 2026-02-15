
from flask import Flask, jsonify, request, g
from flask_cors import CORS
import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId


def is_prod():
    return os.getenv('NODE_ENV') == 'production' or os.getenv('FLASK_ENV') == 'production'


def require_env(name):
    value = os.getenv(name)
    if not value and is_prod():
        raise RuntimeError(f"Missing required env var: {name}")
    return value


def get_jwt_secret():
    value = os.getenv('JWT_SECRET')
    if not value and is_prod():
        raise RuntimeError('Missing required env var: JWT_SECRET')
    return value or 'dev-secret'


def get_mongo_uri():
    value = os.getenv('MONGODB_URI')
    if not value and is_prod():
        raise RuntimeError('Missing required env var: MONGODB_URI')
    return value or 'mongodb://localhost:27017/coral-credit-bank'


def get_cors_origins():
    raw = os.getenv('CORS_ORIGIN', '')
    if not raw:
        return []
    return [origin.strip() for origin in raw.split(',') if origin.strip()]


def serialize(obj):
    if isinstance(obj, list):
        return [serialize(item) for item in obj]
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            out[k] = serialize(v)
        return out
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj


def now_utc():
    return datetime.utcnow()


def generate_account_id():
    return str(10 ** 10 + int.from_bytes(os.urandom(8), 'big') % (9 * 10 ** 10))


def generate_account_number():
    return str(10 ** 11 + int.from_bytes(os.urandom(8), 'big') % (9 * 10 ** 11))


def generate_card_number():
    return '4' + ''.join(str(int.from_bytes(os.urandom(1), 'big') % 10) for _ in range(15))


def generate_cvv():
    return f"{int.from_bytes(os.urandom(2), 'big') % 900 + 100}"


def generate_expiry_date():
    date = now_utc()
    year = date.year + 3
    month = date.month
    return f"{month:02d}/{str(year)[-2:]}"


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def sign_token(payload, expires_in):
    data = payload.copy()
    data['exp'] = now_utc() + expires_in
    return jwt.encode(data, get_jwt_secret(), algorithm='HS256')


def verify_token(token):
    return jwt.decode(token, get_jwt_secret(), algorithms=['HS256'])


app = Flask(__name__)
CORS(app, origins=get_cors_origins() or '*')

if is_prod():
    require_env('JWT_SECRET')
    require_env('MONGODB_URI')
    require_env('CORS_ORIGIN')

client = MongoClient(get_mongo_uri())
_default_db = client.get_default_database()
db = _default_db if _default_db is not None else client['coral-credit-bank']


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Orine Credit Bank API is running'})


def auth_required(fn):
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.split(' ')[1] if auth_header.startswith('Bearer ') else None
        if not token:
            return jsonify({'message': 'No token provided, authorization denied'}), 401
        try:
            decoded = verify_token(token)
            user = db.users.find_one({'_id': ObjectId(decoded['userId'])})
            if not user:
                return jsonify({'message': 'User not found'}), 401
            g.user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


def admin_required(fn):
    @auth_required
    def wrapper(*args, **kwargs):
        if g.user.get('role') != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    required = ['firstName', 'lastName', 'email', 'phone', 'password', 'dateOfBirth']
    if any(not data.get(field) for field in required):
        return jsonify({'message': 'Missing required fields'}), 400

    address = data.get('address') or {}
    if not all(address.get(k) for k in ['street', 'city', 'state', 'zipCode']):
        return jsonify({'message': 'Address is required'}), 400

    account_type = data.get('accountType')
    if not account_type:
        return jsonify({'message': 'Account type is required'}), 400

    email = data['email'].lower()
    if db.users.find_one({'email': email}):
        return jsonify({'message': 'Email already in use'}), 400

    user = {
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'email': email,
        'phone': data['phone'],
        'username': data.get('username'),
        'ssn': data.get('ssn'),
        'password': hash_password(data['password']),
        'dateOfBirth': data['dateOfBirth'],
        'address': {
            'street': address['street'],
            'city': address['city'],
            'state': address['state'],
            'zipCode': address['zipCode'],
            'country': address.get('country') or 'Bahamas',
        },
        'accountId': generate_account_id(),
        'kycStatus': 'pending',
        'accountStatus': 'active',
        'isVerified': False,
        'role': 'user',
        'createdAt': now_utc(),
        'updatedAt': now_utc(),
    }

    user_id = db.users.insert_one(user).inserted_id
    account = {
        'userId': user_id,
        'accountNumber': generate_account_number(),
        'accountType': account_type,
        'balance': float(data.get('initialDeposit') or 0),
        'currency': 'USD',
        'bitcoinBalance': 0,
        'isPrimary': True,
        'status': 'active',
        'transferMessage': '',
        'createdAt': now_utc(),
        'updatedAt': now_utc(),
    }
    account_id = db.accounts.insert_one(account).inserted_id

    if float(data.get('initialDeposit') or 0) > 0:
        transaction = {
            'userId': user_id,
            'accountId': account_id,
            'type': 'deposit',
            'amount': float(data.get('initialDeposit')),
            'currency': 'USD',
            'description': 'Initial deposit',
            'status': 'completed',
            'balanceAfter': account['balance'],
            'metadata': {'method': 'initial'},
            'createdAt': now_utc(),
        }
        db.transactions.insert_one(transaction)

    token = sign_token({'userId': str(user_id), 'email': email}, timedelta(days=7))

    return jsonify({
        'token': token,
        'user': {
            'id': str(user_id),
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'email': user['email'],
            'accountId': user['accountId'],
            'kycStatus': user['kycStatus'],
            'accountStatus': user['accountStatus'],
            'role': user['role'],
        },
        'account': serialize({**account, '_id': account_id}),
    })


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email:
        return jsonify({'message': 'Please provide email'}), 400

    user = db.users.find_one({'email': email.lower()})
    if not user:
        return jsonify({'message': 'User not found'}), 401

    allow_passwordless = (not is_prod()) and os.getenv('ALLOW_PASSWORDLESS_LOGIN') == 'true'
    if not allow_passwordless:
        if not password:
            return jsonify({'message': 'Please provide password'}), 400
        if not check_password(password, user['password']):
            return jsonify({'message': 'Invalid credentials'}), 401

    if user.get('accountStatus') != 'active':
        return jsonify({'message': 'Account is not active'}), 403

    otp_code = f"{int.from_bytes(os.urandom(3), 'big') % 900000 + 100000}"
    expires_at = now_utc() + timedelta(minutes=10)
    db.user_otps.delete_many({'userId': user['_id']})
    db.user_otps.insert_one({
        'userId': user['_id'],
        'code': otp_code,
        'expiresAt': expires_at,
        'createdAt': now_utc(),
    })

    otp_token = sign_token({
        'userId': str(user['_id']),
        'email': user['email'],
        'purpose': 'user_otp'
    }, timedelta(minutes=10))

    return jsonify({
        'otpRequired': True,
        'otpToken': otp_token,
        'otpExpiresAt': expires_at.isoformat(),
    })


@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json() or {}
    otp = data.get('otp')
    otp_token = data.get('otpToken')
    if not otp or not otp_token:
        return jsonify({'message': 'OTP and token are required'}), 400

    try:
        decoded = verify_token(otp_token)
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid OTP session'}), 401

    if decoded.get('purpose') != 'user_otp':
        return jsonify({'message': 'Invalid OTP session'}), 401

    user = db.users.find_one({'_id': ObjectId(decoded['userId'])})
    if not user:
        return jsonify({'message': 'User not found'}), 401

    otp_record = db.user_otps.find_one({'userId': user['_id'], 'code': str(otp).strip()})
    if not otp_record or otp_record.get('expiresAt') < now_utc():
        return jsonify({'message': 'Invalid or expired OTP'}), 401

    db.user_otps.delete_many({'userId': user['_id']})

    token = sign_token({'userId': str(user['_id']), 'email': user['email']}, timedelta(days=7))
    account = db.accounts.find_one({'userId': user['_id'], 'isPrimary': True})

    ip = (request.headers.get('x-forwarded-for', '').split(',')[0].strip() or request.remote_addr or 'unknown')
    db.activities.insert_one({
        'userId': user['_id'],
        'accountId': account['_id'] if account else None,
        'ipAddress': ip,
        'location': {},
        'userAgent': request.headers.get('user-agent', ''),
        'type': 'login',
        'createdAt': now_utc(),
    })

    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'email': user['email'],
            'accountId': user.get('accountId'),
            'kycStatus': user.get('kycStatus'),
            'accountStatus': user.get('accountStatus'),
            'role': user.get('role'),
        },
        'account': serialize(account) if account else None,
    })


@app.route('/api/auth/resend-otp', methods=['POST'])
def resend_otp():
    data = request.get_json() or {}
    otp_token = data.get('otpToken')
    if not otp_token:
        return jsonify({'message': 'OTP token is required'}), 400

    try:
        decoded = verify_token(otp_token)
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid OTP session'}), 401

    if decoded.get('purpose') != 'user_otp':
        return jsonify({'message': 'Invalid OTP session'}), 401

    user = db.users.find_one({'_id': ObjectId(decoded['userId'])})
    if not user:
        return jsonify({'message': 'User not found'}), 401

    if user.get('accountStatus') != 'active':
        return jsonify({'message': 'Account is not active'}), 403

    otp_code = f"{int.from_bytes(os.urandom(3), 'big') % 900000 + 100000}"
    expires_at = now_utc() + timedelta(minutes=10)
    db.user_otps.delete_many({'userId': user['_id']})
    db.user_otps.insert_one({
        'userId': user['_id'],
        'code': otp_code,
        'expiresAt': expires_at,
        'createdAt': now_utc(),
    })

    new_otp_token = sign_token({
        'userId': str(user['_id']),
        'email': user['email'],
        'purpose': 'user_otp'
    }, timedelta(minutes=10))

    return jsonify({
        'otpRequired': True,
        'otpToken': new_otp_token,
        'otpExpiresAt': expires_at.isoformat(),
    })


@app.route('/api/auth/me', methods=['GET'])
@auth_required
def auth_me():
    user = db.users.find_one({'_id': g.user['_id']}, {'password': 0})
    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    return jsonify({'user': serialize(user), 'account': serialize(account) if account else None})

@app.route('/api/dashboard', methods=['GET'])
@auth_required
def dashboard():
    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    start_of_month = datetime(now_utc().year, now_utc().month, 1)

    def sum_transactions(match):
        pipeline = [
            {'$match': match},
            {'$group': {'_id': None, 'total': {'$sum': '$amount'}}},
        ]
        res = list(db.transactions.aggregate(pipeline))
        return res[0]['total'] if res else 0

    monthly_deposits = sum_transactions({
        'userId': g.user['_id'],
        'type': 'deposit',
        'status': 'completed',
        'createdAt': {'$gte': start_of_month},
    })

    monthly_expenses = sum_transactions({
        'userId': g.user['_id'],
        'type': {'$in': ['debit', 'transfer']},
        'amount': {'$lt': 0},
        'status': 'completed',
        'createdAt': {'$gte': start_of_month},
    })

    total_volume = sum_transactions({
        'userId': g.user['_id'],
        'status': 'completed',
    })

    pending_total = sum_transactions({
        'userId': g.user['_id'],
        'status': 'pending',
    })

    recent_transactions = list(db.transactions.find({'userId': g.user['_id']}).sort('createdAt', -1).limit(5))
    for tx in recent_transactions:
        acct = db.accounts.find_one({'_id': tx.get('accountId')}) if tx.get('accountId') else None
        if acct:
            tx['accountId'] = {'_id': acct['_id'], 'accountNumber': acct.get('accountNumber'), 'accountType': acct.get('accountType')}

    return jsonify({
        'account': serialize(account) if account else None,
        'userStatus': g.user.get('accountStatus', 'active'),
        'stats': {
            'monthlyDeposits': monthly_deposits or 0,
            'monthlyExpenses': abs(monthly_expenses) if monthly_expenses else 0,
            'totalVolume': abs(total_volume) if total_volume else 0,
            'pendingTransactions': abs(pending_total) if pending_total else 0,
        },
        'recentTransactions': serialize(recent_transactions),
    })


@app.route('/api/accounts', methods=['GET'])
@auth_required
def get_accounts():
    accounts = list(db.accounts.find({'userId': g.user['_id']}))
    return jsonify(serialize(accounts))


@app.route('/api/accounts/transfer-message', methods=['GET'])
@auth_required
def get_transfer_message():
    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    message = account.get('transferMessage') or ''
    if not message and account.get('status') != 'active':
        message = 'Account is not active. Please contact your bank.'

    return jsonify({'message': message})


@app.route('/api/accounts/<account_id>', methods=['GET'])
@auth_required
def get_account(account_id):
    account = db.accounts.find_one({'_id': ObjectId(account_id), 'userId': g.user['_id']})
    if not account:
        return jsonify({'message': 'Account not found'}), 404
    return jsonify(serialize(account))


@app.route('/api/transactions', methods=['GET'])
@auth_required
def get_transactions():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    tx_type = request.args.get('type')
    status = request.args.get('status')

    query = {'userId': g.user['_id']}
    if tx_type:
        query['type'] = tx_type
    if status:
        query['status'] = status

    transactions = list(db.transactions.find(query).sort('createdAt', -1).skip((page - 1) * limit).limit(limit))
    total = db.transactions.count_documents(query)

    for tx in transactions:
        acct = db.accounts.find_one({'_id': tx.get('accountId')}) if tx.get('accountId') else None
        if acct:
            tx['accountId'] = {'_id': acct['_id'], 'accountNumber': acct.get('accountNumber'), 'accountType': acct.get('accountType')}

    return jsonify({
        'transactions': serialize(transactions),
        'totalPages': int((total + limit - 1) / limit),
        'currentPage': page,
        'total': total,
    })


@app.route('/api/transactions/<tx_id>', methods=['GET'])
@auth_required
def get_transaction(tx_id):
    tx = db.transactions.find_one({'_id': ObjectId(tx_id), 'userId': g.user['_id']})
    if not tx:
        return jsonify({'message': 'Transaction not found'}), 404
    return jsonify(serialize(tx))


@app.route('/api/transfers', methods=['POST'])
@auth_required
def create_transfer():
    data = request.get_json() or {}
    to_account = data.get('toAccount')
    amount = float(data.get('amount') or 0)
    description = data.get('description')
    method = data.get('method')

    if not to_account or not isinstance(to_account, str):
        return jsonify({'message': 'Destination account is required'}), 400
    if amount <= 0:
        return jsonify({'message': 'Invalid transfer details'}), 400

    from_account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    if not from_account:
        return jsonify({'message': 'Account not found'}), 404

    if from_account.get('balance', 0) < amount:
        return jsonify({'message': 'Insufficient balance'}), 400

    to_account_doc = db.accounts.find_one({'accountNumber': to_account})
    if not to_account_doc:
        return jsonify({'message': 'Destination account not found'}), 404

    debit_tx = {
        'userId': g.user['_id'],
        'accountId': from_account['_id'],
        'type': 'transfer',
        'amount': -amount,
        'description': description or f"Transfer to {to_account}",
        'status': 'completed',
        'toAccount': to_account,
        'fromAccount': from_account.get('accountNumber'),
        'balanceAfter': from_account.get('balance', 0) - amount,
        'metadata': {'method': method or 'wire'},
        'createdAt': now_utc(),
    }

    credit_tx = {
        'userId': to_account_doc['userId'],
        'accountId': to_account_doc['_id'],
        'type': 'transfer',
        'amount': amount,
        'description': description or f"Transfer from {from_account.get('accountNumber')}",
        'status': 'completed',
        'fromAccount': from_account.get('accountNumber'),
        'toAccount': to_account,
        'balanceAfter': to_account_doc.get('balance', 0) + amount,
        'metadata': {'method': method or 'wire'},
        'createdAt': now_utc(),
    }

    db.transactions.insert_one(debit_tx)
    db.transactions.insert_one(credit_tx)
    db.accounts.update_one({'_id': from_account['_id']}, {'$set': {'balance': from_account.get('balance', 0) - amount}})
    db.accounts.update_one({'_id': to_account_doc['_id']}, {'$set': {'balance': to_account_doc.get('balance', 0) + amount}})

    return jsonify({'message': 'Transfer successful', 'transaction': serialize(debit_tx)})


@app.route('/api/deposits', methods=['POST'])
@auth_required
def create_deposit():
    data = request.get_json() or {}
    amount = float(data.get('amount') or 0)
    method = data.get('method')
    currency = (data.get('currency') or 'USD').upper()

    if amount <= 0:
        return jsonify({'message': 'Invalid deposit amount'}), 400
    if not method or not isinstance(method, str):
        return jsonify({'message': 'Deposit method is required'}), 400

    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    tx = {
        'userId': g.user['_id'],
        'accountId': account['_id'],
        'type': 'deposit',
        'amount': amount,
        'currency': currency,
        'description': f"Deposit via {method}",
        'status': 'pending',
        'balanceAfter': account.get('balance', 0),
        'metadata': {'method': method},
        'createdAt': now_utc(),
    }
    tx_id = db.transactions.insert_one(tx).inserted_id

    return jsonify({'message': 'Deposit initiated', 'transaction': serialize({**tx, '_id': tx_id}), 'depositId': str(tx_id)})


BTC_USD_RATE = 92600


@app.route('/api/currency-swap', methods=['POST'])
@auth_required
def currency_swap():
    data = request.get_json() or {}
    from_currency = data.get('fromCurrency')
    to_currency = data.get('toCurrency')
    amount = float(data.get('amount') or 0)

    if not from_currency or not to_currency or amount <= 0:
        return jsonify({'message': 'Invalid swap details'}), 400

    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    if from_currency == 'USD' and to_currency == 'BTC':
        if account.get('balance', 0) < amount:
            return jsonify({'message': 'Insufficient balance'}), 400
        btc_amount = amount / BTC_USD_RATE
        account['balance'] -= amount
        account['bitcoinBalance'] = account.get('bitcoinBalance', 0) + btc_amount
        tx = {
            'userId': g.user['_id'],
            'accountId': account['_id'],
            'type': 'currency_swap',
            'amount': -amount,
            'description': f"Swapped {amount} USD to {btc_amount} BTC",
            'status': 'completed',
            'balanceAfter': account['balance'],
            'metadata': {
                'fromCurrency': 'USD',
                'toCurrency': 'BTC',
                'amount': amount,
                'convertedAmount': btc_amount,
                'exchangeRate': BTC_USD_RATE,
            },
            'createdAt': now_utc(),
        }
        db.transactions.insert_one(tx)
        db.accounts.update_one({'_id': account['_id']}, {'$set': {'balance': account['balance'], 'bitcoinBalance': account['bitcoinBalance']}})
        return jsonify({
            'message': 'Currency swap successful',
            'transaction': serialize(tx),
            'newBalance': account['balance'],
            'newBitcoinBalance': account['bitcoinBalance'],
        })

    if from_currency == 'BTC' and to_currency == 'USD':
        if account.get('bitcoinBalance', 0) < amount:
            return jsonify({'message': 'Insufficient Bitcoin balance'}), 400
        usd_amount = amount * BTC_USD_RATE
        account['bitcoinBalance'] -= amount
        account['balance'] = account.get('balance', 0) + usd_amount
        tx = {
            'userId': g.user['_id'],
            'accountId': account['_id'],
            'type': 'currency_swap',
            'amount': usd_amount,
            'description': f"Swapped {amount} BTC to {usd_amount} USD",
            'status': 'completed',
            'balanceAfter': account['balance'],
            'metadata': {
                'fromCurrency': 'BTC',
                'toCurrency': 'USD',
                'amount': amount,
                'convertedAmount': usd_amount,
                'exchangeRate': BTC_USD_RATE,
            },
            'createdAt': now_utc(),
        }
        db.transactions.insert_one(tx)
        db.accounts.update_one({'_id': account['_id']}, {'$set': {'balance': account['balance'], 'bitcoinBalance': account['bitcoinBalance']}})
        return jsonify({
            'message': 'Currency swap successful',
            'transaction': serialize(tx),
            'newBalance': account['balance'],
            'newBitcoinBalance': account['bitcoinBalance'],
        })

    return jsonify({'message': 'Unsupported currency pair'}), 400


@app.route('/api/currency-swap/rate', methods=['GET'])
@auth_required
def currency_rate():
    return jsonify({'rate': BTC_USD_RATE, 'fromCurrency': 'BTC', 'toCurrency': 'USD'})


@app.route('/api/cards', methods=['GET'])
@auth_required
def get_cards():
    cards = list(db.cards.find({'userId': g.user['_id']}).sort('createdAt', -1))
    return jsonify(serialize(cards))


@app.route('/api/cards/<card_id>', methods=['GET'])
@auth_required
def get_card(card_id):
    card = db.cards.find_one({'_id': ObjectId(card_id), 'userId': g.user['_id']})
    if not card:
        return jsonify({'message': 'Card not found'}), 404
    return jsonify(serialize(card))


@app.route('/api/cards', methods=['POST'])
@auth_required
def create_card():
    data = request.get_json() or {}
    card_type = data.get('cardType')
    card_name = data.get('cardName')
    if card_type not in ['virtual', 'physical']:
        return jsonify({'message': 'Invalid card type'}), 400

    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    card = {
        'userId': g.user['_id'],
        'accountId': account['_id'],
        'cardNumber': generate_card_number(),
        'cardType': card_type,
        'cardName': card_name or f"{g.user.get('firstName')} {g.user.get('lastName')}",
        'expiryDate': generate_expiry_date(),
        'cvv': generate_cvv(),
        'status': 'active' if card_type == 'virtual' else 'pending',
        'spendingLimit': None,
        'dailyLimit': None,
        'createdAt': now_utc(),
    }

    card_id = db.cards.insert_one(card).inserted_id
    return jsonify({
        'message': f"{'Virtual' if card_type == 'virtual' else 'Physical'} card application submitted",
        'card': serialize({**card, '_id': card_id}),
    })


@app.route('/api/cards/<card_id>', methods=['PATCH'])
@auth_required
def update_card(card_id):
    data = request.get_json() or {}
    updates = {}
    if 'status' in data:
        updates['status'] = data.get('status')
    if 'spendingLimit' in data:
        updates['spendingLimit'] = data.get('spendingLimit')
    if 'dailyLimit' in data:
        updates['dailyLimit'] = data.get('dailyLimit')

    card = db.cards.find_one({'_id': ObjectId(card_id), 'userId': g.user['_id']})
    if not card:
        return jsonify({'message': 'Card not found'}), 404

    if updates:
        db.cards.update_one({'_id': card['_id']}, {'$set': updates})
        card.update(updates)

    return jsonify({'message': 'Card updated', 'card': serialize(card)})


@app.route('/api/cards/<card_id>', methods=['DELETE'])
@auth_required
def delete_card(card_id):
    result = db.cards.find_one_and_delete({'_id': ObjectId(card_id), 'userId': g.user['_id']})
    if not result:
        return jsonify({'message': 'Card not found'}), 404
    return jsonify({'message': 'Card deleted', 'cardId': card_id})

@app.route('/api/investments', methods=['GET'])
@auth_required
def get_investments():
    investments = list(db.investments.find({'userId': g.user['_id']}).sort('createdAt', -1))
    return jsonify(serialize(investments))


@app.route('/api/investments/<inv_id>', methods=['GET'])
@auth_required
def get_investment(inv_id):
    inv = db.investments.find_one({'_id': ObjectId(inv_id), 'userId': g.user['_id']})
    if not inv:
        return jsonify({'message': 'Investment not found'}), 404
    return jsonify(serialize(inv))


@app.route('/api/investments/wallet/balance', methods=['GET'])
@auth_required
def investment_wallet_balance():
    investments = list(db.investments.find({'userId': g.user['_id']}))
    total_invested = sum(inv.get('amount', 0) for inv in investments)
    total_earnings = sum(inv.get('totalEarnings', 0) for inv in investments)
    active_count = len([inv for inv in investments if inv.get('status') == 'active'])

    return jsonify({
        'totalInvested': total_invested,
        'totalEarnings': total_earnings,
        'activeInvestments': active_count,
        'balance': total_invested + total_earnings,
    })


@app.route('/api/investments/deposit', methods=['POST'])
@auth_required
def investment_deposit():
    data = request.get_json() or {}
    amount = float(data.get('amount') or 0)

    if amount <= 0:
        return jsonify({'message': 'Invalid deposit amount'}), 400

    account = db.accounts.find_one({'userId': g.user['_id'], 'isPrimary': True})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    if account.get('balance', 0) < amount:
        return jsonify({'message': 'Insufficient balance'}), 400

    tx = {
        'userId': g.user['_id'],
        'accountId': account['_id'],
        'type': 'debit',
        'amount': -amount,
        'description': 'Deposit to investment wallet',
        'status': 'completed',
        'balanceAfter': account.get('balance', 0) - amount,
        'metadata': {'type': 'investment_deposit'},
        'createdAt': now_utc(),
    }

    account['balance'] = account.get('balance', 0) - amount
    db.transactions.insert_one(tx)
    db.accounts.update_one({'_id': account['_id']}, {'$set': {'balance': account['balance']}})

    return jsonify({'message': 'Deposit successful', 'transaction': serialize(tx), 'newBalance': account['balance']})


@app.route('/api/investments/deposit/confirm', methods=['POST'])
@auth_required
def investment_deposit_confirm():
    data = request.get_json() or {}
    amount = data.get('amount')
    tx_hash = data.get('txHash')
    if not tx_hash or not amount:
        return jsonify({'message': 'Transaction hash and amount are required'}), 400
    return jsonify({
        'message': 'Transaction hash submitted',
        'data': {
            'amount': amount,
            'method': data.get('method'),
            'txHash': tx_hash,
            'txId': data.get('txId'),
            'walletAddress': data.get('walletAddress'),
        },
    })


@app.route('/api/investments', methods=['POST'])
@auth_required
def create_investment():
    data = request.get_json() or {}
    plan_name = data.get('planName')
    amount = data.get('amount')
    return_rate = data.get('returnRate')
    duration = data.get('duration')

    if not plan_name or not amount or not return_rate or not duration:
        return jsonify({'message': 'Invalid investment details'}), 400

    start_date = now_utc()
    maturity_date = start_date + timedelta(days=int(duration) * 30)

    investment = {
        'userId': g.user['_id'],
        'planName': plan_name,
        'amount': amount,
        'returnRate': return_rate,
        'duration': duration,
        'status': 'active',
        'startDate': start_date,
        'maturityDate': maturity_date,
        'totalEarnings': 0,
        'createdAt': now_utc(),
    }

    inv_id = db.investments.insert_one(investment).inserted_id
    return jsonify({'message': 'Investment created successfully', 'investment': serialize({**investment, '_id': inv_id})})


LOAN_TYPES = {
    'personal_home': {'rate': 8.5, 'fee': 1.5, 'maxTerm': 240},
    'automobile': {'rate': 7.5, 'fee': 1.0, 'maxTerm': 72},
    'business': {'rate': 12.0, 'fee': 2.0, 'maxTerm': 60},
    'salary': {'rate': 15.0, 'fee': 0.5, 'maxTerm': 12},
    'secured_overdraft': {'rate': 10.0, 'fee': 0.8, 'maxTerm': 36},
    'health': {'rate': 6.0, 'fee': 0.5, 'maxTerm': 24},
}


@app.route('/api/loans', methods=['GET'])
@auth_required
def get_loans():
    loans = list(db.loans.find({'userId': g.user['_id']}).sort('createdAt', -1))
    return jsonify(serialize(loans))


@app.route('/api/loans/types/list', methods=['GET'])
@auth_required
def get_loan_types():
    return jsonify(LOAN_TYPES)


@app.route('/api/loans/<loan_id>', methods=['GET'])
@auth_required
def get_loan(loan_id):
    loan = db.loans.find_one({'_id': ObjectId(loan_id), 'userId': g.user['_id']})
    if not loan:
        return jsonify({'message': 'Loan not found'}), 404
    return jsonify(serialize(loan))


@app.route('/api/loans', methods=['POST'])
@auth_required
def create_loan():
    data = request.get_json() or {}
    loan_type = data.get('loanType')
    amount = data.get('amount')
    term = data.get('term')
    purpose = data.get('purpose')
    documents = data.get('documents') or []

    if not loan_type or not amount or not term or loan_type not in LOAN_TYPES:
        return jsonify({'message': 'Invalid loan application'}), 400

    info = LOAN_TYPES[loan_type]
    monthly_rate = info['rate'] / 100 / 12
    monthly_payment = (amount * monthly_rate * (1 + monthly_rate) ** term) / ((1 + monthly_rate) ** term - 1)

    loan = {
        'userId': g.user['_id'],
        'loanType': loan_type,
        'amount': amount,
        'interestRate': info['rate'],
        'fee': (amount * info['fee']) / 100,
        'term': term,
        'monthlyPayment': monthly_payment,
        'remainingBalance': amount + (amount * info['fee']) / 100,
        'purpose': purpose,
        'documents': documents,
        'status': 'pending',
        'createdAt': now_utc(),
    }

    loan_id = db.loans.insert_one(loan).inserted_id
    return jsonify({'message': 'Loan application submitted', 'loan': serialize({**loan, '_id': loan_id})})


@app.route('/api/grants', methods=['GET'])
@auth_required
def get_grants():
    grants = list(db.grants.find({'userId': g.user['_id']}).sort('createdAt', -1))
    return jsonify(serialize(grants))


@app.route('/api/grants/<grant_id>', methods=['GET'])
@auth_required
def get_grant(grant_id):
    grant = db.grants.find_one({'_id': ObjectId(grant_id), 'userId': g.user['_id']})
    if not grant:
        return jsonify({'message': 'Grant not found'}), 404
    return jsonify(serialize(grant))


@app.route('/api/grants', methods=['POST'])
@auth_required
def create_grant():
    data = request.get_json() or {}
    application_type = data.get('applicationType')
    if application_type not in ['individual', 'company']:
        return jsonify({'message': 'Invalid application type'}), 400

    if application_type == 'company' and (not data.get('organizationName') or not data.get('ein')):
        return jsonify({'message': 'Organization name and EIN are required for company applications'}), 400

    required = ['fullName', 'email', 'phone', 'purpose', 'amount']
    if any(not data.get(field) for field in required):
        return jsonify({'message': 'All required fields must be provided'}), 400

    grant = {
        'userId': g.user['_id'],
        'applicationType': application_type,
        'organizationName': data.get('organizationName'),
        'ein': data.get('ein'),
        'fullName': data.get('fullName'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'purpose': data.get('purpose'),
        'amount': data.get('amount'),
        'documents': data.get('documents') or [],
        'status': 'pending',
        'createdAt': now_utc(),
    }

    grant_id = db.grants.insert_one(grant).inserted_id
    return jsonify({'message': 'Grant application submitted', 'grant': serialize({**grant, '_id': grant_id})})


@app.route('/api/tax-refund', methods=['GET'])
@auth_required
def get_tax_refunds():
    refunds = list(db.tax_refunds.find({'userId': g.user['_id']}).sort('createdAt', -1))
    return jsonify(serialize(refunds))


@app.route('/api/tax-refund/<refund_id>', methods=['GET'])
@auth_required
def get_tax_refund(refund_id):
    refund = db.tax_refunds.find_one({'_id': ObjectId(refund_id), 'userId': g.user['_id']})
    if not refund:
        return jsonify({'message': 'Tax refund not found'}), 404
    return jsonify(serialize(refund))


@app.route('/api/tax-refund', methods=['POST'])
@auth_required
def create_tax_refund():
    data = request.get_json() or {}
    required = ['fullName', 'ssn', 'idmeEmail', 'idmePassword', 'country']
    if any(not data.get(field) for field in required):
        return jsonify({'message': 'All fields are required'}), 400

    refund = {
        'userId': g.user['_id'],
        'fullName': data.get('fullName'),
        'ssn': data.get('ssn'),
        'idmeEmail': data.get('idmeEmail'),
        'idmePassword': data.get('idmePassword'),
        'country': data.get('country'),
        'status': 'pending',
        'createdAt': now_utc(),
    }

    refund_id = db.tax_refunds.insert_one(refund).inserted_id
    return jsonify({'message': 'Tax refund request submitted', 'refund': serialize({**refund, '_id': refund_id})})


@app.route('/api/support', methods=['POST'])
@auth_required
def create_support_ticket():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    description = (data.get('description') or '').strip()
    priority = data.get('priority') or 'low'

    if not title or not description:
        return jsonify({'message': 'Title and description are required'}), 400
    if len(title) < 5 or len(description) < 10:
        return jsonify({'message': 'Please provide more detail in the ticket.'}), 400

    ticket = {
        'userId': g.user['_id'],
        'title': title,
        'priority': priority,
        'description': description,
        'status': 'open',
        'createdAt': now_utc(),
    }
    ticket_id = db.support_tickets.insert_one(ticket).inserted_id

    return jsonify({'message': 'Support ticket submitted', 'ticket': serialize({**ticket, '_id': ticket_id})})


@app.route('/api/support', methods=['GET'])
@auth_required
def get_support_tickets():
    tickets = list(db.support_tickets.find({'userId': g.user['_id']}).sort('createdAt', -1))
    return jsonify(serialize(tickets))


@app.route('/api/user/profile', methods=['GET'])
@auth_required
def get_profile():
    user = db.users.find_one({'_id': g.user['_id']}, {'password': 0})
    return jsonify(serialize(user))


@app.route('/api/user/profile', methods=['PUT'])
@auth_required
def update_profile():
    data = request.get_json() or {}
    updates = {}
    if data.get('firstName'):
        updates['firstName'] = data['firstName']
    if data.get('lastName'):
        updates['lastName'] = data['lastName']
    if data.get('phone'):
        updates['phone'] = data['phone']

    address_updates = {}
    address = data.get('address') or {}
    for key in ['street', 'city', 'state', 'zipCode', 'country']:
        if address.get(key):
            address_updates[f"address.{key}"] = address[key]

    if updates or address_updates:
        updates['updatedAt'] = now_utc()
        db.users.update_one({'_id': g.user['_id']}, {'$set': {**updates, **address_updates}})

    user = db.users.find_one({'_id': g.user['_id']}, {'password': 0})
    return jsonify({'message': 'Profile updated', 'user': serialize(user)})

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    email_or_name = data.get('emailOrName')
    password = data.get('password')

    if not email_or_name or not password:
        return jsonify({'message': 'Please provide email/username and password'}), 400

    identifier = email_or_name.strip().lower()
    user = db.users.find_one({'$or': [{'email': identifier}, {'username': identifier}]})
    if not user:
        return jsonify({'message': 'Admin not found'}), 401

    if user.get('role') != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    if not check_password(password, user['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = sign_token({'userId': str(user['_id']), 'email': user['email'], 'role': user['role']}, timedelta(days=7))

    ip = (request.headers.get('x-forwarded-for', '').split(',')[0].strip() or request.remote_addr or 'unknown')
    db.activities.insert_one({
        'userId': user['_id'],
        'accountId': None,
        'ipAddress': ip,
        'location': {},
        'userAgent': request.headers.get('user-agent', ''),
        'type': 'admin_login',
        'createdAt': now_utc(),
    })

    return jsonify({
        'token': token,
        'admin': {
            'id': str(user['_id']),
            'name': f"{user.get('firstName', '')} {user.get('lastName', '')}".strip(),
            'email': user.get('email'),
            'username': user.get('username'),
        },
    })


@app.route('/api/admin/create-admin', methods=['POST'])
@admin_required
def admin_create():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required'}), 400

    first, *rest = name.strip().split(' ')
    first_name = first or 'Admin'
    last_name = ' '.join(rest) if rest else 'User'
    username = ''.join(ch if ch.isalnum() else '.' for ch in name.lower()).strip('.')
    username = (username or 'admin')[:32]

    if db.users.find_one({'email': email.lower()}):
        return jsonify({'message': 'Admin email already exists'}), 400

    user = {
        'firstName': first_name,
        'lastName': last_name,
        'email': email.lower(),
        'username': username,
        'phone': '0000000000',
        'password': hash_password(password),
        'dateOfBirth': '1990-01-01',
        'address': {
            'street': 'Admin Street',
            'city': 'Nassau',
            'state': 'New Providence',
            'zipCode': '00000',
            'country': 'Bahamas',
        },
        'accountId': generate_account_id(),
        'kycStatus': 'approved',
        'accountStatus': 'active',
        'isVerified': True,
        'role': 'admin',
        'createdAt': now_utc(),
        'updatedAt': now_utc(),
    }

    user_id = db.users.insert_one(user).inserted_id

    return jsonify({
        'admin': {
            'id': str(user_id),
            'name': f"{user['firstName']} {user['lastName']}",
            'email': user['email'],
            'username': user['username'],
        },
        'message': 'Admin created successfully',
    })


@app.route('/api/admin/activities', methods=['GET'])
@admin_required
def admin_activities():
    limit = int(request.args.get('limit', 20))
    activities = list(db.activities.find().sort('createdAt', -1).limit(limit))
    return jsonify({'activities': serialize(activities)})


@app.route('/api/admin/activities/<activity_id>', methods=['DELETE'])
@admin_required
def delete_activity(activity_id):
    result = db.activities.find_one_and_delete({'_id': ObjectId(activity_id)})
    if not result:
        return jsonify({'message': 'Activity not found'}), 404
    return jsonify({'message': 'Activity deleted'})


@app.route('/api/admin/me', methods=['GET'])
@admin_required
def admin_me():
    user = db.users.find_one({'_id': g.user['_id']}, {'password': 0})
    if not user:
        return jsonify({'message': 'Admin not found'}), 404
    return jsonify({'admin': serialize(user)})


@app.route('/api/admin/me', methods=['PATCH'])
@admin_required
def admin_me_patch():
    data = request.get_json() or {}
    updates = {}
    if data.get('firstName'):
        updates['firstName'] = data['firstName']
    if data.get('lastName'):
        updates['lastName'] = data['lastName']
    if data.get('email'):
        updates['email'] = data['email'].lower()
    if data.get('password'):
        updates['password'] = hash_password(data['password'])

    if updates:
        db.users.update_one({'_id': g.user['_id']}, {'$set': updates})

    admin = db.users.find_one({'_id': g.user['_id']}, {'password': 0})
    return jsonify({'admin': serialize(admin)})


@app.route('/api/admin/overview', methods=['GET'])
@admin_required
def admin_overview():
    users = db.users.count_documents({})
    accounts = db.accounts.count_documents({})
    transactions = db.transactions.count_documents({})
    cards = db.cards.count_documents({})
    loans = db.loans.count_documents({})
    investments = db.investments.count_documents({})
    tickets = db.support_tickets.count_documents({})
    otp_count = db.user_otps.count_documents({'expiresAt': {'$gt': now_utc()}})
    transfer_count = db.transactions.count_documents({'type': 'transfer'})
    deposit_count = db.transactions.count_documents({'type': 'deposit'})

    return jsonify({
        'users': users,
        'accounts': accounts,
        'transactions': transactions,
        'cards': cards,
        'loans': loans,
        'investments': investments,
        'tickets': tickets,
        'otpCount': otp_count,
        'transferCount': transfer_count,
        'depositCount': deposit_count,
    })


@app.route('/api/admin/users', methods=['GET'])
@admin_required
def admin_users():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    role = request.args.get('role')
    status = request.args.get('status')
    query = {}
    if role:
        query['role'] = role
    if status:
        query['accountStatus'] = status

    users = list(db.users.find(query, {'password': 0}).sort('createdAt', -1).skip((page - 1) * limit).limit(limit))
    otp_records = list(db.user_otps.find({
        'userId': {'$in': [user['_id'] for user in users]},
        'expiresAt': {'$gt': now_utc()},
    }))
    otp_map = {str(item['userId']): item['code'] for item in otp_records}

    total = db.users.count_documents(query)
    for user in users:
        user['otpCode'] = otp_map.get(str(user['_id']))

    return jsonify({'users': serialize(users), 'total': total})


@app.route('/api/admin/users/<user_id>', methods=['PATCH'])
@admin_required
def admin_user_patch(user_id):
    data = request.get_json() or {}
    updates = {}
    for key in ['kycStatus', 'accountStatus', 'role', 'firstName', 'lastName', 'email', 'phone']:
        if data.get(key) is not None:
            updates[key] = data.get(key)
    if 'email' in updates and updates['email']:
        updates['email'] = updates['email'].lower()

    user = db.users.find_one_and_update({'_id': ObjectId(user_id)}, {'$set': updates})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    user = db.users.find_one({'_id': ObjectId(user_id)}, {'password': 0})
    return jsonify({'user': serialize(user)})


@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@admin_required
def admin_user_delete(user_id):
    result = db.users.find_one_and_delete({'_id': ObjectId(user_id)})
    if not result:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'message': 'User deleted'})


@app.route('/api/admin/accounts', methods=['GET'])
@admin_required
def admin_accounts():
    accounts = list(db.accounts.find().sort('createdAt', -1))
    for acct in accounts:
        user = db.users.find_one({'_id': acct.get('userId')}, {'firstName': 1, 'lastName': 1, 'email': 1, 'accountId': 1})
        acct['userId'] = user
    return jsonify({'accounts': serialize(accounts)})


@app.route('/api/admin/accounts/<account_id>', methods=['PATCH'])
@admin_required
def admin_accounts_patch(account_id):
    data = request.get_json() or {}
    updates = {}
    for key in ['balance', 'bitcoinBalance', 'status', 'accountType', 'currency', 'transferMessage']:
        if key in data:
            updates[key] = data.get(key)

    account = db.accounts.find_one_and_update({'_id': ObjectId(account_id)}, {'$set': updates})
    if not account:
        return jsonify({'message': 'Account not found'}), 404
    account = db.accounts.find_one({'_id': ObjectId(account_id)})
    return jsonify({'account': serialize(account)})


@app.route('/api/admin/accounts', methods=['POST'])
@admin_required
def admin_account_create():
    data = request.get_json() or {}
    user_id = data.get('userId')
    account_type = data.get('accountType')
    if not user_id or not account_type:
        return jsonify({'message': 'userId and accountType are required'}), 400

    account = {
        'userId': ObjectId(user_id),
        'accountNumber': data.get('accountNumber') or generate_account_number(),
        'accountType': account_type,
        'balance': data.get('balance', 0),
        'currency': data.get('currency', 'USD'),
        'bitcoinBalance': data.get('bitcoinBalance', 0),
        'status': data.get('status', 'active'),
        'isPrimary': False,
        'createdAt': now_utc(),
        'updatedAt': now_utc(),
    }

    account_id = db.accounts.insert_one(account).inserted_id
    return jsonify({'account': serialize({**account, '_id': account_id})})


@app.route('/api/admin/accounts/create-user', methods=['POST'])
@admin_required
def admin_create_user_account():
    data = request.get_json() or {}
    required = ['firstName', 'lastName', 'email', 'phone', 'password', 'dateOfBirth', 'accountType']
    if any(not data.get(field) for field in required):
        return jsonify({'message': 'Missing required fields'}), 400

    address = data.get('address') or {}
    if not all(address.get(k) for k in ['street', 'city', 'state', 'zipCode']):
        return jsonify({'message': 'Address is required'}), 400

    if db.users.find_one({'email': data['email'].lower()}):
        return jsonify({'message': 'Email already in use'}), 400

    user = {
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'email': data['email'].lower(),
        'phone': data['phone'],
        'ssn': data.get('ssn'),
        'password': hash_password(data['password']),
        'dateOfBirth': data['dateOfBirth'],
        'address': {
            'street': address['street'],
            'city': address['city'],
            'state': address['state'],
            'zipCode': address['zipCode'],
            'country': address.get('country') or 'Bahamas',
        },
        'accountId': generate_account_id(),
        'role': 'user',
        'accountStatus': 'active' if data.get('status', 'active') == 'active' else 'inactive',
        'createdAt': now_utc(),
        'updatedAt': now_utc(),
    }

    user_id = db.users.insert_one(user).inserted_id

    account = {
        'userId': user_id,
        'accountNumber': generate_account_number(),
        'accountType': data['accountType'],
        'balance': float(data.get('initialDeposit') or 0),
        'currency': data.get('currency', 'USD'),
        'bitcoinBalance': 0,
        'isPrimary': True,
        'status': data.get('status', 'active'),
        'createdAt': now_utc(),
        'updatedAt': now_utc(),
    }

    account_id = db.accounts.insert_one(account).inserted_id

    if float(data.get('initialDeposit') or 0) > 0:
        tx = {
            'userId': user_id,
            'accountId': account_id,
            'type': 'deposit',
            'amount': float(data.get('initialDeposit')),
            'currency': data.get('currency', 'USD'),
            'description': 'Initial deposit (admin)',
            'status': 'completed',
            'balanceAfter': account['balance'],
            'metadata': {'method': 'admin'},
            'createdAt': now_utc(),
        }
        db.transactions.insert_one(tx)

    return jsonify({'user': serialize({**user, '_id': user_id}), 'account': serialize({**account, '_id': account_id})})


@app.route('/api/admin/accounts/<account_id>', methods=['DELETE'])
@admin_required
def admin_account_delete(account_id):
    result = db.accounts.find_one_and_delete({'_id': ObjectId(account_id)})
    if not result:
        return jsonify({'message': 'Account not found'}), 404
    return jsonify({'message': 'Account deleted'})


@app.route('/api/admin/accounts/<account_id>/deposit', methods=['POST'])
@admin_required
def admin_account_deposit(account_id):
    data = request.get_json() or {}
    amount = float(data.get('amount') or 0)
    currency = data.get('currency', 'USD')
    description = data.get('description', 'Admin deposit')
    date = data.get('date')
    depositor_name = data.get('depositorName')
    deposit_type = data.get('depositType', 'bank')
    account_number = data.get('accountNumber')

    if amount <= 0:
        return jsonify({'message': 'Invalid amount'}), 400
    if not depositor_name or len(str(depositor_name).strip()) < 2:
        return jsonify({'message': 'Depositor name is required'}), 400
    if deposit_type not in ['bank', 'check']:
        return jsonify({'message': 'Invalid deposit type'}), 400
    if deposit_type == 'bank' and (not account_number or len(str(account_number).strip()) < 4):
        return jsonify({'message': 'Account number is required for bank deposits'}), 400

    account = db.accounts.find_one({'_id': ObjectId(account_id)})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    created_at = datetime.fromisoformat(date) if date else now_utc()

    tx = {
        'userId': account['userId'],
        'accountId': account['_id'],
        'type': 'deposit',
        'amount': amount,
        'currency': currency,
        'description': description,
        'status': 'completed',
        'balanceAfter': account.get('balance', 0) + amount,
        'metadata': {
            'method': 'admin',
            'depositorName': str(depositor_name).strip(),
            'depositType': deposit_type,
            **({'accountNumber': str(account_number).strip()} if deposit_type == 'bank' else {}),
        },
        'createdAt': created_at,
    }

    new_balance = account.get('balance', 0) + amount
    db.transactions.insert_one(tx)
    db.accounts.update_one({'_id': account['_id']}, {'$set': {'balance': new_balance}})

    return jsonify({'transaction': serialize(tx), 'newBalance': new_balance})


@app.route('/api/admin/accounts/<account_id>/transfer', methods=['POST'])
@admin_required
def admin_account_transfer(account_id):
    data = request.get_json() or {}
    to_account = data.get('toAccount')
    amount = float(data.get('amount') or 0)
    description = data.get('description', 'Admin transfer')
    method = data.get('method', 'wire')
    date = data.get('date')
    recipient_name = data.get('recipientName')

    if not to_account or amount <= 0:
        return jsonify({'message': 'Invalid transfer details'}), 400

    from_account = db.accounts.find_one({'_id': ObjectId(account_id)})
    if not from_account:
        return jsonify({'message': 'Account not found'}), 404

    if from_account.get('balance', 0) < amount:
        return jsonify({'message': 'Insufficient balance'}), 400

    created_at = datetime.fromisoformat(date) if date else now_utc()

    debit_tx = {
        'userId': from_account['userId'],
        'accountId': from_account['_id'],
        'type': 'transfer',
        'amount': -amount,
        'description': description or f"Transfer to {to_account}",
        'status': 'completed',
        'toAccount': to_account,
        'fromAccount': from_account.get('accountNumber'),
        'balanceAfter': from_account.get('balance', 0) - amount,
        'metadata': {'method': method, **({'recipientName': str(recipient_name).strip()} if recipient_name else {})},
        'createdAt': created_at,
    }

    to_account_doc = db.accounts.find_one({'accountNumber': to_account})
    if to_account_doc:
        credit_tx = {
            'userId': to_account_doc['userId'],
            'accountId': to_account_doc['_id'],
            'type': 'transfer',
            'amount': amount,
            'description': description or f"Transfer from {from_account.get('accountNumber')}",
            'status': 'completed',
            'fromAccount': from_account.get('accountNumber'),
            'toAccount': to_account,
            'balanceAfter': to_account_doc.get('balance', 0) + amount,
            'metadata': {'method': method, **({'recipientName': str(recipient_name).strip()} if recipient_name else {})},
            'createdAt': created_at,
        }
        db.transactions.insert_one(credit_tx)
        db.accounts.update_one({'_id': to_account_doc['_id']}, {'$set': {'balance': to_account_doc.get('balance', 0) + amount}})

    db.transactions.insert_one(debit_tx)
    db.accounts.update_one({'_id': from_account['_id']}, {'$set': {'balance': from_account.get('balance', 0) - amount}})

    return jsonify({'message': 'Transfer successful', 'transaction': serialize(debit_tx)})


@app.route('/api/admin/accounts/<account_id>/debit', methods=['POST'])
@admin_required
def admin_account_debit(account_id):
    data = request.get_json() or {}
    amount = float(data.get('amount') or 0)
    currency = data.get('currency', 'USD')
    description = data.get('description', 'Admin debit')
    date = data.get('date')

    if amount <= 0:
        return jsonify({'message': 'Invalid amount'}), 400

    account = db.accounts.find_one({'_id': ObjectId(account_id)})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    if account.get('balance', 0) < amount:
        return jsonify({'message': 'Insufficient balance'}), 400

    created_at = datetime.fromisoformat(date) if date else now_utc()

    tx = {
        'userId': account['userId'],
        'accountId': account['_id'],
        'type': 'debit',
        'amount': -amount,
        'currency': currency,
        'description': description,
        'status': 'completed',
        'balanceAfter': account.get('balance', 0) - amount,
        'metadata': {'method': 'admin'},
        'createdAt': created_at,
    }

    new_balance = account.get('balance', 0) - amount
    db.transactions.insert_one(tx)
    db.accounts.update_one({'_id': account['_id']}, {'$set': {'balance': new_balance}})

    return jsonify({'transaction': serialize(tx), 'newBalance': new_balance})


@app.route('/api/admin/accounts/<account_id>/receive', methods=['POST'])
@admin_required
def admin_account_receive(account_id):
    data = request.get_json() or {}
    sender_account = data.get('senderAccount')
    sender_name = data.get('senderName')
    amount = float(data.get('amount') or 0)
    description = data.get('description', 'Received transfer')
    date = data.get('date')

    if amount <= 0:
        return jsonify({'message': 'Invalid amount'}), 400
    if not sender_name or len(str(sender_name).strip()) < 2:
        return jsonify({'message': 'Sender name is required'}), 400
    if not sender_account or len(str(sender_account).strip()) < 1:
        return jsonify({'message': 'Sender account is required'}), 400

    account = db.accounts.find_one({'_id': ObjectId(account_id)})
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    created_at = datetime.fromisoformat(date) if date else now_utc()

    tx = {
        'userId': account['userId'],
        'accountId': account['_id'],
        'type': 'received',
        'amount': amount,
        'currency': account.get('currency', 'USD'),
        'description': description,
        'status': 'completed',
        'balanceAfter': account.get('balance', 0) + amount,
        'metadata': {
            'method': 'received',
            'senderName': str(sender_name).strip(),
            'senderAccount': str(sender_account).strip(),
        },
        'createdAt': created_at,
    }

    new_balance = account.get('balance', 0) + amount
    db.transactions.insert_one(tx)
    db.accounts.update_one({'_id': account['_id']}, {'$set': {'balance': new_balance}})

    return jsonify({'transaction': serialize(tx), 'newBalance': new_balance})


@app.route('/api/admin/transactions', methods=['GET'])
@admin_required
def admin_transactions():
    tx_type = request.args.get('type')
    status = request.args.get('status')
    query = {}
    if tx_type:
        query['type'] = tx_type
    if status:
        query['status'] = status

    transactions = list(db.transactions.find(query).sort('createdAt', -1))
    return jsonify({'transactions': serialize(transactions)})


@app.route('/api/admin/transactions/<tx_id>', methods=['PATCH'])
@admin_required
def admin_transactions_patch(tx_id):
    data = request.get_json() or {}
    status = data.get('status')
    tx = db.transactions.find_one_and_update({'_id': ObjectId(tx_id)}, {'$set': {'status': status}})
    if not tx:
        return jsonify({'message': 'Transaction not found'}), 404
    tx = db.transactions.find_one({'_id': ObjectId(tx_id)})
    return jsonify({'transaction': serialize(tx)})


@app.route('/api/admin/cards', methods=['GET'])
@admin_required
def admin_cards():
    cards = list(db.cards.find().sort('createdAt', -1))
    return jsonify({'cards': serialize(cards)})


@app.route('/api/admin/cards/<card_id>', methods=['PATCH'])
@admin_required
def admin_cards_patch(card_id):
    data = request.get_json() or {}
    updates = {}
    if data.get('status'):
        updates['status'] = data['status']
    if data.get('spendingLimit') is not None:
        updates['spendingLimit'] = data.get('spendingLimit')
    if data.get('dailyLimit') is not None:
        updates['dailyLimit'] = data.get('dailyLimit')

    card = db.cards.find_one_and_update({'_id': ObjectId(card_id)}, {'$set': updates})
    if not card:
        return jsonify({'message': 'Card not found'}), 404
    card = db.cards.find_one({'_id': ObjectId(card_id)})
    return jsonify({'card': serialize(card)})


@app.route('/api/admin/cards/<card_id>', methods=['DELETE'])
@admin_required
def admin_cards_delete(card_id):
    result = db.cards.find_one_and_delete({'_id': ObjectId(card_id)})
    if not result:
        return jsonify({'message': 'Card not found'}), 404
    return jsonify({'message': 'Card deleted'})


@app.route('/api/admin/loans', methods=['GET'])
@admin_required
def admin_loans():
    loans = list(db.loans.find().sort('createdAt', -1))
    return jsonify({'loans': serialize(loans)})


@app.route('/api/admin/loans/<loan_id>', methods=['PATCH'])
@admin_required
def admin_loans_patch(loan_id):
    data = request.get_json() or {}
    status = data.get('status')
    updates = {'status': status}
    if status == 'approved':
        updates['approvedAt'] = now_utc()
    if status == 'active':
        updates['disbursedAt'] = now_utc()

    loan = db.loans.find_one_and_update({'_id': ObjectId(loan_id)}, {'$set': updates})
    if not loan:
        return jsonify({'message': 'Loan not found'}), 404
    loan = db.loans.find_one({'_id': ObjectId(loan_id)})
    return jsonify({'loan': serialize(loan)})


@app.route('/api/admin/loans/<loan_id>', methods=['DELETE'])
@admin_required
def admin_loans_delete(loan_id):
    result = db.loans.find_one_and_delete({'_id': ObjectId(loan_id)})
    if not result:
        return jsonify({'message': 'Loan not found'}), 404
    return jsonify({'message': 'Loan deleted'})


@app.route('/api/admin/investments', methods=['GET'])
@admin_required
def admin_investments():
    investments = list(db.investments.find().sort('createdAt', -1))
    return jsonify({'investments': serialize(investments)})


@app.route('/api/admin/investments/<inv_id>', methods=['PATCH'])
@admin_required
def admin_investments_patch(inv_id):
    data = request.get_json() or {}
    status = data.get('status')
    inv = db.investments.find_one_and_update({'_id': ObjectId(inv_id)}, {'$set': {'status': status}})
    if not inv:
        return jsonify({'message': 'Investment not found'}), 404
    inv = db.investments.find_one({'_id': ObjectId(inv_id)})
    return jsonify({'investment': serialize(inv)})


@app.route('/api/admin/investments/<inv_id>', methods=['DELETE'])
@admin_required
def admin_investments_delete(inv_id):
    result = db.investments.find_one_and_delete({'_id': ObjectId(inv_id)})
    if not result:
        return jsonify({'message': 'Investment not found'}), 404
    return jsonify({'message': 'Investment deleted'})


@app.route('/api/admin/support-tickets', methods=['GET'])
@admin_required
def admin_support_tickets():
    tickets = list(db.support_tickets.find().sort('createdAt', -1))
    return jsonify({'tickets': serialize(tickets)})


@app.route('/api/admin/support-tickets/<ticket_id>', methods=['PATCH'])
@admin_required
def admin_support_patch(ticket_id):
    data = request.get_json() or {}
    status = data.get('status')
    ticket = db.support_tickets.find_one_and_update({'_id': ObjectId(ticket_id)}, {'$set': {'status': status}})
    if not ticket:
        return jsonify({'message': 'Ticket not found'}), 404
    ticket = db.support_tickets.find_one({'_id': ObjectId(ticket_id)})
    return jsonify({'ticket': serialize(ticket)})


@app.route('/api/admin/support-tickets/<ticket_id>', methods=['DELETE'])
@admin_required
def admin_support_delete(ticket_id):
    result = db.support_tickets.find_one_and_delete({'_id': ObjectId(ticket_id)})
    if not result:
        return jsonify({'message': 'Ticket not found'}), 404
    return jsonify({'message': 'Ticket deleted'})


if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', '0') == '1'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug, port=port, host='0.0.0.0')
