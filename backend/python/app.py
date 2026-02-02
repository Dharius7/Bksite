from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

raw_origins = os.getenv('CORS_ORIGIN', '')
cors_origins = [origin.strip() for origin in raw_origins.split(',') if origin.strip()]
CORS(app, origins=cors_origins or '*')

# Configuration
PORT = int(os.getenv('PORT', 5000))

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Coral Credit Bank API is running'
    })

# Auth routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    # TODO: Implement login logic
    return jsonify({'message': 'Login endpoint - to be implemented'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    # TODO: Implement registration logic
    return jsonify({'message': 'Register endpoint - to be implemented'})

# Account routes
@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    # TODO: Implement get accounts logic
    return jsonify({'message': 'Get accounts endpoint - to be implemented'})

@app.route('/api/accounts', methods=['POST'])
def create_account():
    # TODO: Implement create account logic
    return jsonify({'message': 'Create account endpoint - to be implemented'})

if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', '0') == '1'
    app.run(debug=debug, port=PORT, host='0.0.0.0')
