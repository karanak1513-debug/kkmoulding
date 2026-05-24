import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount (persist login across page refresh)
  useEffect(() => {
    if (localStorage.getItem('kkmoulding_admin_secret') === 'true') {
      setIsAdmin(true);
      setCurrentUser({ uid: 'admin-local', email: 'admin@kkmoulding.com' });
    }
    setLoading(false);
  }, []);

  // Secret code login - no Firebase Auth needed
  const loginWithSecretCode = (code) => {
    if (code === '8287261653') {
      localStorage.setItem('kkmoulding_admin_secret', 'true');
      setIsAdmin(true);
      setCurrentUser({ uid: 'admin-local', email: 'admin@kkmoulding.com' });
      return true;
    }
    return false;
  };

  // Keep login as alias for backward compatibility
  const login = loginWithSecretCode;

  const logout = () => {
    localStorage.removeItem('kkmoulding_admin_secret');
    setIsAdmin(false);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAdmin,
    login,
    loginWithSecretCode,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
