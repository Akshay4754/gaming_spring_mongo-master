// Core types based on backend models
export interface Game {
  id: string;
  name: string;
  price: number;
  description: string;
  genre: string;
  imageUrl?: string;
  platform?: string;
  minAge?: number;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  price: number;
  stock: number;
}

export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  balance: number;
  joiningDate: string;
  isActive: boolean;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  gender?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recharge {
  id: string;
  memberId: string;
  amount: number;
  paymentMethod: string;
  date: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  gameId: string;
  amount: number;
  date: string;
}

export interface PlayedHistory {
  id: string;
  date_time: string;
  game_name: string;
  amount: number;
}

export interface GameDto {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface MemberDto {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  balance: number;
  joiningDate: string;
  isActive: boolean;
}

export interface RechargeDto {
  id: string;
  amount: number;
  dateTime: string;
}

export interface MemberProfileDto {
  member: MemberDto;
  recharge_history: RechargeDto[];
  games: GameDto[];
  played_history: PlayedHistory[];
}

// API Request/Response types
export interface SearchRequestDto {
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateRechargeRequest {
  memberId: string;
  amount: number;
  paymentMethod: string;
}

export interface CreateTransactionRequest {
  memberId: string;
  gameId: string;
  amount: number;
}

// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  memberId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// UI types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

// Form types
export interface GameFormData {
  name: string;
  price: number;
  description: string;
  genre: string;
  imageUrl?: string;
  platform?: string;
  minAge?: number;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  tags: string;
  price: number;
  stock: number;
}

export interface MemberFormData {
  name: string;
  phoneNumber: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  gender?: string;
  dateOfBirth?: string;
}
