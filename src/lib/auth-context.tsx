import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  referral_code: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, referredBy?: number) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  useEffect(() => {
    if (token) {
      fetch('https://functions.poehali.dev/8a322712-b14e-41e9-9411-60cb3fee8006', {
        headers: { 'X-Auth-Token': token }
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setUser(data);
          } else {
            setToken(null);
            localStorage.removeItem('auth_token');
          }
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('auth_token');
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await fetch('https://functions.poehali.dev/8a322712-b14e-41e9-9411-60cb3fee8006?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('auth_token', data.token);
  };

  const register = async (email: string, password: string, fullName: string, referredBy?: number) => {
    const response = await fetch('https://functions.poehali.dev/8a322712-b14e-41e9-9411-60cb3fee8006?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, referred_by: referredBy })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    await login(email, password);
  };

  const logout = () => {
    if (token) {
      fetch('https://functions.poehali.dev/8a322712-b14e-41e9-9411-60cb3fee8006?action=logout', {
        method: 'POST',
        headers: { 'X-Auth-Token': token }
      });
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
