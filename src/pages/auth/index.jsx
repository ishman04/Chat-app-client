import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

const Auth = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = async () => { }

    const handleSignup = async () => { }

    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-[#141414]'>
            <div className='h-[80vh] bg-[#1e1e1e] text-white shadow-2xl w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] rounded-3xl grid xl:grid-cols-2 overflow-hidden'>

                {/* Left Side Image */}
                <div className='hidden xl:block'>
                    <img
                        src="https://img.freepik.com/premium-photo/texture-red-black-paper-background-with-geometric-shape-pattern-macro-structure-craft-cardboard_113767-7271.jpg"
                        alt="Netflix Background"
                        className='h-full w-full object-cover'
                    />
                </div>

                {/* Right Side Login/Signup */}
                <div className='flex flex-col gap-6 items-center justify-center px-6 py-10'>
                    <div className='text-center'>
                        <h1 className='text-5xl font-bold md:text-6xl text-[#e50914]'>Welcome</h1>
                        <p className='text-gray-300 mt-2'>Let us know more about you</p>
                    </div>

                    <div className='w-full max-w-md'>
                        <Tabs defaultValue="login" className='w-full'>
                            <div className='flex justify-center'>
                                <TabsList className='bg-[#333] text-white justify-center'>
                                    <TabsTrigger value='login' className='data-[state=active]:bg-[#e50914] data-[state=active]:text-white px-6 py-2 rounded-md'>
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger value='signup' className='data-[state=active]:bg-[#e50914] data-[state=active]:text-white px-6 py-2 rounded-md'>
                                        Signup
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Login Form */}
                            <TabsContent value='login' className='flex flex-col gap-4 mt-6'>
                                <Input
                                    className='bg-[#2b2b2b] text-white border border-[#444] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914]'
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                                <Input
                                    className='bg-[#2b2b2b] text-white border border-[#444] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914]'
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <div className='flex justify-center'>
                                    <Button className='bg-[#e50914] hover:bg-[#f6121d] text-white text-lg px-10 py-3 rounded-md'>Login</Button>
                                </div>
                            </TabsContent>

                            {/* Signup Form */}
                            <TabsContent value='signup' className='flex flex-col gap-4 mt-6'>
                                <Input
                                    className='bg-[#2b2b2b] text-white border border-[#444] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914]'
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                                <Input
                                    className='bg-[#2b2b2b] text-white border border-[#444] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914]'
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <Input
                                    className='bg-[#2b2b2b] text-white border border-[#444] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e50914]'
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} />
                                <div className='flex justify-center'>
                                    <Button className='bg-[#e50914] hover:bg-[#f6121d] text-white text-lg px-10 py-3 rounded-md'>Signup</Button>
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
