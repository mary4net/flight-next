'use client';

import { useState } from 'react';
import AuthForm from '@/components/ui/AuthForm';
import Button from '@/components/ui/button';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<string | null>(null);


  const handleAuth = async (data:
    {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      isHotelOwner?: boolean
    }) => {
    try {
      const endpoint = mode === 'signup' ? '/api/users' : '/api/users/status';
      const role = data.isHotelOwner ? "HOTEL_OWNER" : "REGULAR_USER";

      const body = mode === 'signup' ?
        { ...data, role }
        : { email: data.email, password: data.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setMessage(responseData.error || 'Something went wrong');
      } else {
        console.log('Login successful:', responseData);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => (window.location.href = '/cart'), 1500);
      }
    } catch (error) {
      console.error('Unexpected error occurred:', error);
      setMessage('Unexpected error occurred');
    }
  };
  return (
    <div className="max-w-sm mx-auto p-4 border rounded-lg shadow-md">
      <AuthForm
        mode={mode}
        onSubmitAction={handleAuth}
      />
      <p className="mt-4 text-center">
        {mode == 'signup' ? "Already have an account?" : "Don't have an account?"}
        <Button
          label={mode == 'signup' ? 'Log in' : 'Sign up'}
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        />
      </p>
      {message}
    </div>
  );
}

