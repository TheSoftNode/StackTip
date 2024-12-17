import React, { useEffect, useState } from 'react';
import { Bell, Menu, Home, Layout, LogOutIcon, WalletIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import {
  authenticate,
  getUserData,
  signUserOut,
  userSession,
} from '@/lib/auth';
import { UserData } from '@/lib/type';



export const Header = () => {
  const [isUsernameModalOpen, setUsernameModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {walletAddress, setWalletAddress, currentPage, setCurrentPage } = useAppContext();

  useEffect(() => {
    const checkAuth = async () => {
      if (userSession.isSignInPending()) {
        const userData = await userSession.handlePendingSignIn();
        setIsAuthenticated(true);
        setUserData(userData);
        setWalletAddress(userData?.profile?.stxAddress?.mainnet ?? null);
      } else if (userSession.isUserSignedIn()) {
        const userData = getUserData();
        setIsAuthenticated(true);
        setUserData(userData);
        setWalletAddress(userData?.profile?.stxAddress?.mainnet ?? null);
      }
    };

    checkAuth();
  }, []);

  const handleAuth = () => {
    if (isAuthenticated) {
      signUserOut();
      setWalletAddress(null);
      setIsAuthenticated(false);
    } else {
      authenticate();
    }
  };

  const toggleDashboard = () => {
    setCurrentPage(currentPage === 'home' ? 'dashboard' : 'home');
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim().toLowerCase() || !walletAddress) return;

    try {
      setIsLoading(true);
      const memoCode = Math.random().toString(36).substring(2, 15);

      const response = await fetch('http://127.0.0.1:5000/api/v1/users/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          email: email.trim().toLowerCase(),
          memoCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      setUsernameModalOpen(false);
    } catch (error) {
      console.error('Failed to save user data:', error);
      alert('Failed to save user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b h-16 fixed top-0 right-0 left-0 z-20">
        <div className="h-full px-4 max-w-7xl mx-auto flex items-center justify-between">
          {/* Left section - Brand and Navigation */}
          <div className="flex items-center space-x-4">
            {currentPage !== 'home' && (
              <button className="lg:hidden hover:bg-gray-100 p-2 rounded-full transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform cursor-pointer">
                TipStack
              </div>
            </div>

            {isAuthenticated && (
              <button
                onClick={toggleDashboard}
                className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-200 border border-violet-600 ${
                  currentPage === (currentPage === 'home' ? 'dashboard' : 'home')
                    ? 'bg-gradient-to-r from-violet-600/10 to-purple-600/10 text-purple-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {currentPage === 'home' ? (
                  <>
                    <Layout className="h-4 w-4 text-purple-600" />
                    <span className="md:flex hidden ">Dashboard</span>
                  </>
                ) : (
                  <div className="flex gap-2 items-center justify-center">
                    <Home className="h-4 w-4 text-purple-600" />
                    <span className="md:flex hidden">Home</span>
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-lg border border-purple-100">
                  <WalletIcon className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-700">
                    {formatWalletAddress(walletAddress || '')}
                  </span>
                </div>
              </>
            )}

            <button
              onClick={handleAuth}
              className="text-sm md:text-base bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center"
            >
              {isAuthenticated ? (
                <>
                  <LogOutIcon className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Disconnect</span>
                </>
              ) : (
                <>
                  <WalletIcon className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">Connect Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Username Modal */}
      <Dialog open={isUsernameModalOpen} onOpenChange={setUsernameModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Your Username</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUsernameSubmit} className="grid gap-4 py-4">
            <Input
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !email.trim().toLowerCase()} 
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;