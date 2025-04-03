'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/button';
import Navigation from '@/components/ui/navigation';
import ImageCarousel from '@/components/ui/carousel';
import { formatDate, extractName, getItineraryLabel } from '@/utils/format';

interface Flight {
  flightId: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  flightCost: number;
  airline: string;
}

interface HotelRoom {
  type: string;
  hotel: {
    name: string;
    address: string;
    city: string;
  };
  images?: string[];
}

interface Booking {
  id?: number;
  checkIn?: string;
  checkOut?: string;
  itinerary?: string;
  flights: Flight[];
  room?: HotelRoom;
}

interface Hotel {
    name: string;
    address: string;
}
interface Suggestion {
  hotels: Hotel[];
  name: string;
}

interface Flight {
    id: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    availableSeats: number;
    currency: string;
    price: number;
    status: string;
    duration: number;
    origin: {
      city: string;
      code: string;
      country: string;
      name: string;
    };
    destination: {
      city: string;
      code: string;
      country: string;
      name: string;
    };
    airline: {
      code: string;
      name: string;
    };
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const infoEncoded = searchParams.get('bookings');
  let infoParam = infoEncoded ? JSON.parse(decodeURIComponent(infoParam)) : [];

  const [booking, setBooking] = useState<Booking>({ flights: [] });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [flightSuggestions, setFlightSuggestions] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: Booking = await response.json();

