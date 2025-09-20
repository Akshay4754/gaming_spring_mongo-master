import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// User type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  balance?: number;
  username?: string;
}

// Auth Context
const AuthContext = React.createContext<{
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  isLoading: false
});

// Auth Provider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing auth
    const savedUser = localStorage.getItem('gamezone_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      // Try admin login first
      if (credentials.username) {
        const adminResponse = await fetch('http://localhost:8080/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: credentials.username })
        });
        
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          if (adminData.success) {
            const user = {
              id: adminData.admin.id,
              name: adminData.admin.fullName,
              email: adminData.admin.email,
              role: 'ADMIN',
              username: adminData.admin.username
            };
            setUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('gamezone_user', JSON.stringify(user));
            setIsLoading(false);
            return true;
          }
        }
      }
      
      // Try user login
      if (credentials.email) {
        const userResponse = await fetch('http://localhost:8080/members/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email })
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success) {
            const user = {
              id: userData.user.id,
              name: userData.user.name,
              email: userData.user.email,
              role: 'USER',
              phoneNumber: userData.user.phoneNumber,
              balance: userData.user.balance
            };
            setUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('gamezone_user', JSON.stringify(user));
            setIsLoading(false);
            return true;
          }
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gamezone_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user, isLoading } = React.useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    navigate('/');
    return null;
  }

  return children;
};

// Home component
const Home = () => {
  const { isAuthenticated, user } = React.useContext(AuthContext);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to GameZone</h1>
          <p className="text-xl text-gray-600 mb-8">Your ultimate gaming destination</p>
          
          {isAuthenticated ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {user?.name}!</h2>
              <p className="text-gray-600 mb-6">You are logged in as {user?.role}</p>
              <div className="flex flex-col gap-4">
                {user?.role === 'ADMIN' ? (
                  <Link to="/admin" className="btn-primary">Admin Dashboard</Link>
                ) : (
                  <Link to="/user/dashboard" className="btn-primary">User Dashboard</Link>
                )}
                <Link to="/games" className="btn-secondary">Browse Games</Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games" className="btn-primary">Browse Games</Link>
              <Link to="/login" className="btn-secondary">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Game type
interface Game {
  id: string;
  name: string;
  price: number;
  description: string;
  genre: string;
  imageUrl?: string;
  platform?: string;
}

// Games component
const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    // Fetch games from backend
    fetch('http://localhost:8080/games')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  }, []);

  const handleBuyGame = async (game: Game) => {
    if (!user) {
      setPurchaseMessage('Please login to purchase games');
      return;
    }

    if (user.role !== 'USER') {
      setPurchaseMessage('Only users can purchase games');
      return;
    }

    try {
      setPurchasing(game.id);
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
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Games</h1>

        {purchaseMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            purchaseMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {purchaseMessage}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="card">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-4xl">🎮</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-600">${game.price}</span>
                  <button 
                    onClick={() => handleBuyGame(game)}
                    disabled={purchasing === game.id}
                    className={`btn-primary ${purchasing === game.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {purchasing === game.id ? 'Purchasing...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No games available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Login component
const Login = () => {
  const [formData, setFormData] = useState({ email: '', username: '' });
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [error, setError] = useState('');
  const { login, isLoading } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const credentials = loginType === 'admin' 
      ? { username: formData.username }
      : { email: formData.email };
    
    const success = await login(credentials);
    if (success) {
      navigate('/');
    } else {
      setError(loginType === 'admin' ? 'Invalid username' : 'Invalid email');
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
        
        {/* Login Type Toggle */}
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('user')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'user'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'admin'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin Login
            </button>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            {loginType === 'admin' ? (
              <>
                <p><strong>Admin Username:</strong> admin</p>
                <p><strong>Email:</strong> admin@gamezone.com</p>
              </>
            ) : (
              <>
                <p><strong>User Email:</strong> john@example.com</p>
                <p><strong>Or:</strong> jane@example.com</p>
                <p><strong>Or:</strong> mike@example.com</p>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {loginType === 'admin' ? (
            <div>
              <label className="label">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Enter your username" 
                required
              />
            </div>
          ) : (
            <div>
              <label className="label">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Enter your email" 
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-700">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

// Signup component
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Member created:', result);
        setMessage('Account created successfully! You can now sign in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorData.error || `HTTP ${response.status}`;
        } catch (e) {
          errorText = await response.text();
        }
        console.error('Signup error:', response.status, errorText);
        setMessage(`Error creating account: ${errorText}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage(`Error creating account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field" 
              placeholder="Enter your name" 
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field" 
              placeholder="Enter your email" 
              required
            />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="input-field" 
              placeholder="Enter your phone number" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

// User Dashboard
const UserDashboard = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserDashboard();
    }
  }, [user?.id]);

  const fetchUserDashboard = async () => {
    try {
      const response = await fetch(`http://localhost:8080/dashboard/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Balance</h3>
            <p className="text-2xl font-bold text-indigo-600">${dashboardData?.member?.balance?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Games Available</h3>
            <p className="text-2xl font-bold text-indigo-600">{dashboardData?.games?.length || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Spent</h3>
            <p className="text-2xl font-bold text-red-600">${dashboardData?.totalSpent?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Recharged</h3>
            <p className="text-2xl font-bold text-green-600">${dashboardData?.totalRecharged?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Games</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboardData?.games?.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{game.name}</p>
                    <p className="text-sm text-gray-600">{game.genre} • {game.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">${game.price}</p>
                    <button className="btn-primary text-sm px-3 py-1">Buy</button>
                  </div>
                </div>
              )) || <p className="text-gray-500">No games available</p>}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboardData?.transactions?.map((tx, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Game Purchase</p>
                    <p className="text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">-${tx.amount}</p>
                  </div>
                </div>
              )) || <p className="text-gray-500">No transactions yet</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600 mb-4">Email: {user?.email}</p>
          <p className="text-gray-600 mb-4">Phone: {user?.phoneNumber}</p>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/dashboard/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Members</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats?.totalMembers || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Games</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats?.totalGames || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats?.activeMembers || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {stats?.recentTransactions?.map((tx, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Transaction #{tx.id?.substring(0, 8)}</p>
                    <p className="text-sm text-gray-600">Member: {tx.memberId?.substring(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${tx.amount}</p>
                    <p className="text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )) || <p className="text-gray-500">No recent transactions</p>}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recharges</h3>
            <div className="space-y-3">
              {stats?.recentRecharges?.map((rc, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Recharge #{rc.id?.substring(0, 8)}</p>
                    <p className="text-sm text-gray-600">Member: {rc.memberId?.substring(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">${rc.amount}</p>
                    <p className="text-sm text-gray-600">{new Date(rc.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )) || <p className="text-gray-500">No recent recharges</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600 mb-4">Email: {user?.email}</p>
          <p className="text-gray-600 mb-4">Username: {user?.username}</p>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>
      </div>
    </div>
  );
};

// Header component
const Header = () => {
  const { user, isAuthenticated, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GameZone</span>
          </Link>
          
          <nav className="flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link to="/games" className="text-gray-600 hover:text-indigo-600">Games</Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' ? (
                  <Link to="/admin" className="text-gray-600 hover:text-indigo-600">Admin</Link>
                ) : (
                  <Link to="/user/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="text-gray-600 hover:text-indigo-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600">Sign In</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

// Footer component
const Footer = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <p className="text-gray-500">© 2024 GameZone. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/user/dashboard" 
                element={
                  <ProtectedRoute requiredRole="USER">
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                    <Link to="/" className="btn-primary">Go Home</Link>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
