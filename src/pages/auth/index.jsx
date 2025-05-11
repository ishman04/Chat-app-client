import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'
import {StatusCodes} from 'http-status-codes'
import { useAppStore } from '../../store'

const Auth = () => {
  const navigate = useNavigate()
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const validateSignup = ()=>{
    if(!email.length){
        toast.error("Email is required")
        return false;
    }
    if(!password.length){
        toast.error("Password is required")
        return false;
    }
    if(password !== confirmPassword){
        toast.error("Password and Confirm Password should be same")
        return false;
    }
    return true;
  }

  const validateLogin = ()=>{
    if(!email.length){
        toast.error("Email is required")
        return false;
    }
    if(!password.length){
        toast.error("Password is required")
        return false;
    }
    return true;
  }

  const handleLogin = async () => {
    if(validateLogin()){
        const response = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials: true})
        if(response.data.data.id){
          setUserInfo(response.data.data)
            if(response.data.data.profileSetup){
                navigate('/chat')
            }
            else{
                navigate('/profile')
            } 
        }
        console.log(response);
    }
  }
  const handleSignup = async () => {
    if(validateSignup()){
        const response = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials: true})
        if(response.status === StatusCodes.CREATED){
          setUserInfo(response.data.data)  
          navigate('/profile')
        }
        console.log(response);
    }
  }

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-black'>
      <div className='h-[80vh] w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] grid xl:grid-cols-2 overflow-hidden bg-[#111] text-white shadow-2xl rounded-3xl'>

        {/* Left Side Image (grayscale) */}
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
            <h1 className='text-5xl md:text-6xl font-bold'>Welcome</h1>
            <p className='text-gray-300 mt-2'>Let us know more about you</p>
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
                  className='bg-[#222] text-white border border-[#222] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white'
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Input
                  className='bg-[#222] text-white border border-[#222]  placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white'
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <div className='flex justify-center'>
                  <Button className='bg-white text-black text-lg px-10 py-3 rounded-md hover:bg-gray-200' onClick={handleLogin}
                   >
                    Login
                  </Button>
                </div>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value='signup' className='flex flex-col gap-4 mt-6'>
                <Input
                  className='bg-[#222] text-white border border-[#222]  placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white'
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Input
                  className='bg-[#222] text-white border border-[#222] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white'
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Input
                  className='bg-[#222] text-white border border-[#222]  placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white'
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <div className='flex justify-center'>
                  <Button className='bg-white text-black text-lg px-10 py-3 rounded-md hover:bg-gray-200'
                  onClick={handleSignup}>
                    Signup
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Auth
 