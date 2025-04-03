import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>

      {/* Using Link to navigate to /booking */}
      <Link href="/notification">
      Go to notif
    </Link>
      <p>
        <Link href="/booking">
          Go to Booking
        </Link>
      </p>


      <p>
        <Link href="/hotelsearch">
          Go to Hotel
        </Link>
      </p>

      <p>
        <Link href="/user/login">
          Login
        </Link>
      </p>
    </div>
  );
}
