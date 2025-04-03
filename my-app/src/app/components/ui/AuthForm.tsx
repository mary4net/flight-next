'use client';
import { useState } from 'react';
import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/button';

interface AuthFormProps {
	mode: 'login' | 'signup';
	onSubmitAction: (
		data: {
			email: string;
			password: string;
			firstName?: string;
			lastName?: string;
			phoneNumber?: string;
			isHotelOwner?: boolean
		}
	) => void;
}

export default function AuthForm({ mode, onSubmitAction }: AuthFormProps) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [isHotelOwner, setIsHotelOwner] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		onSubmitAction({ email, password, firstName, lastName, phoneNumber, isHotelOwner });
		setEmail("");
		setPassword("");
		setFirstName("");
		setLastName("");
		setPhoneNumber("");
		setIsHotelOwner(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-sm mx-auto p-4 border rounded-lg shadow-md"
		>
			<h2 className="text-xl font-bold mb-4">
				{mode == "signup" ? 'Sign Up' : 'Login'}
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
			{mode == "signup" &&
				<Input
					label="First Name"
					type="text"
					value={firstName}
					onChange={setFirstName}
				/>
			}
			{mode == "signup" &&
				<Input
					label="Last Name"
					type="text"
					value={lastName}
					onChange={setLastName}
				/>
			}
			{mode == "signup" &&
				<Input
					label="phone number"
					type="text"
					value={phoneNumber}
					onChange={setPhoneNumber}
				/>
			}
			{mode == "signup" && (
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
				label={mode == "signup" ? "Sign Up" : "Login"}
			/>
		</form>

	)
};
