import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { Spinner } from '@/components/ui/spinner';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { isLoggingIn, login, loginWithGoogle } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <Card className='border-emerald-900 bg-black/50 backdrop-blur-xl shadow-2xl shadow-emerald-500/20'>
                    <CardHeader className='space-y-1'>
                        <CardTitle className='text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'>
                            Welcome Back
                        </CardTitle>
                        <CardDescription className='text-center text-gray-400'>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='email' className='text-gray-200'>Email</Label>
                                <div className='relative'>
                                    <Mail className='absolute left-3 top-3 h-4 w-4 text-emerald-500' />
                                    <Input
                                        id='email'
                                        type='email'
                                        placeholder='you@example.com'
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className='pl-10 bg-black/50 border-emerald-900 text-gray-200 placeholder:text-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='password' className='text-gray-200'>Password</Label>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-3 h-4 w-4 text-emerald-500' />
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='••••••••'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className='pl-10 pr-10 bg-black/50 border-emerald-900 text-gray-200 placeholder:text-gray-600 focus:border-emerald-500 focus:ring-emerald-500'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-3 text-emerald-500 hover:text-emerald-400 transition-colors'
                                    >
                                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                    </button>
                                </div>
                            </div>
                            <div className='flex items-center justify-between text-sm'>
                                <label className='flex items-center space-x-2 cursor-pointer text-gray-300'>
                                    <input type='checkbox' className='rounded border-emerald-900 bg-black/50' />
                                    <span>Remember me</span>
                                </label>
                                <a href='#' className='text-emerald-400 hover:text-emerald-300 transition-colors'>
                                    Forgot password?
                                </a>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                className='w-full text-lg cursor-pointer transition-all bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 my-2 rounded-lg border-green-800 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]'
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Spinner />
                                        Logging...
                                    </>
                                ) : (
                                    "Login"
                                )}

                            </Button>
                        </div>
                        <div className='relative'>
                            <Separator className='bg-emerald-900' />
                        </div>
                        <Button
                            variant='outline'
                            onClick={loginWithGoogle}
                            className='bg-black/50 cursor-pointer w-full py-4 border-emerald-900 text-gray-200 hover:bg-emerald-950 hover:border-emerald-700 transition-all hover:text-gray-200'
                        >
                            <svg className='mr-2 h-4 w-4 text-red-500' viewBox='0 0 24 24'>
                                <path fill='currentColor' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                                <path fill='currentColor' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                                <path fill='currentColor' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                                <path fill='currentColor' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                            </svg>
                            Log in with Google
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className='text-center text-sm text-gray-400 w-full'>
                            Don't have an account?{' '}
                            <Link to='/signup' className='text-emerald-400 hover:text-emerald-300 font-semibold transition-colors'>
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Login;
