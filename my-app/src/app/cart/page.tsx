"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from '@/components/ui/button';
import Navigation from '@/components/ui/navigation';


function Booking() {
    const router = useRouter();
    const { info } = router.query || {};

    const [booking, setBooking] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async () => {
        try {
            const response = await fetch("/api/bookings", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();

            if (response.ok) {
                setBooking(data);
                if (Object.keys(data).length === 0) {
                    handleCreateBooking();
                } else if (info) {
                    handleUpdateBooking();
                } else {
                    fetchSuggestions();
                }
            } else {
                setMessage(response.statusText);
            }
        } catch (err) {
            setMessage("Error fetching booking.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBooking = async () => {
        if (!info) {
            return;
        }

        try {
            const itinerary = Array.isArray(info) ? (info.length === 2 ? "FLIGHT_ROUNDTRIP" : "FLIGHT_ONEWAY") : 
                (typeof info === "object" && Object.keys(info).length > 0 ? "HOTEL_RESERVATION" : null);
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    itinerary,
                    flights: Array.isArray(info) ? info : [],
                    hotelRoom: typeof info === "object" ? info : {},
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setBooking(data);
                fetchSuggestions();
            } else {
                setMessage("Failed to create booking.");
            }
        } catch (err) {
            setMessage("Error creating booking.");
        }
    };

    const handleUpdateBooking = async () => {
        if (!info || !booking) {
            return;
        }

        try {
            const response = await fetch("/api/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: booking.id,
                    flights: Array.isArray(info) ? info : [],
                    hotelRoom: typeof info === "object" ? info : {},
                 }),
            });
            const data = await response.json();
            if (response.ok) {
                setBooking(data);
                fetchSuggestions();
            } else {
                setMessage("Failed to update booking.");
            }
        } catch (err) {
            setMessage("Error updating booking.");
        }
    };

    const fetchSuggestions = async (origin, date) => {
        if (!booking) return;
        try {
            const itinerary = booking.itinerary;
            const hasFlights = booking.flights.length > 0;
            // need to choose origin & date

            const params = new URLSearchParams({
                itinerary,
                date,
            });
    
            if (hasFlights) {
                params.append("flightDestination", booking.flights[0].destination);
            } else {
                params.append("hotel", hotel);
                params.append("origin", origin);
                params.append("destination", booking.flights[0]?.destination || ""); 
            }
    
            const response = await fetch(`/api/bookings/suggestions?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                setMessage("Failed to fetch suggestions.");
            } else {
                const data = await response.json();
                setSuggestions(data);
            }
        } catch (err) {
            setMessage("Error fetching suggestions.");
        }
    };

    const handleCheckout = async (info) => {
        router.push("/checkout");
    };

    if (loading) return <><Navigation /> <div className="h-screen flex items-center justify-center">
        <p className="text-6xl text-center mt-4">Loading...</p>
    </div></>;

    return (
        <>
        <Navigation />
        <div className="mt-8 px-4">
            <h1 className="text-6xl font-bold mb-6">Cart</h1>

            {/* Booking Details Section */}
            <div className="bg-blue-300 p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-3xl font-semibold text-black-700 mb-4">Booking Details</h2>
            {Object.keys(booking).length > 0 ? (
                <pre className="bg-blue-100 p-4 rounded-lg text-blue-800">
                {JSON.stringify(booking, null, 2)}
                </pre>
            ) : (
                <p className="text-lg text-gray-500 text-center mt-4">No booking found. Please make a booking to see details.</p>
            )}
            </div>

            {/* Suggestions Section */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-3xl font-semibold text-yellow-700 mb-4">Suggestions</h2>
            {suggestions.length > 0 ? (
                <ul className="space-y-4">
                {suggestions.map((item) => (
                    <li key={item.id} className="p-4 bg-yellow-100 rounded-lg shadow-sm hover:bg-yellow-200 transition">
                    <p className="text-lg font-medium text-yellow-800">{item.name}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-lg text-gray-500 text-center mt-4">No suggestions available at the moment.</p>
            )}
            </div>

            {/* Checkout Button for Booking */}
            {Object.keys(booking).length > 0 && (
            <div className="flex justify-end mt-6">
                <Button
                    label={"Add to your trip"}
                />

                {/* <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                Book Another
                </button> */}
            </div>
            )}

            {/* Go to Checkout Button */}
            <div className="mt-8 text-center">
            <button
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => handleCheckout(info)}
            >
                Go to Checkout
            </button>
            </div>
        </div>
        </>


    );
}

export default Booking;