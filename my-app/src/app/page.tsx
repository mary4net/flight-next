import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      
      {/* Using Link to navigate to /booking */}
      <Link href="/booking">
        Go to Booking
      </Link>
      <Link href="/hotelsearch">
        Go to Hotel
      </Link>
    </div>
  );
}
