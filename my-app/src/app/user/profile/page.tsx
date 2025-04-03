'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import ProfileForm from '@/components/ui/profileForm';

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
		}
	) => {
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
	};

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-4">Profile</h2>

			{user ?
				<ProfileForm
					mode={mode}
					user={user}
					onUpdateAction={handleUpdate}
				/>
				: <p>
					<Link href="@/app/user/login">
						Go to Login
					</Link>
				</p>

			}
			{message}
		</div>
	)
}
