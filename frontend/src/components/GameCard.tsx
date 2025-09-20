import React from 'react';
import { Game } from '../types';
import { ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

interface GameCardProps {
  game: Game;
  onView?: (game: Game) => void;
  onBuy?: (game: Game) => void;
  showActions?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onView,
  onBuy,
  showActions = true,
}) => {
  return (
    <div className="card group hover:shadow-lg transition-shadow duration-200">
      {/* Game Image */}
      <div className="aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <span className="text-4xl">🎮</span>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {game.name}
          </h3>
          <span className="text-lg font-bold text-indigo-600">
            ${game.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {game.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {game.genre}
          </span>
          {game.platform && (
            <span className="bg-gray-100 px-2 py-1 rounded-full">
              {game.platform}
            </span>
          )}
        </div>

        {game.minAge && (
          <div className="text-xs text-gray-500">
            Age: {game.minAge}+
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 mt-4">
          {onView && (
            <button
              onClick={() => onView(game)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              View
            </button>
          )}
          {onBuy && (
            <button
              onClick={() => onBuy(game)}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Buy
            </button>
          )}
        </div>
      )}
    </div>
  );
};
