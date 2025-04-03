'use client';

interface ButtonProps {
	label: string;
	onClick?: () => void;
<<<<<<< HEAD
}

export default function Button({ label, onClick }: ButtonProps) {
	return (
		<button
			type="submit"
=======
	type?: "button" | "submit" | "reset";
}

export default function Button({ label, onClick, type = "submit" }: ButtonProps) {
	return (
		<button
			type={type}
>>>>>>> 6d13f44a3c38ae7bafd864ea9d1228baea90a703
			onClick={onClick}
			className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg"
		>
			{label}
		</button>
	)
};

