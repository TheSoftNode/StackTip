import { useContext, useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Users, Shield, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import
  {
    authenticate,
    getUserData,
    signUserOut,
    userSession,
  } from '@/lib/auth';
import { UserData } from '@/lib/type';
import EmailModal from '../Utils/EmailModal';
import VerifyEmailModal from '../Utils/VerifyEmailModal';
import { QuickSend } from '@/components/TippingSection/QuickSend';
import { authContext } from '@/context/AuthContext';

interface HeroSectionProps { }

export const HeroSection: React.FC<HeroSectionProps> = () =>
{
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isQuickSendOpen, setIsQuickSendOpen] = useState<boolean>(false);

  const { walletAddress, setWalletAddress, setWalletConnected, setCurrentPage } = useAppContext();
  const { dispatch } = useContext(authContext);

  console.log(userData);

  // Keep all the existing useEffect and functions exactly as they were
  useEffect(() =>
  {
    const checkAuth = async () =>
    {
      if (userSession.isSignInPending())
      {
        const userData = await userSession.handlePendingSignIn();
        setIsAuthenticated(true);
        setUserData(userData);
        setWalletAddress(userData?.profile?.stxAddress?.testnet ?? null);
        setWalletConnected(true);
        await checkUserExists(userData?.profile?.stxAddress?.testnet);
      } else if (userSession.isUserSignedIn())
      {
        const userData = getUserData();
        setIsAuthenticated(true);
        setUserData(userData);
        setWalletAddress(userData?.profile?.stxAddress?.testnet ?? null);
        setWalletConnected(true);
        await checkUserExists(userData?.profile?.stxAddress?.testnet);
      }
    };

    checkAuth();
  }, []);

  const checkUserExists = async (walletAddress: string | null) =>
  {
    if (!walletAddress) return;

    try
    {
      const response = await fetch(`https://stx-tip.onrender.com/api/v1/users/exists?wallet=${walletAddress.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok)
      {
        throw new Error('Failed to check user existence');
      }

      const data = await response.json();
      if (!data.exists)
      {
        setIsEmailModalOpen(true);
      }
    } catch (error)
    {
      console.error('Failed to check user existence:', error);
    }
  };

  const handleAuth = () =>
  {
    if (isAuthenticated)
    {
      signUserOut();
      setWalletAddress(null);
      setIsAuthenticated(false);
    } else
    {
      authenticate();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    if (!email.trim().toLowerCase() || !walletAddress?.toLowerCase()) return;

    try
    {
      setIsLoading(true);

      const response = await fetch('https://stx-tip.onrender.com/api/v1/users/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          wallet: walletAddress
        }),
      });

      const result = await response.json();

      if (response.ok)
      {
        dispatch({
          type: "ACTIVATE_USER",
          payload: {
            activationToken: result.verificationToken,
            activation_Code: result.activationCode
          }
        });

        setIsLoading(false);
        setIsVerifyModalOpen(true);
      } else
      {
        toast.error(result.message);
        setIsLoading(false);
      }

      setIsEmailModalOpen(false);
    } catch (error: any)
    {
      console.error('Failed to save user data:', error);
      toast.error(error.message);
    } finally
    {
      setIsLoading(false);
    }
  };

  const handleStartGiving = () =>
  {
    if (isAuthenticated)
    {
      setIsQuickSendOpen(true);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-violet-950 to-purple-950">
      {/* Keep all existing background elements and styling */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-full opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center justify-center">
          <div className="space-y-6 text-center lg:text-left">
            {/* Keep all existing content */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Instant Blockchain Transfers
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-transparent bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text">
                Empower Communities
              </span>
              <br />
              <span className="text-white/90">
                Through Digital Giving
              </span>
            </h1>

            <p className="text-lg text-gray-300/90 max-w-xl">
              Send instant tips and rewards to anyone, anywhere. Support creators,
              contribute to communities, or show appreciation - all powered by
              secure blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleStartGiving}
                    className="bg-green-500/90 text-white px-8 py-6 rounded-xl text-lg shadow-lg shadow-green-500/25"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Giving
                  </Button>
                  <Button
                    onClick={() => setCurrentPage('verified-users')}
                    className="bg-violet-500/90 text-white px-8 py-6 rounded-xl text-lg shadow-lg shadow-violet-500/25"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    View Verified Users
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAuth}
                  className="group bg-gradient-to-r from-violet-500 to-purple-500 text-white px-8 py-6 rounded-xl text-lg hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-violet-500/25"
                >
                  Give a Tip
                  <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 justify-center items-center gap-6 mt-8">
              <div className="flex items-center justify-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                <Users className="h-5 w-5 text-violet-300" />
                <span className="text-gray-200">Global Community</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm">
                <Shield className="h-5 w-5 text-violet-300" />
                <span className="text-gray-200">Secure Transfers</span>
              </div>
            </div>
          </div>

          {/* Keep the decorative right column */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-purple-500/20 rounded-3xl transform rotate-3 animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="animate-bounce mb-4">
                    <Sparkles className="h-12 w-12 text-violet-300 mx-auto" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">Secure Transactions</h3>
                    <p className="text-gray-300">Powered by Stacks Blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add QuickSend Modal */}
      <Dialog open={isQuickSendOpen} onOpenChange={setIsQuickSendOpen}>
        <DialogContent className="sm:max-w-md">
          <QuickSend />
        </DialogContent>
      </Dialog>

      {/* Keep existing modals */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        email={email}
        setEmail={setEmail}
        handleSubmit={handleEmailSubmit}
        isLoading={isLoading}
      />

      <VerifyEmailModal
        isOpen={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        userEmail={email}
      />
    </div>
  );
};

export default HeroSection;