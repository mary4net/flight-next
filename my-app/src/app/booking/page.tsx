'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/ui/navigation';


interface Booking { 
    id: number;
    checkIn?: string;
    checkOut?: string;
    hotelCost?: number;
    room?: {
        hotel: { name: string, address: string };
        type: string;
    };
    flights?: {
        flightId: number;
        flightCost: number;
        airline: string;
        origin: string;
        destination: string;
    }[];
    status: string;
 }

export default function Records() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async (): Promise<void> => {
    try {
        const response = await fetch('/api/records', {
            method: 'GET' 
        });
        const data = await response.json();
        const test = [{
            "id": 1,
            "userId": 1,
            "itinerary": "HOTEL_RESERVATION",
            "hotelCost": 600,
            "checkIn": "2025-03-11T00:00:00.000Z",
            "checkOut": "2025-03-15T00:00:00.000Z",
            "roomId": 1,
            "room": {
                "type": "302",
                "hotel": {name: "Hilton Hotel", address: "123 Main St, New York, NY 10001"},
                "images": ["https://www.thespruce.com/thmb/2_Q52GK3rayV1wnqm6vyBvgI3Ew=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg"]
            },
            "bookRef": null,
            "ticketNum": null,
            "status": "CONFIRMED",
            "createdAt": "2025-03-08T23:54:12.775Z",
            "updatedAt": "2025-03-08T23:55:48.230Z"
        }]
        setBookings(test);
        if (response.ok) {
            setBookings(data);
        } else {
            setMessage(response.statusText);
        }
    } catch (error) {
        setMessage('Error fetching booking.');
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  const verifyFlight = async (id: number) => {
    const res = await fetch(`/api/records/${id}/verify`, { method: 'GET' });
    const result = await res.json();
    setMessage(result.message || 'Flight verified!');
  };

  const cancelBooking = async (id: number) => {
    const res = await fetch(`/api/records/${id}`, { method: 'PATCH' });
    if (res.ok) {
        const data = await res.json();
        if (data.status && data.status === 'CANCELED') {
            setBookings(prev =>
                prev.map(b =>
                  b.id === id
                    ? {
                        ...b,
                        status: 'CANCELED',
                        hotelCost: 0,
                        room: undefined,
                        flights: [],
                      }
                    : b
                )
            );
        } else if (data.status) {
            setBookings(prev =>
                prev.map(b =>
                    b.id === id
                        ? {
                            ...b,
                            hotelCost: data.hotelCost ?? undefined,
                            checkIn: data.checkIn ?? undefined,
                            checkOut: data.checkOut ?? undefined,
                            flights: data.flights ?? [],
                        }
                        : b
                )
            );
        } else {
            setMessage('Deletion failed.')
        }
    }
  };

  const getItineraryLabel = (code: string): string => {
    switch (code) {
      case 'HOTEL_RESERVATION':
        return 'Hotel Reservation';
      case 'FLIGHT_ONEWAY':
        return 'One-way Flight';
      case 'FLIGHT_ROUNDTRIP':
        return 'Roundtrip Flight';
      case 'ONEWAY_AND_HOTEL':
        return 'One-way Flight and Hotel';
      case 'ROUNDTRIP_AND_HOTEL':
        return 'Roundtrip Flight and Hotel';
      default:
        return 'Unknown Itinerary';
    }
  };

  const formatDate = (dateStr?: string) => {
    return dateStr ? new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';
  };

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
    <Navigation />
    <div className="bg-white shadow-2xl rounded-lg p-6 min-h-screen max-w-4xl mx-auto mt-6">
        <h1 className="text-center text-2xl font-bold mb-6">My Bookings</h1>

        {sortedBookings.map((booking, index) => (
        <div
            key={booking.id}
            className={`border rounded-lg mb-4 p-4 shadow ${
            booking.status === 'CANCELED' ? 'bg-gray-100 text-gray-500' : 'bg-blue-300'
            }`}
        >
            <div
            className={`flex justify-between items-center ${
                booking.status !== 'CANCELED' ? 'cursor-pointer' : ''
            }`}
            onClick={() => booking.status !== 'CANCELED' && toggleExpand(booking.id)}
            >
            <span className="font-semibold">
                #{index+1} - {getItineraryLabel(booking.itinerary)}<br/>
            </span>
            <span>
                {booking.status === 'CANCELED'
                ? '❌ Cancelled'
                : expanded === booking.id
                ? '▲'
                : '▼'}
            </span>
            </div>

            {/* Expanded details (only if not canceled and expanded) */}
            {booking.status !== 'CANCELED' && expanded === booking.id && (
            <div className="mt-4 space-y-3">
                {/* Hotel Info */}
                {booking.room && (
                <div className="flex flex-row justify-between items-start gap-4 mt-4">
                    <div className="flex-1">
                    <strong>Hotel: ${booking.hotelCost}</strong> <br />
                    {booking.room.hotel.name}, {booking.room.hotel.address} <br />
                    Room {booking.room.type}, {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                    </div>

                    {Array.isArray(booking.room.images) && booking.room.images.length > 0 && (
                    <div className="flex-shrink-0 max-w-[20px] max-h-[20px] rounded overflow-hidden shadow border border-gray-300">
                        <img
                        src={booking.room.images[0]}
                        alt="Room"
                        className="w-full h-full max-h-[10px] max-w-[10px] object-cover"
                        />
                    </div>
                    )}
                </div>
                )}

                {/* Flights Info */}
                {booking.flights?.length ? (
                <div>
                    <strong>Flights:</strong>
                    <ul className="list-disc ml-6">
                    {booking.flights.map(flight => (
                        <li key={flight.flightId}>
                        {flight.origin} → {flight.destination} ({flight.airline}) – ${flight.flightCost}
                        </li>
                    ))}
                    </ul>
                </div>
                ) : null}

                <div>
                <strong>Total:</strong> $
                {booking.hotelCost + (booking.flights?.reduce((acc, f) => acc + f.flightCost, 0) ?? 0)}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-2">
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => verifyFlight(booking.id)}
                >
                    Verify Flight
                </button>
                <a
                    href={`/api/records/${booking.id}/invoice`}
                    target="_blank"
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                    Get Invoice
                </a>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => cancelBooking(booking.id)}
                >
                    Cancel Booking
                </button>
                </div>
            </div>
            )}
        </div>
        ))}

    </div>

    </>
  );
}
