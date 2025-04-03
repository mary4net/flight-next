'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import ProfileForm from '@/components/ui/profileForm';
import Navigation from "@/components/ui/navigation";

export default function ProfilePage() {
	const [mode, setMode] = useState<'edit' | 'view'>('view');
	const [user, setUser] = useState<
		{
			email: string;
			password: string;
			firstName: string;
			lastName: string;
			phoneNumber: string;
			profilePicture?: string
		} | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		// get profile info of curr user
		fetch('/api/users', { cache: "no-store", method: 'GET' })
			.then((res) => res.json())
			.then((data) => {
				console.log("Fetched user data:", data);
				setUser(data.user)
			})
			.catch((error) => console.error('Error fetching profile:', error));
	}, []);


	const handleUpdate = async (
		updatedUser: {
			email: string;
			password: string;
			firstName: string;
			lastName: string;
			phoneNumber: string;
			profilePicture?: string
		},
		doUpdate: boolean
	) => {
		if (!doUpdate) {
			setMode(mode === 'view' ? 'edit' : 'view')
		} else {
			try {
				const endpoint = '/api/users';
				const body = updatedUser;

				const response = await fetch(endpoint, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(body),
				});

				const responseData = await response.json();

				if (!response.ok) {
					setMessage(responseData.error || 'Something went wrong');
				} else {
					setUser(responseData);
					console.log('Profile update successful:', responseData);
					setMode(mode === 'view' ? 'edit' : 'view')
					setMessage('Profile update successful!');
				}
			} catch (error) {
				console.error('Unexpected error occurred:', error);
				setMessage('Unexpected error occurred');
			}
		}
	};

	return (
		<>
			<Navigation />
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
							{user ? (
								<ProfileForm
									mode={mode}
									user={user}
									onUpdateAction={handleUpdate}
								/>
							) : (
								<div className="text-center py-12">
									<p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
										You are not logged in. Please login to continue.
									</p>
									<Link 
										href="/user/login"
										className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
									>
										Click Here to Login
									</Link>
								</div>
							)}
							{message && (
								<div className={`mt-6 p-4 rounded-lg text-center ${
									message.includes('successful') 
										? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
										: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
								}`}>
									{message}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