      if (response.ok) {
        setBooking(data);
        if (Object.keys(data).length === 0 && 
          (
            (Array.isArray(infoParam) && infoParam.length > 0) ||
            (typeof infoParam === 'object' && !Array.isArray(infoParam) && Object.keys(infoParam).length > 0)
          )
        ) {
          handleCreateBooking();
        } else if (Object.keys(data).length > 0 && 
          (
            (Array.isArray(infoParam) && infoParam.length > 0) ||
            (typeof infoParam === 'object' && !Array.isArray(infoParam) && Object.keys(infoParam).length > 0)
          )
        ) {
          handleUpdateBooking();
        } else if (Object.keys(data).length > 0 && 
          (
            (Array.isArray(infoParam) && infoParam.length === 0) ||
            (typeof infoParam === 'object' && !Array.isArray(infoParam) && Object.keys(infoParam).length === 0)
          )
        ){
          fetchSuggestions("Toronto", data);
        } else {
          setMessage("No booking found.");
        }
      } else {
        setMessage("No booking found.");
      }
    } catch (err) {
      setMessage(err.message || 'Error fetching booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!infoParam) return;

    try {
      const info = infoParam;

      const itinerary = Array.isArray(info)
        ? info.length === 2
          ? 'FLIGHT_ROUNDTRIP'
          : 'FLIGHT_ONEWAY'
        : typeof info === 'object'
        ? 'HOTEL_RESERVATION'
        : "";

      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary,
          flights: Array.isArray(info) ? info : [],
          hotelRoom: typeof info === 'object' ? info : {},
        }),
      });

      const data: Booking = await response.json();

      if (response.ok) {
        infoParam = [];
        setBooking(data);
        fetchSuggestions("Toronto");
      } else {
        setMessage("Error creating booking.");
      }
    } catch (err) {
      setMessage(err.message || 'Error creating booking.');
    }
  };

  const handleUpdateBooking = async () => {
    if (!infoParam || !booking) return;

    try {
      const info = JSON.parse(infoParam);

      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: booking.id,
          flights: Array.isArray(info) ? info : [],
          hotelRoom: typeof info === 'object' ? info : {},
        }),
      });

      const data: Booking = await response.json();
      if (response.ok) {
        setBooking(data);
        fetchSuggestions("Toronto");
      } else {
        setMessage('Failed to update booking.');
      }
    } catch (err) {
      setMessage('Error updating booking.');
    }
  };

  const fetchSuggestions = async (origin?: string, data: Booking) => {
    if (!data) return;

    const date = data.checkIn ? data.checkIn : data.flights[0]?.arrivalTime ? data.flights[0].arrivalTime : '';
    try {
      const itinerary = data.itinerary ?? '';
      const hasFlights = data.flights?.length > 0;

      const params = new URLSearchParams({
        itinerary,
        ...(date && { date }),
      });

      if (hasFlights) {
        params.append('flightDestination', data.flights[0].destination);
        params.append('date', data.flights[0].arrivalTime);
      } else {
        params.append('hotel', data.room?.hotel.name ?? '');
        params.append('origin', origin ?? '');
        params.append('destination', data.room?.hotel.city ?? '');
        params.append('date', data.checkIn ?? '');
      }

      const response = await fetch(`/api/bookings/suggestions?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const text = await response.json();
        setMessage(text.error.error);
      } else {
        const s: Suggestion[] = await response.json();
        if (hasFlights) {
            setFlightSuggestions(s);
        } else {
            setSuggestions(s);
        }
      }
    } catch (err) {
      setMessage('Error fetching suggestions.');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading)
    return (
      <>
        <Navigation />
        <div className="h-screen flex items-center justify-center">
          <p className="text-6xl text-center mt-4">Loading...</p>
        </div>
      </>
    );

  return (
    <>
      <Navigation />
      <p>{message}</p>
      <div className="mt-8 px-4">
        <h1 className="text-6xl font-bold mb-6">Cart</h1>

        {/* Booking Details */}
        <div className="bg-blue-300 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-3xl font-semibold text-black-700 mb-4">Booking Details</h2>
          {Object.keys(booking).length > 1 ? (
            <div className="bg-blue-100 p-4 rounded-lg text-blue-800">
            <div className="flex flex-col md:flex-row gap-6 w-full">
                {booking.room && (
                    <div className="bg-white p-4 rounded-lg border shadow w-full break-all md:w-1/2">
                    <div className="flex flex-col gap-4 w-full">
                      {/* Hotel Info */}
                      <div className="w-full text-sm sm:text-base leading-relaxed break-words whitespace-normal">
                        <p><strong>Hotel: ${booking.hotelCost}</strong></p>
                        <p>{booking.room.hotel.name}, {booking.room.hotel.address}</p>
                        <p>Room {booking.room.type}, {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}</p>
                      </div>
                  
                      {/* Carousel */}
                      {Array.isArray(booking.room.images) && booking.room.images.length > 0 && (
                          <ImageCarousel images={booking.room.images} />
                      )}
                    </div>
                  </div>                  
                )}

                {booking.flights?.length > 0 && (
                <div className="bg-white p-4 rounded-lg border shadow space-y-4 md:w-1/2">
                    <h3 className="text-lg font-semibold">Flights</h3>

                    {booking.flights.map(flight => (
                    <div key={flight.flightId} className="border-b pb-3">
                        <p><strong>Price:</strong> ${flight.flightCost}</p>
                        <p>{extractName(flight.airline)}</p>
                        <p>{extractName(flight.origin)} → {extractName(flight.destination)}</p>
                        <p>{formatDate(flight.departureTime)} — {formatDate(flight.arrivalTime)}</p>
                    </div>
                    ))}
                </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-500 text-center mt-4">
              No booking found. Please make a booking to see details.
            </p>
          )}
        </div>

        {/* Suggestions */}
        {/* <div className="bg-yellow-50 p-6 rounded-lg shadow-md mb-6">
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
        </div> */}

        <div className="bg-yellow-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Suggestions</h2>

        {flightSuggestions.length > 0 ? (
            <ul className="space-y-4">
            {flightSuggestions.map(flight => (
                <li key={flight.id} className="p-4 bg-white rounded-lg shadow border border-yellow-300">
                <div className="text-lg font-medium mb-1">
                    {flight.airline.name} ({flight.flightNumber})
                </div>
                <div className="text-sm text-gray-700">
                    <strong>From:</strong> {flight.origin.city} ({flight.origin.code}) – {flight.origin.name}<br />
                    <strong>To:</strong> {flight.destination.city} ({flight.destination.code}) – {flight.destination.name}<br />
                    <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}<br />
                    <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}<br />
                    <strong>Duration:</strong> {Math.floor(flight.duration / 60)}h {flight.duration % 60}m<br />
                    <strong>Price:</strong> {flight.currency} ${flight.price.toFixed(2)}<br />
                    <strong>Status:</strong> {flight.status}<br />
                    <strong>Available Seats:</strong> {flight.availableSeats}
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-center">No flight suggestions available at the moment.</p>
        )}
        </div>
        
        <p>{message}</p>
        {/* Go to Checkout */}
        <div className="mt-8 text-center">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={handleCheckout}
          >
            Go to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
