import { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'customer' | 'admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    marketing: boolean;
    notifications: boolean;
  };
}

export interface User extends FirebaseUser {
  profile: UserProfile;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: UserProfile['address'];
  preferences?: UserProfile['preferences'];
} 