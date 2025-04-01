'use client';

interface ButtonProps {
	label: string;
	onClick?: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
	return (
		<button
			type="submit"
			onClick={onClick}
			className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg"
		>
			{label}
		</button>
	)
};

