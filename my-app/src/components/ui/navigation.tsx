'use client';

import { useState } from 'react';
import { Sun, Moon, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/ui/context';

interface NavigationProps {}

export default function Navigation({}: NavigationProps): JSX.Element {
    const [darkMode, toggleDarkMode] = useTheme();

    return (
        <nav className={`flex justify-between items-center p-4 text-white shadow-md font-helvetica ${darkMode ? 'bg-gray-900' : 'bg-blue-500'}`}>
            <h1 className="text-2xl font-bold">FlyNext</h1>
            <ul className="flex space-x-6 text-lg font-medium">
                <li>
                    <Link href="/" className="hover:underline">Home</Link>
                </li>
                <li>
                    <Link href="/flights" className="hover:underline">Flights</Link>
                </li>
                <li>
                    <Link href="/hotelsearch" className="hover:underline">Hotels</Link>
                </li>
                <li>
                    <Link href="/booking" className="hover:underline">Bookings</Link>
                </li>
                <li>
                    <Link href="/cart" className="flex items-center space-x-1 hover:underline">
                        <ShoppingCart size={20} />
                        <span>Cart</span>
                    </Link>
                </li>
            </ul>
            <div className="flex items-center space-x-4">
                <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-700 text-white">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Link href="/user/profile" className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-700 font-semibold">
                    <User size={20} />
                    <span>Profile</span>
                </Link>
            </div>
        </nav>
    );
}





