'use client';

interface InputProps {
	label: string;
	type: 'text' | 'password';
	value: string;
	onChange: (value: string) => void;
}

export default function Input({ label, type, value, onChange }: InputProps) {
	return (
		<div className="mb-4">
			<label className="block text-gray-700">{label}</label>
			<input
				type={type}
				placeholder={label}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="w-full py-2 pl-4 pr-4 rounded-lg border border-gray-300"
			/>
		</div>
	);
}

