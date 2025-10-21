'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginResponse, mockLogin } from '@/mock/mockLogin';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const isDev = process.env.NODE_ENV !== 'production';
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (isDev) console.log('AuthContext: Parsed user from localStorage:', parsedUser);
          if (parsedUser && parsedUser.id && parsedUser.email && parsedUser.role) {
            setUser(parsedUser);
          } else {
            if (isDev) console.error('AuthContext: Invalid user data in localStorage:', parsedUser);
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          if (isDev) console.error('AuthContext: Error parsing stored user:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        if (isDev) console.log('AuthContext: No user in localStorage');
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('user');
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) console.log('AuthContext: Cleared user and localStorage before login');
      const response: LoginResponse = await mockLogin(email, password);
      if (isDev) console.log('AuthContext: Login response:', response);
      if (response.success && response.user) {
        if (isDev) console.log('AuthContext: Setting user:', response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setTimeout(() => router.push('/home'), 100);
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) console.error('AuthContext: Login error:', error);
      alert(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('AuthContext: Logging out, clearing user');
    localStorage.removeItem('user');
    setUser(null);
    setTimeout(() => router.push('/'), 100);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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