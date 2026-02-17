import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { STORAGE_KEYS, getValue } from '../Storage';
import { toast } from 'react-toastify';
import { doPOST } from '../../utils/HttpUtils';
import { AUTHENDPOINTS } from '../../EndPoints/Auth';
import { useNavigate } from 'react-router-dom';

// Define the shape of the context value
interface AppContextProps {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  success: (message: string) => any;
  error: (message: string) => any;
  verifyToken: (message: string) => any;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isTokenVerified: boolean;
  setIsTokenVerified: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<any>>;
}

// Define the props for the AppProvider component
interface AppProviderProps {
  children: ReactNode;
}

// Create the context with a default value
export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | any>(null);
  const [token, setToken] = useState<string>("");

  const [isTokenVerified, setIsTokenVerified] = useState(false); // State flag for token verification

  const success = (message: string) => toast.success(message);
  const error = (message: string) => toast.error(message);

  const verifyToken = async (token: string | null) => {
    try {
      if (token) {
        setIsLoggedIn(true);
        return true;
      } else {
        setIsLoggedIn(false);
        localStorage.clear();
      }
    } catch (err) {
      error('Failed to verify token');
    } finally {
      setIsTokenVerified(true)
    }
    return false
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    success('Logout Successfully');
  };

  useEffect(() => {
    // Check if token exists in localStorage on app load
    const token = getValue(STORAGE_KEYS.TOKEN);
    if (token) {
      setIsLoggedIn(true);
      setIsTokenVerified(true);

      // Restore userData from localStorage so route guards have role info
      const storedUserData = getValue(STORAGE_KEYS.USER_DATA);
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
        }
      }
    } else {
      setIsTokenVerified(true);
      setIsLoggedIn(false)
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        success,
        error,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        token,
        setToken,
        verifyToken,
        isTokenVerified,
        setIsTokenVerified
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
