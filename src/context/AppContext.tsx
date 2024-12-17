import React, { createContext, useContext, useState } from 'react';

interface AppContextType
{
  currentPage: string;
  setCurrentPage: (value: string) => void;
  walletConnected: boolean;
  setWalletConnected: (value: boolean) => void;
  walletAddress: string | null;
  setWalletAddress: (value: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
  const [currentPage, setCurrentPage] = useState('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      walletConnected,
      setWalletConnected,
      walletAddress,
      setWalletAddress,      
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
{
  const context = useContext(AppContext);
  if (context === undefined)
  {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
