"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/ui/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function HotelBookingsPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { hotel_id } = params;
  const roomType = searchParams.get('roomType');
  
  // State
  const [hotel, setHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Fetch hotel and bookings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch hotel details
        const hotelResponse = await fetch(`/api/hotels/${hotel_id}`);
        if (!hotelResponse.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        const hotelData = await hotelResponse.json();
        setHotel(hotelData);
        
        // Fetch bookings for this hotel and room type
        const bookingsResponse = await fetch(`/api/hotels/${hotel_id}/bookings?roomType=${roomType}`);
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [hotel_id, roomType, toast]);
  
  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setIsCancelling(true);
      
      const response = await fetch(`/api/hotels/${hotel_id}/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel booking');
      }
      
      // Update the bookings list
      setBookings(prev => prev.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'CANCELLED' }
          : booking
      ));
      
      // Close dialog and reset selected booking
      setIsCancelDialogOpen(false);
      setSelectedBooking(null);
      
      toast({
        title: "Success",
        description: "Booking cancelled successfully!",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Navigate back to rooms page
  const handleBack = () => {
    router.push(`/hotel-management/hotels/${hotel_id}/rooms`);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hotel ? hotel.name : 'Loading...'} - Bookings
          </h1>
          <Button variant="outline" onClick={handleBack}>
            Back to Rooms
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle>No Bookings Found</CardTitle>
              <CardDescription>
                There are no bookings for this room type.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Booking #{booking.id}</CardTitle>
                      <CardDescription>
                        {roomType} - {format(new Date(booking.checkInDate), 'MMM dd, yyyy')} to {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Guest Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Name: {booking.user.name}<br />
                        Email: {booking.user.email}<br />
                        Phone: {booking.user.phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Booking Details</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Number of Rooms: {booking.numberOfRooms}<br />
                        Total Price: ${booking.totalPrice.toFixed(2)}<br />
                        Created: {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsCancelDialogOpen(true);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                No, Keep Booking
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelBooking}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
} 