'use client';
import { useState } from 'react';
import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/button';

interface ProfileFormProps {
	mode: 'edit' | 'view'
	user: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
		profilePicture?: string;
	}
	onUpdateAction: (
		user: {
			email: string;
			password: string;
			firstName: string;
			lastName: string;
			phoneNumber: string;
			profilePicture: string
		}
	) => void;
}

export default function ProfileForm(
	{ mode, user, onUpdateAction }: ProfileFormProps
) {
	const [email, setEmail] = useState(user.email);
	const [password, setPassword] = useState(user.password)
	const [firstName, setFirstName] = useState(user.firstName);
	const [lastName, setLastName] = useState(user.lastName);
	const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
	const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const updatedUser = {
			email,
			password,
			firstName,
			lastName,
			phoneNumber,
			profilePicture,
		};
		onUpdateAction(updatedUser);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-sm mx-auto p-4 border rounded-lg shadow-md"
		>
			<h2 className="text-xl font-bold mb-4">
				{mode == "edit" ? 'Editing: ' : `${user.firstName}'s Profile`}
			</h2>
			{mode == "view" &&
				(<>
					{email && <h3>email: {email}</h3>}
					{firstName && <h3>first name: {firstName}</h3>}
					{lastName && <h3>last name: {lastName}</h3>}
					{phoneNumber && <h3>phone number: {phoneNumber}</h3>}
				</>)
			}

			{mode == "edit" &&
				<Input
					label="email"
					type="text"
					value={email}
					onChange={setEmail}
				/>
			}
			{mode == "edit" &&
				<Input
					label="Password"
					type="password"
					value={password}
					onChange={setPassword}
				/>
			}
			{mode == "edit" &&
				<Input
					label="First Name"
					type="text"
					value={firstName}
					onChange={setFirstName}
				/>
			}
			{mode == "edit" &&
				<Input
					label="Last Name"
					type="text"
					value={lastName}
					onChange={setLastName}
				/>
			}
			{mode == "edit" &&
				<Input
					label="phone number"
					type="text"
					value={phoneNumber}
					onChange={setPhoneNumber}
				/>
			}
			{mode == "edit" &&
				<Input
					label="profile picture"
					type="text"
					value={profilePicture}
					onChange={setProfilePicture}
				/>
			}

			<Button
				label={mode == "edit" ? "Save" : "Edit Profile"}
			/>

			{mode == "edit" &&
				<Button
					label={'Cancel'}
					type="button"
				/>
			}
		</form>
	);
}

