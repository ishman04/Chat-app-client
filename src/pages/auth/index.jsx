import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import { useAppStore } from '../../store';

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setIsLoading(true);
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        toast.success("Login successful! Redirecting...");
        if (response.data?.data?.id) {
          setUserInfo(response.data.data);
          if (response.data.data.profileSetup) {
            navigate('/chat');
          } else {
            navigate('/profile');
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      setIsLoading(true);
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        if (response.status === StatusCodes.CREATED) {
          toast.success("Signup successful! Please complete your profile.");
          setUserInfo(response.data.data);
          navigate('/profile');
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // The main input style for consistency
  const inputStyle = "bg-[#222] text-white border border-[#444] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50";
  const buttonStyle = "bg-white text-black text-lg font-semibold px-10 py-3 rounded-md hover:bg-gray-200 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed";

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-black'>
      <div className='h-auto md:h-[80vh] w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] grid xl:grid-cols-2 overflow-hidden bg-[#111] text-white shadow-2xl rounded-3xl'>
        {/* Left Side Image */}
        <div className='hidden xl:block'>
          <img
            src="https://www.shutterstock.com/image-photo/black-white-photo-beautiful-modern-600nw-2269587879.jpg"
            alt="Monochrome Background"
            className='h-full w-full object-cover filter grayscale'
          />
        </div>

        {/* Right Side Login/Signup */}
        <div className='flex flex-col items-center justify-center px-6 py-10'>
          <div className='text-center mb-6'>
            <h1 className='text-4xl md:text-5xl font-bold'>Welcome</h1>
            <p className='text-gray-300 mt-2'>Let's get you connected.</p>
          </div>

          <div className='w-full max-w-md'>
            <Tabs defaultValue="login" className='w-full'>
              <div className='flex justify-center'>
                <TabsList className='bg-[#222] rounded-md'>
                  <TabsTrigger
                    value='login'
                    className='px-6 py-2 rounded-md text-white data-[state=active]:bg-white data-[state=active]:text-black'
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value='signup'
                    className='px-6 py-2 rounded-md text-white data-[state=active]:bg-white data-[state=active]:text-black'
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Login Form */}
              <TabsContent value='login' className='flex flex-col gap-4 mt-6'>
                <Input
                  className={inputStyle}
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  className={inputStyle}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <div className='flex justify-center mt-2'>
                  <Button 
                    className={buttonStyle}
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value='signup' className='flex flex-col gap-4 mt-6'>
                <Input
                  className={inputStyle}
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  className={inputStyle}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  className={inputStyle}
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <div className='flex justify-center mt-2'>
                  <Button 
                    className={buttonStyle}
                    onClick={handleSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing up..." : "Signup"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;