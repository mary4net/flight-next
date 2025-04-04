'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/ui/navigation';
import ImageCarousel from '@/components/ui/carousel';
import { formatDate, extractName, getItineraryLabel } from '@/utils/format';
import FlightResults from '@/components/search/flightResults';


interface HotelRoom {
  type: string;
  hotel: {
    name: string;
    address: string;
    city: string;
  };
  images?: string[];
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

interface Booking {
  id?: number;
  checkIn?: string;
  checkOut?: string;
  itinerary?: string;
  flights: Flight[];
  room?: HotelRoom;
  hotelCost?: number;
}

interface Hotel {
  id: number;
  name: string;
  logo?: string;
  address: string;
  city: string;
  starRating: number;
  images: string[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

interface Suggestion {
  hotels: Hotel[];
  checkIn: string;
}

interface BookingInfo {
  id: number;
  checkIn: string;
  checkOut: string;
  price: number;
  hotel: {
    name: string;
    address: string;
    city: string;
  };
  room: {
    type: string;
    hotel: {
      name: string;
      address: string;
      city: string;
    };
  };
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const infoEncoded = searchParams.get('bookings');
  const [infoParam, setInfoParam] = useState<BookingInfo | null>(
    infoEncoded ? JSON.parse(decodeURIComponent(infoEncoded)) : null
  );

  const [booking, setBooking] = useState<Booking>({ flights: [] });
  const [suggestions, setSuggestions] = useState<Suggestion>({ hotels: [], checkIn: '' });
  const [flightSuggestions, setFlightSuggestions] = useState({ results: [] });
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

      const hasFlights = Array.isArray(infoParam) && infoParam.length > 0;
      const hasHotel = infoParam && typeof infoParam === 'object' &&
            !Array.isArray(infoParam) &&
            Object.keys(infoParam).length > 0;

      if (response.ok) {
        setBooking(data);
        if (Object.keys(data).length === 0 && (hasHotel || hasFlights)) {
          handleCreateBooking(Boolean(hasHotel), Boolean(hasFlights));
        } else if (Object.keys(data).length > 0 && (hasHotel || hasFlights)) {
          handleUpdateBooking(data, Boolean(hasHotel), Boolean(hasFlights));
        } else if (Object.keys(data).length > 0 && !(hasHotel || hasFlights)) {
          fetchSuggestions("Shanghai", data);
        } else {
          setMessage("No booking found.");
        }
      } else {
        setMessage("No booking found.");
      }
    } catch (error) {
      setMessage('Error fetching booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (hasHotel: boolean, hasFlight: boolean) => {
    if (!hasHotel && !hasFlight) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: 'HOTEL_RESERVATION',
          flights: hasFlight ? infoParam : [],
          hotelRoom: hasHotel ? infoParam: {},
        }),
      });

      const data: Booking = await response.json();

      if (response.ok) {
        setInfoParam(null);
        setBooking(data);
        fetchSuggestions("Shanghai", data);
      } else {
        setMessage("Error creating booking.");
      }
    } catch (error) {
      const err = error as Error;
      setMessage(err.message || 'Error creating booking.');
    }
  };

  const handleUpdateBooking = async (data: Booking, hasHotel: boolean, hasFlight: boolean) => {
    if ((!hasHotel && !hasFlight) || !data) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id,
          addFlight: hasFlight ? infoParam : [],
          addHotel: hasHotel ? infoParam: {},
        }),
      });

      const res: Booking = await response.json();
      if (response.ok) {
        setInfoParam(null);
        setBooking(res);
        fetchSuggestions("Shanghai", res);
      } else {
        setMessage("Could not update booking, please try again.");
      }
    } catch (error) {
      setMessage("Error updating booking");
    }
  };

  const fetchSuggestions = async (origin: string, data: Booking) => {
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
        params.append('flightDestination', data.flights[0].destination.city);
        params.append('date', data.flights[0].arrivalTime);
      } else {
        params.append('hotel', data.room?.hotel.name ?? '');
        params.append('origin', origin);
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
        const data = await response.json();
        if (hasFlights) {
          setSuggestions(data);
        } else {
          setFlightSuggestions(data.message);
        }
      }
    } catch (error) {
      const err = error as Error;
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
                      <div key={flight.id} className="border-b pb-3">
                        <p><strong>Price:</strong> ${flight.price.toFixed(2)}</p>
                        <p>{flight.airline.name}</p>
                        <p>{flight.origin.city} → {flight.destination.city}</p>
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

        <div className="bg-yellow-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Suggestions</h2>
        

        {flightSuggestions?.results?.length > 0 ? (
          <>
            <FlightResults searchResults={flightSuggestions} />
          </>
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
