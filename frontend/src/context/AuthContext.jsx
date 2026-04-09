import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('scanpay_admin');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (payload) => {
    localStorage.setItem('scanpay_token', payload.token);
    localStorage.setItem('scanpay_admin', JSON.stringify(payload.admin));
    setAdmin(payload.admin);
  };

  const logout = () => {
    localStorage.removeItem('scanpay_token');
    localStorage.removeItem('scanpay_admin');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
