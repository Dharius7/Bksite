'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  BadgeCheck,
  CreditCard,
  Globe,
  Plus,
  ShieldCheck,
  Timer,
  Zap,
} from 'lucide-react';

export default function CardsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const [cardType, setCardType] = useState('virtual');
  const [cardName, setCardName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [actionCardId, setActionCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchCards = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/cards');
      setCards(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get('/dashboard');
      setBalance(response.data?.account?.balance ?? null);
    } catch {
      setBalance(null);
    }
  }, []);

  useEffect(() => {
    fetchCards();
    fetchBalance();
  }, [fetchCards, fetchBalance]);

  const stats = useMemo(() => {
    const active = cards.filter((card) => card.status === 'active').length;
    const pending = cards.filter((card) => card.status === 'pending').length;
    return { active, pending };
  }, [cards]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/cards', {
        cardType,
        cardName: cardName.trim() || undefined,
      });
      setMessage(response.data?.message || 'Card request submitted');
      setCardName('');
      setShowApply(false);
      await fetchCards();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Card request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFreeze = async (card: any) => {
    setActionCardId(card._id);
    setError('');
    try {
      const nextStatus = card.status === 'frozen' ? 'active' : 'frozen';
      await api.patch(`/cards/${card._id}`, { status: nextStatus });
      await fetchCards();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update card');
    } finally {
      setActionCardId(null);
    }
  };

  const handleDelete = async (card: any) => {
    setActionCardId(card._id);
    setError('');
    try {
      await api.delete(`/cards/${card._id}`);
      await fetchCards();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete card');
    } finally {
      setActionCardId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Virtual Cards</h1>
            <p className="text-gray-600">
              Secure virtual cards for online payments and subscriptions
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowApply(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold shadow hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Apply for Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">ACTIVE CARDS</div>
            <div className="text-xl font-semibold text-gray-900">{stats.active}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">PENDING APPLICATIONS</div>
            <div className="text-xl font-semibold text-gray-900">{stats.pending}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500">TOTAL BALANCE</div>
            <div className="text-xl font-semibold text-gray-900">
              {balance === null
                ? '$0.00'
                : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Virtual Cards Made Easy</h2>
            <p className="text-white/80">
              Create virtual cards for secure online payments, subscription management, and more.
              Enhanced security and spending control.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Secure
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Global
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Control
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Instant
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-72 h-40 bg-white/10 rounded-2xl border border-white/20 p-4 shadow-lg">
              <div className="text-sm font-semibold">Virtual Card</div>
              <div className="mt-6 tracking-widest text-lg">•••• •••• •••• 1234</div>
              <div className="mt-4 text-xs text-white/80">VALID THRU</div>
              <div className="text-sm">12/25</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Your Cards</h3>
          <button
            type="button"
            onClick={() => setShowApply(true)}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700"
          >
            + New Card
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}
          {loading ? (
            <WavePreloader />
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-3 py-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="text-lg font-semibold text-gray-900">No Cards Yet</div>
              <div className="text-sm text-gray-500">
                Get started by applying for your first virtual card. It only takes a few minutes!
              </div>
              <button
                type="button"
                onClick={() => setShowApply(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold shadow hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Apply for Your First Card
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <div key={card._id} className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {card.cardName || 'Virtual Card'}
                      </div>
                      <div className="text-xs text-gray-500">
                        **** **** **** {String(card.cardNumber || '').slice(-4)}
                      </div>
                    </div>
                    <div className="text-xs uppercase text-gray-500">{card.cardType}</div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">Status: {card.status}</div>
                  <div className="text-xs text-gray-500">Expiry: {card.expiryDate}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCard(card);
                        setShowDetails(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFreeze(card)}
                      disabled={actionCardId === card._id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                    >
                      {card.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(card)}
                      disabled={actionCardId === card._id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showApply && (
        <div className="fixed inset-0 z-50 bg-black/50 px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Apply for Card</h4>
              <button
                type="button"
                onClick={() => setShowApply(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {message && (
                <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                  {message}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option value="virtual">Virtual</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Name (optional)</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Name on card"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showDetails && selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/50 px-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Card Details</h4>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Card Name</span>
                <span className="font-semibold text-gray-900">
                  {selectedCard.cardName || 'Virtual Card'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Card Number</span>
                <span className="font-mono text-gray-900">
                  {selectedCard.cardNumber || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Expiry</span>
                <span className="font-semibold text-gray-900">
                  {selectedCard.expiryDate || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CVV</span>
                <span className="font-semibold text-gray-900">
                  {selectedCard.cvv || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-semibold text-gray-900">
                  {selectedCard.status || 'N/A'}
                </span>
              </div>
            </div>
            <div className="p-5 pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="w-full rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
