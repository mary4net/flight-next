import Link from "next/link";
import Navigation from "@/components/ui/navigation";

export default function Home() {
  return (
    <>
    <Navigation />
    <div>
      <h1>Home Page</h1>

      {/* Using Link to navigate to /booking */}
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
    </>
  );
}
