import React from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from '../hooks/useMembers';
import { useGames } from '../hooks/useGames';
import { useRecharges } from '../hooks/useRecharges';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  UserGroupIcon,
  GamepadIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const AdminDashboard: React.FC = () => {
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: games, isLoading: gamesLoading } = useGames();
  const { data: recharges, isLoading: rechargesLoading } = useRecharges();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  const isLoading = membersLoading || gamesLoading || rechargesLoading || transactionsLoading;

  // Calculate stats
  const totalRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalRecharges = recharges?.reduce((sum, r) => sum + r.amount, 0) || 0;
  const activeMembers = members?.filter(m => m.isActive).length || 0;
  const recentTransactions = transactions?.slice(0, 5) || [];

  const quickActions = [
    {
      title: 'Manage Games',
      description: 'Add, edit, or remove games from the catalog',
      href: '/admin/games',
      icon: GamepadIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Manage Products',
      description: 'Manage gaming products and merchandise',
      href: '/admin/products',
      icon: ShoppingCartIcon,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'View Members',
      description: 'Manage member accounts and profiles',
      href: '/admin/members',
      icon: UserGroupIcon,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'View Transactions',
      description: 'Monitor all transactions and revenue',
      href: '/admin/transactions',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your GameZone platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{members?.length || 0}</p>
                <p className="text-xs text-green-600">{activeMembers} active</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <GamepadIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Games</p>
                <p className="text-2xl font-bold text-gray-900">{games?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recharges</p>
                <p className="text-2xl font-bold text-gray-900">${totalRecharges.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="p-4 border border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              <Link
                to="/admin/transactions"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Game Purchase</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">
                      +${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent transactions</p>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">System Uptime</h3>
                <p className="text-sm text-gray-600">99.9%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Active Users</h3>
                <p className="text-sm text-gray-600">{activeMembers} members</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <GamepadIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Games Available</h3>
                <p className="text-sm text-gray-600">{games?.length || 0} games</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
