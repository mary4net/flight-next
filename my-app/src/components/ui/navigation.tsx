'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, ShoppingCart, User, Plane, Hotel, Building } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/ui/context';

interface NavigationProps {}

export default function Navigation({}: NavigationProps): JSX.Element {
    const [darkMode, toggleDarkMode] = useTheme();
    const [isHotelOwner, setIsHotelOwner] = useState(false);

    // Check if the user is a hotel owner
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const response = await fetch('/api/users/me');
                if (response.ok) {
                    const userData = await response.json();
                    setIsHotelOwner(userData.role === 'HOTEL_OWNER');
                }
            } catch (error) {
                console.error('Error checking user role:', error);
            }
        };
        
        checkUserRole();
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-opacity-90 ${
            darkMode ? 'bg-gray-900/90' : 'bg-white/90'
        } border-b ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
            <div className="w-full px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Plane className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            FlyNext
                        </h1>
                    </Link>

                    {/* Main Navigation */}
                    <ul className="hidden md:flex items-center space-x-8">
                        <li>
                            <Link 
                                href="/" 
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                    darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'
                                }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/flights" 
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                    darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'
                                }`}
                            >
                                Flights
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/hotelsearch" 
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                    darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'
                                }`}
                            >
                                Hotels
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/booking" 
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                    darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'
                                }`}
                            >
                                Bookings
                            </Link>
                        </li>
                        {isHotelOwner && (
                            <li>
                                <Link 
                                    href="/hotel-management" 
                                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                                        darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600'
                                    }`}
                                >
                                    Manage Hotels
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        <Link 
                            href="/cart" 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                                darkMode 
                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-400' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                        >
                            <ShoppingCart size={20} />
                            <span className="text-sm font-medium">Cart</span>
                        </Link>

                        <button 
                            onClick={toggleDarkMode} 
                            className={`p-2 rounded-lg transition-colors ${
                                darkMode 
                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-400' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link 
                            href="/user/profile" 
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                darkMode 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            <User size={20} />
                            <span className="text-sm font-medium">Profile</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 rounded-lg">
                        <svg 
                            className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}





