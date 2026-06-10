import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLogged: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userToken: string | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  setLoggedIn: (logged: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  // Initialize auth state from AsyncStorage or use demo user
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const logged = await AsyncStorage.getItem('isLogged');
        
        if (token && logged === 'true') {
          // User was previously logged in
          setUserToken(token);
          setIsLogged(true);
          setUserId(await AsyncStorage.getItem('userId'));
          setUserName(await AsyncStorage.getItem('userName'));
          setUserEmail(await AsyncStorage.getItem('userEmail'));
        } else {
          // Set default demo user for development/testing
          const demoToken = 'demo-token-12345';
          const demoUserId = '1';
          const demoName = 'Demo User';
          const demoEmail = 'demo@example.com';
          
          setUserToken(demoToken);
          setUserId(demoUserId);
          setUserName(demoName);
          setUserEmail(demoEmail);
          setIsLogged(true);
          
          // Save to AsyncStorage for persistence
          await AsyncStorage.setItem('userToken', demoToken);
          await AsyncStorage.setItem('isLogged', 'true');
          await AsyncStorage.setItem('userId', demoUserId);
          await AsyncStorage.setItem('userName', demoName);
          await AsyncStorage.setItem('userEmail', demoEmail);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Fallback to demo user
        setIsLogged(true);
        setUserToken('demo-token-12345');
        setUserId('1');
        setUserName('Demo User');
        setUserEmail('demo@example.com');
      }
    };

    initAuth();
  }, []);

  const login = async (userData: any) => {
    try {
      const token = userData.token || `usuario-${userData.codUser || userData.id}`;
      const id = String(userData.codUser || userData.id || '1');
      const name = userData.nomeCompleto || userData.nomeDeUsuario || 'User';
      const email = userData.gmail || userData.email || '';

      setUserToken(token);
      setUserId(id);
      setUserName(name);
      setUserEmail(email);
      setIsLogged(true);

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('isLogged', 'true');
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userEmail', email);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = async () => {
    try {
      setUserToken(null);
      setUserId(null);
      setUserName(null);
      setUserEmail(null);
      setIsLogged(false);

      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('isLogged');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const setLoggedIn = (logged: boolean) => {
    setIsLogged(logged);
  };

  return (
    <AuthContext.Provider value={{ isLogged, userId, userName, userEmail, userToken, login, logout, setLoggedIn }}>
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
