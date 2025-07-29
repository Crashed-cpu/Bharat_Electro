import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'superadmin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, token?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  requestOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bharat-electro-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('bharat-electro-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, token?: string): Promise<boolean> => {
    try {
      // Mock login logic - replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'customer'
      };
      
      setUser(mockUser);
      localStorage.setItem('bharat-electro-user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bharat-electro-user');
  };

  const requestOTP = async (email: string): Promise<boolean> => {
    try {
      // Mock OTP request - replace with actual API call
      console.log('OTP requested for:', email);
      return true;
    } catch (error) {
      console.error('OTP request error:', error);
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Mock OTP verification - replace with actual API call
      if (otp === '123456') {
        return await login(email);
      }
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      requestOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};