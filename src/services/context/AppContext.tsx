import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { STORAGE_KEYS, getValue } from '../Storage';
import { toast } from 'react-toastify';
import { doGET } from '../../utils/HttpUtils'
import { ENDPOINTS } from '../api/constants';

// Define the shape of the context value
interface AppContextProps {
  userData: any; // Replace `any` with the specific type if known
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  success: (message: string) => void;
  error: (message: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  isAppReady: boolean;
}

// Define the props for the AppProvider component
interface AppProviderProps {
  children: ReactNode;
}

// Create the context with a default value
export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null); // Replace `any` with the specific type if known
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  const success = (message: string) => toast.success(message);
  const error = (message: string) => toast.error(message);

  const getCurrentUser = async () => {
    try {
      const response = await doGET(ENDPOINTS?.profile);
      setUserData(response?.data);
      if (response) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      error('Failed to fetch user data');
    } finally {
      setIsAppReady(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    success('Logout Successfully');
  };

  useEffect(() => {
    const token = getValue(STORAGE_KEYS.TOKEN);
    if (token) {
      setIsLoggedIn(true);
      getCurrentUser();
    } else {
      setIsAppReady(true);
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
        isAppReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};