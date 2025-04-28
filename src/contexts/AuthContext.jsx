import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true, // Add loading state
  login: () => {},
  logout: () => {},
});

export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token ? { token: user.token } : {};
};

export const AuthProvider = ({ children }) => {
  // Initialize user state synchronously from localStorage
  const initialUser = JSON.parse(localStorage.getItem('user')) || null;
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser); // Only true if no initial user

  // Validate stored user on mount (e.g., check token validity)
  useEffect(() => {
    const validateUser = async () => {
      if (initialUser && initialUser.token) {
        try {
          // Optionally, make an API call to validate the token
          // For now, assume token is valid if it exists
          setUser(initialUser);
        } catch (error) {
          console.error('Token validation failed:', error);
          setUser(null);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    validateUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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