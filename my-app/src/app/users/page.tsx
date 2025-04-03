'use client';

import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isHotelOwner, setIsHotelOwner] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = isSignUp ? "/api/users" : "/api/users/status";
      const role = isHotelOwner ? "HOTEL_OWNER" : "REGULAR_USER";
      const body = isSignUp ?
        {
          email, password,
          firstName, lastName, phoneNumber, role
        } :
        { email, password }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error)
        setEmail("");
        setPassword("");
      } else {
        console.log('Login successful:', data);

        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setIsHotelOwner(false);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => (window.location.href = '/dashboard'), 1500);
      }
    } catch (error) {
      console.log("Shouldn't get here, smth with login is wrong");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded-lg shadow-md">

      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto p-4 border rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        <Input
          label="email"
          type="text"
          value={email}
          onChange={setEmail}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        {isSignUp &&
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={setFirstName}
          />
        }
        {isSignUp &&
          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={setLastName}
          />
        }
        {isSignUp &&
          <Input
            label="phone number"
            type="text"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
        }
        {isSignUp && (
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isHotelOwner}
                onChange={(e) => setIsHotelOwner(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Are you a hotel owner?</span>
            </label>
          </div>
        )}

        <Button
          label={isSignUp ? "Sign Up" : "Login"}
        />
        {message && (
          <p className={`mt-4 ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </form>
      <p className="mt-4 text-center">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
        <button
          className="text-blue-500 underline ml-2"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
}

