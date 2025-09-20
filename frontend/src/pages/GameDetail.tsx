import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGame } from '../hooks/useGames';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  ArrowLeftIcon,
  ShoppingCartIcon,
  StarIcon,
  CalendarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: game, isLoading, error } = useGame(id!);
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const handleBuyGame = async (game: any) => {
    if (!user) {
      setPurchaseMessage('Please login to purchase games');
      return;
    }

    if (user.role !== 'USER') {
      setPurchaseMessage('Only users can purchase games');
      return;
    }

    try {
      setPurchasing(true);
      setPurchaseMessage('');

      const response = await fetch('http://localhost:8080/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: user.id,
          gameId: game.id,
          amount: game.price
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Purchase failed');
      }

      const result = await response.json();
      setPurchaseMessage('Game purchased successfully!');
      
      // Update user balance if available
      if (user.balance !== undefined) {
        user.balance -= game.price;
      }
      
    } catch (err: any) {
      setPurchaseMessage(`Purchase failed: ${err.message}`);
      console.error('Purchase error:', err);
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Game not found</h2>
          <p className="text-gray-600 mb-4">The game you're looking for doesn't exist.</p>
          <Link to="/games" className="btn-primary">
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Games
        </Link>

        {purchaseMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            purchaseMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {purchaseMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Image */}
          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
            {game.imageUrl ? (
              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <span className="text-6xl">🎮</span>
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-indigo-600">
                  ${game.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.8 (1,234 reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{game.description}</p>

              <div className="grid grid-cols-2 gap-4">
                {game.genre && (
                  <div className="flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Genre:</span>
                    <span className="text-sm font-medium">{game.genre}</span>
                  </div>
                )}
                {game.platform && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Platform:</span>
                    <span className="text-sm font-medium">{game.platform}</span>
                  </div>
                )}
                {game.minAge && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Age Rating:</span>
                    <span className="text-sm font-medium">{game.minAge}+</span>
                  </div>
                )}
                {game.releaseDate && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Release:</span>
                    <span className="text-sm font-medium">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {game.developer && (
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Developer:</span>
                  <span className="text-sm font-medium">{game.developer}</span>
                </div>
              )}

              {game.publisher && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Publisher:</span>
                  <span className="text-sm font-medium">{game.publisher}</span>
                </div>
              )}
            </div>

            {/* Purchase Button */}
            <div className="pt-6 border-t border-gray-200">
              <button 
                onClick={() => handleBuyGame(game)}
                disabled={purchasing}
                className={`w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 ${
                  purchasing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {purchasing ? 'Purchasing...' : `Purchase Game - $${game.price.toFixed(2)}`}
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">
                Secure payment • Instant download • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Related Games Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related games */}
            <div className="card text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">More Games Coming Soon</h3>
              <p className="text-sm text-gray-600">We're constantly adding new games to our collection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
