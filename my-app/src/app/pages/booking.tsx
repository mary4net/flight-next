"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

function Booking = () => {
    const router = useRouter();
    const { info } = router.query;

    const [booking, setBooking] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setError("Failed to fetch booking.");
            }
        } catch (err) {
            setError("Error fetching booking.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBooking = async () => {
        if (!info) {
            return;
        }

        try {
            const itinerary = Array.isArray(info) ? (info.length === 2 ? "ROUNDTRIP" : "ONEWAY") : 
                (typeof info === "object" && Object.keys(info).length > 0 ? "HOTEL_RESERVATION" : null);
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    itinerary
                    flights: Array.isArray(info) ? info : [],
                    hotelRoom: typeof info === "object" ? info : {},
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setBooking(data);
                fetchSuggestions();
            } else {
                setError("Failed to create booking.");
            }
        } catch (err) {
            setError("Error creating booking.");
        }
    };

    const handleUpdateBooking = async () => {
        if (!info || !booking) {
            return;
        }

        try {
            const response = await fetch("/api/updateBooking", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ info }),
            });
            const data = await response.json();
            if (response.ok) {
                setBooking(data);
                fetchSuggestions();
            } else {
                setError("Failed to update booking.");
            }
        } catch (err) {
            setError("Error updating booking.");
        }
    };

    const fetchSuggestions = async () => {
        try {
            const response = await fetch("/api/getSuggestions");
            const data = await response.json();
            if (response.ok) {
                setSuggestions(data);
            }
        } catch (err) {
            setError("Error fetching suggestions.");
        }
    };

    const handleBookAnother = () => {
        router.push("/checkout");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;


    return (
        <>
            <h1>Booking</h1>

            // fetch booking from getBooking API, 
            // if returned value is {} then createBooking if info is not null, else display No booking found
            // if returned value is not {} and if info is not null then updateBooking
            // if returned value is not {} and if info is null then display booking details
            
            // if booking is created or updated then fetch suggestions from getSuggestions API
            // if suggestions are fetched then display suggestions

            // provide a button, if getBooking returns non empty object or createBooking or updateBooking is successful then display "Book another" button, then we can press the button to go to checkout page
        </>
    )
}