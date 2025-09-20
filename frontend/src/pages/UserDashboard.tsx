import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMemberProfile } from '../hooks/useMembers';
import { useCreateRecharge } from '../hooks/useRecharges';
import { useCreateTransaction } from '../hooks/useTransactions';
import { useGames } from '../hooks/useGames';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import { 
  UserIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ClockIcon,
  PlusIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const { data: profile, isLoading: profileLoading } = useMemberProfile(user?.phoneNumber || '');
  const { data: games } = useGames({ size: 4 });
  const createRecharge = useCreateRecharge();
  const createTransaction = useCreateTransaction();
  const { success, error } = useToast();

  const handleRecharge = async () => {
    if (!user?.memberId || !rechargeAmount || !paymentMethod) return;

    try {
      await createRecharge.mutateAsync({
        memberId: user.memberId,
        amount: parseFloat(rechargeAmount),
        paymentMethod,
      });
      success('Recharge Successful', 'Your account has been recharged successfully!');
      setIsRechargeModalOpen(false);
      setRechargeAmount('');
      setPaymentMethod('');
    } catch (err) {
      error('Recharge Failed', 'An error occurred during recharge. Please try again.');
    }
  };

  const handlePurchase = async () => {
    if (!user?.memberId || !selectedGame) return;

    try {
      await createTransaction.mutateAsync({
        memberId: user.memberId,
        gameId: selectedGame.id,
        amount: selectedGame.price,
      });
      success('Purchase Successful', 'Game purchased successfully!');
      setIsPurchaseModalOpen(false);
      setSelectedGame(null);
    } catch (err) {
      error('Purchase Failed', 'An error occurred during purchase. Please try again.');
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Account Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${profile?.member?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <CommandLineIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Games Owned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.games?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Play Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.played_history?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Recharge Account
              </button>
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Buy Games
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {profile?.played_history?.slice(0, 5).map((session: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{session.game_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.date_time).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">
                    ${session.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {(!profile?.played_history || profile.played_history.length === 0) && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* My Games */}
        {profile?.games && profile.games.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.games.map((game: any) => (
                <div key={game.id} className="card">
                  <h3 className="font-semibold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">
                      ${game.price.toFixed(2)}
                    </span>
                    <button className="btn-primary text-sm">
                      Play Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Games */}
        {games && games.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.slice(0, 4).map((game: any) => (
                <div key={game.id} className="card">
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
                    {game.imageUrl ? (
                      <img
                        src={game.imageUrl}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🎮</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">
                      ${game.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedGame(game);
                        setIsPurchaseModalOpen(true);
                      }}
                      className="btn-primary text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      <Modal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        title="Recharge Account"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="input-field"
              placeholder="Enter amount"
              min="1"
              step="0.01"
            />
          </div>
          <div>
            <label className="label">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field"
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRecharge}
              className="flex-1 btn-primary"
              disabled={!rechargeAmount || !paymentMethod}
            >
              Recharge
            </button>
            <button
              onClick={() => setIsRechargeModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Purchase Modal */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Purchase Game"
      >
        {selectedGame && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedGame.name}</h3>
                <p className="text-lg font-bold text-indigo-600">
                  ${selectedGame.price.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-gray-600">{selectedGame.description}</p>
            <div className="flex gap-3">
              <button
                onClick={handlePurchase}
                className="flex-1 btn-primary"
              >
                Confirm Purchase
              </button>
              <button
                onClick={() => setIsPurchaseModalOpen(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
