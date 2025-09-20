# GameZone Frontend

A modern, minimalistic React.js frontend for the GameZone E-commerce System built with TypeScript, Tailwind CSS, and React Query.

## 🚀 Features

- **Role-based Authentication** - Separate experiences for users and admins
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI Components** - Reusable, accessible components
- **API Integration** - Full integration with Spring Boot backend
- **State Management** - React Query for server state, Context for auth
- **TypeScript** - Full type safety throughout the application

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for server state management
- **Axios** for API calls
- **Heroicons** for icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── api/                 # API client and service functions
│   ├── client.ts        # Axios configuration
│   ├── games.ts         # Games API
│   ├── members.ts       # Members API
│   ├── products.ts      # Products API
│   ├── recharges.ts     # Recharges API
│   ├── transactions.ts  # Transactions API
│   └── health.ts        # Health check API
├── components/          # Reusable UI components
│   ├── GameCard.tsx     # Game display card
│   ├── Table.tsx        # Data table component
│   ├── Modal.tsx        # Modal component
│   ├── Toast.tsx        # Toast notifications
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Footer component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # React contexts
│   └── AuthContext.tsx     # Authentication context
├── hooks/               # Custom React hooks
│   ├── useGames.ts      # Games data hooks
│   ├── useMembers.ts    # Members data hooks
│   ├── useProducts.ts   # Products data hooks
│   ├── useRecharges.ts  # Recharges data hooks
│   ├── useTransactions.ts # Transactions data hooks
│   └── useToast.ts      # Toast notifications hook
├── layouts/             # Layout components
│   └── AppShell.tsx     # Main app layout
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Games.tsx        # Games listing
│   ├── GameDetail.tsx   # Game details
│   ├── Login.tsx        # Authentication
│   ├── Signup.tsx       # User registration
│   ├── UserDashboard.tsx # User dashboard
│   └── AdminDashboard.tsx # Admin dashboard
├── styles/              # Global styles
│   └── index.css        # Tailwind CSS imports
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
└── utils/               # Utility functions
```

## 🔐 Authentication

The application includes a mock authentication system for development. In production, replace the mock implementation with real JWT authentication.

### Demo Credentials

**User Account:**
- Email: `user@gamezone.test`
- Password: `User123!`

**Admin Account:**
- Email: `admin@gamezone.test`
- Password: `Admin123!`

### Production Authentication

To switch to production authentication:

1. Update `src/contexts/AuthContext.tsx`
2. Uncomment the production auth functions
3. Ensure your backend provides JWT endpoints:
   - `POST /auth/login`
   - `POST /auth/refresh`

## 🎨 Design System

### Colors
- **Primary**: Indigo (600)
- **Secondary**: Gray (50-900)
- **Success**: Green (500)
- **Warning**: Yellow (500)
- **Error**: Red (500)

### Components
- **Buttons**: `btn-primary`, `btn-secondary`, `btn-danger`
- **Cards**: `card` class for consistent styling
- **Inputs**: `input-field` class for form inputs
- **Labels**: `label` class for form labels

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔌 API Integration

All API calls are handled through React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

### API Endpoints

The frontend integrates with these backend endpoints:

- **Games**: `/games` (GET, POST, PUT, DELETE)
- **Members**: `/members` (GET, POST, PUT, DELETE, search)
- **Products**: `/products` (GET, POST, PUT, DELETE)
- **Recharges**: `/recharges` (GET, POST)
- **Transactions**: `/transactions` (GET, POST)
- **Health**: `/api/health` (GET)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables:
   - `VITE_API_BASE_URL`: Your backend API URL
3. Deploy automatically on push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_NODE_ENV` | Environment | `development` |

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom font family (Inter)
- Custom border radius
- Custom shadows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for errors
2. Verify your backend is running
3. Check environment variables
4. Open an issue on GitHub

## 🔄 Backend Integration

This frontend is designed to work with the GameZone Spring Boot backend. Ensure your backend is running on the configured port (default: 8080) and includes:

- CORS configuration for `http://localhost:3000`
- All required API endpoints
- Proper error handling
- JWT authentication (for production)

## 🎯 Roadmap

- [ ] Add more admin panel features
- [ ] Implement real-time notifications
- [ ] Add game reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add social features
- [ ] Implement advanced search and filters
- [ ] Add analytics dashboard
- [ ] Implement push notifications
