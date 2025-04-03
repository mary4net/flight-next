'use client';
import { useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import ImageCarousel from '@/components/ui/img';

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
			profilePicture?: string
		},
		doUpdate: boolean
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
	const [profilePicture, setProfilePicture] = useState(user.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F036%2F280%2F650%2Fnon_2x%2Fdefault-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg&f=1&nofb=1&ipt=ff33013f8fab355fcd1f7dc31eb5e869b21b77b46a56a81159a52cb4f6ec32f4&ipo=images');
	const [doUpdate, setDoUpdate] = useState(false);

	const handleSubmit = async () => {
		if (doUpdate) {
			const updatedUser = {
				email,
				password,
				firstName,
				lastName,
				phoneNumber,
				profilePicture,
			};
			onUpdateAction(updatedUser, doUpdate);
		} else {
			setEmail(user.email);
			setPassword(user.password);
			setFirstName(user.firstName);
			setLastName(user.lastName);
			setPhoneNumber(user.phoneNumber);
			setProfilePicture(user.profilePicture || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F036%2F280%2F650%2Fnon_2x%2Fdefault-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg&f=1&nofb=1&ipt=ff33013f8fab355fcd1f7dc31eb5e869b21b77b46a56a81159a52cb4f6ec32f4&ipo=images');
			onUpdateAction(user, doUpdate);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-16 max-w-screen-lg lg:max-w-screen-xl">
				<div className="text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
						{mode === "edit" ? 'Edit Profile' : `${firstName}'s Profile`}
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
						{mode === "edit" ? 'Modify your details and save changes.' : 'View your profile details.'}
					</p>
				</div>

				<div className="flex justify-center mb-8">
					<ImageCarousel images={[profilePicture]} />
				</div>

				{mode === "view" && (
					<div className="text-center mt-4 space-y-2">
						<p className="text-lg text-gray-700 dark:text-gray-300">
							<strong>Email:</strong> {user.email}
						</p>
						<p className="text-lg text-gray-700 dark:text-gray-300">
							<strong>Name:</strong> {user.firstName} {user.lastName}
						</p>
						<p className="text-lg text-gray-700 dark:text-gray-300">
							<strong>Phone:</strong> {user.phoneNumber}
						</p>
					</div>
				)}

				{mode === "edit" && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
						<Input label="Email" type="text" value={email} onChange={setEmail} />
						<Input label="Password" type="password" value={password} onChange={setPassword} />
						<Input label="First Name" type="text" value={firstName} onChange={setFirstName} />
						<Input label="Last Name" type="text" value={lastName} onChange={setLastName} />
						<Input label="Phone Number" type="text" value={phoneNumber} onChange={setPhoneNumber} />
						<Input label="Profile Picture" type="text" value={profilePicture} onChange={setProfilePicture} />
					</div>
				)}

				<div className="mt-8 flex justify-center space-x-4">
					<Button
						label={mode === "edit" ? "Save" : "Edit Profile"}
						onClick={() => {
							setDoUpdate(mode === 'edit' ? true : false);
							handleSubmit();
						}}
					/>

					{mode === "edit" && (
						<Button
							label={'Cancel'}
							onClick={() => {
								setDoUpdate(false);
								handleSubmit();
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

