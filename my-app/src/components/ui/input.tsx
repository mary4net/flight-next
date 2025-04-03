'use client';

interface InputProps {
	label: string;
	type?: 'text' | 'password';
	value: string;
	onChangeAction: (value: string) => void;
}

export default function Input({ label, type, value, onChangeAction }: InputProps) {
	return (
		<div>
			<label
				className="block text-gray-700 dark:text-gray-300 font-medium">
				{label}
			</label>
			<input
				type={type}
				placeholder={label}
				value={value}
				onChange={(e) => onChangeAction(e.target.value)}
				className="mt-1 block w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
			/>
		</div>
	);
}

