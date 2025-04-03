'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Navigation from '@/components/ui/navigation';


interface Booking {
    hotelCost?: number;
    room?: {
        hotel: { name: string };
        type: string;
    };
    checkIn?: string;
    checkOut?: string;
    flights?: {
        id: number;
        flightCost: number;
        airline: string;
        origin: string;
        destination: string;
        departTime: string;
        arrivalTime: string;
    }[];
}

export default function Checkout() {
    const [bookings, setBookings] = useState<Booking>({ flights : [] });
    const [totalCost, setTotalCost] = useState<number>(0);
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        passportNumber: ''
    });
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async (): Promise<void> => {
        try {
            const response = await fetch('/api/bookings/checkout', {
                method: 'GET' 
            });
            const data = await response.json();

            if (response.ok) {
                setBookings(data);
                let total = data.hotelCost ?? 0;
                total += data.flights?.reduce((acc, flight) => acc + flight.flightCost, 0) ?? 0;
                setTotalCost(total);
            } else {
                setMessage(response.statusText);
            }
        } catch (error) {
            setMessage('Error fetching booking.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;

        if (name === 'expiry') {
            value = value.replace(/\D/g, ''); 
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4); 
            }
        }

        setPaymentInfo({ ...paymentInfo, [name]: value });
    };

    const handleCheckout = async () => {
        try {
            const [expiryMonth, expiryYear] = paymentInfo.expiry.split('/');
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardNumber: paymentInfo.cardNumber,
                    expiryMonth,
                    expiryYear,
                    cvv: paymentInfo.cvv,
                    booking: bookings,
                    passportNumber: paymentInfo.passportNumber
                })
            });
            
            const result = await response.json();
            if (response.ok) {
                setMessage('Payment successful!');
            } else {
                setMessage(result.error || 'Payment failed. Please make sure the inputs are all in valid format.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setMessage('Payment failed. Please try again later.');
        }
    };

    return (
        <>
        <Navigation />
        <div className="flex flex-col sm:flex-row justify-center w-full gap-8 p-8 md:p-10">
        <div className="md:w-1/2 p-6 bg-white shadow-lg rounded-lg mt-6">

            <h2 className="text-2xl font-semibold mt-6">Payment</h2>
            <div className="space-y-4 mt-4">
                <input 
                    type="text" 
                    name="cardNumber" 
                    placeholder="Card Number" 
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <input 
                    type="text" 
                    name="expiry" 
                    placeholder="Expiry Date (MM/YY)" 
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <input 
                    type="text" 
                    name="cvv" 
                    placeholder="CVV" 
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <input 
                    type="text" 
                    name="passportNumber" 
                    placeholder="Passport Number (Only required for flight booking)" 
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                />
                <p className="text-red-600">{message}</p>
                <button onClick={handleCheckout} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                    Pay ${totalCost.toFixed(2)}
                </button>
            </div>
        </div>

        <div className="md:w-1/2 p-6 bg-white shadow-lg rounded-lg mt-6">
            <h2 className="text-2xl font-semibold">{bookings.flights ? bookings.flights.length + (bookings.hotelCost ? 1: 0) : 0} Item</h2>
            <ul className="divide-y divide-gray-300">
                {bookings.hotelCost && (
                    <li className="flex justify-between py-2">
                        <span>Hotel</span>
                        <span className="font-semibold">${bookings.hotelCost.toFixed(2)}</span>
                        <span>{bookings.room.hotel.name}, {bookings.room.type}</span>
                        <span>{bookings.checkIn} -- {bookings.checkOut}</span>
                    </li>
                )}
                {bookings.flights && bookings.flights.map(flight => (
                    <li key={flight.id} className="flex justify-between py-2">
                        <span>Flight</span>
                        <span className="font-semibold">${flight.flightCost.toFixed(2)}</span>
                        <span>{flight.airline}</span>
                        <span>{flight.origin} to {flight.destination}</span>
                        <span>{flight.departTime} -- {flight.arrivalTime}</span>
                    </li>
                ))}
                <div className="relative">
                <div className="text-xl font-semibold mt-4">Total: ${totalCost.toFixed(2)}</div>
                </div>
            </ul>
        </div>
        </div>
        </>
    );
}

  
