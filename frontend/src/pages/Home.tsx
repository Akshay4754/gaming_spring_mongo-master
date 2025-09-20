import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CommandLineIcon, 
  CubeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const Home: React.FC = () => {
  // Mock games data for now
  const games = [
    {
      id: '1',
      name: 'Cyberpunk 2077',
      price: 59.99,
      description: 'An open-world, action-adventure story set in Night City.',
      genre: 'RPG',
      imageUrl: '',
      platform: 'PC'
    },
    {
      id: '2',
      name: 'The Witcher 3',
      price: 39.99,
      description: 'A story-driven open world RPG set in a fantasy universe.',
      genre: 'RPG',
      imageUrl: '',
      platform: 'PC'
    },
    {
      id: '3',
      name: 'Grand Theft Auto V',
      price: 29.99,
      description: 'Experience the ultimate open-world adventure.',
      genre: 'Action',
      imageUrl: '',
      platform: 'PC'
    }
  ];

  const features = [
    {
      icon: CommandLineIcon,
      title: 'Extensive Game Library',
      description: 'Access thousands of games across all genres and platforms.',
    },
    {
      icon: UserGroupIcon,
      title: 'Member Benefits',
      description: 'Join our community and enjoy exclusive member perks and discounts.',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Easy Transactions',
      description: 'Seamless recharge and purchase experience with secure payments.',
    },
    {
      icon: CubeIcon,
      title: 'Gaming Products',
      description: 'Shop for gaming accessories, merchandise, and collectibles.',
    },
  ];

  const stats = [
    { label: 'Games Available', value: '1000+' },
    { label: 'Active Members', value: '50K+' },
    { label: 'Happy Customers', value: '100K+' },
    { label: 'Years Experience', value: '5+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">GameZone</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your ultimate gaming destination. Discover, play, and enjoy the best games with seamless transactions and member benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/games"
                className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <CommandLineIcon className="w-5 h-5" />
                Browse Games
              </Link>
              <Link
                to="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Games</h2>
              <p className="text-gray-600">Discover the most popular games in our collection</p>
            </div>
            <Link
              to="/games"
              className="btn-primary flex items-center gap-2"
            >
              View All
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.slice(0, 3).map((game) => (
              <div key={game.id} className="card group hover:shadow-lg transition-shadow duration-200">
                {/* Game Image */}
                <div className="aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                    <span className="text-4xl">🎮</span>
                  </div>
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
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {game.platform}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 btn-secondary">
                    View
                  </button>
                  <button className="flex-1 btn-primary">
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GameZone?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best gaming experience with cutting-edge technology and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Gaming?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of gamers and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/games"
              className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
