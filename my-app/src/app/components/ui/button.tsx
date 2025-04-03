'use client';

interface ButtonProps {
	label: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
}

export default function Button({ label, onClick, type = "submit" }: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg"
		>
			{label}
		</button>
	)
};

