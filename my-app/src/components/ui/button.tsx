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
			className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 
				text-white font-medium rounded-xl shadow-md transition-all duration-300 
				hover:from-blue-600 hover:to-blue-700 hover:shadow-lg 
				dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
		>
			{label}
		</button>
	);
};

