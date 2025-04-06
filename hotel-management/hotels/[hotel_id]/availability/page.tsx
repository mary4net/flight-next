"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/ui/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function RoomAvailabilityPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { hotel_id } = params;
  const roomType = searchParams.get('roomType');
  
  // State
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableRooms, setAvailableRooms] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch hotel, room, and availability data
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
        
        // Fetch room details
        const roomsResponse = await fetch(`/api/hotels/${hotel_id}/rooms`);
        if (!roomsResponse.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const roomsData = await roomsResponse.json();
        const roomData = roomsData.find(r => r.type === roomType);
        if (!roomData) {
          throw new Error('Room type not found');
        }
        setRoom(roomData);
        
        // Fetch availability for the selected date
        await fetchAvailability(selectedDate);
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
  
  // Fetch availability for a specific date
  const fetchAvailability = async (date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/hotels/${hotel_id}/rooms/availability?date=${formattedDate}&roomType=${roomType}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      
      const data = await response.json();
      setAvailableRooms(data.availableRooms);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to fetch room availability. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    fetchAvailability(date);
  };
  
  // Handle updating available rooms
  const handleUpdateAvailability = async () => {
    try {
      setIsUpdating(true);
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/hotels/${hotel_id}/rooms/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
          roomType,
          availableRooms
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update availability');
      }
      
      toast({
        title: "Success",
        description: "Room availability updated successfully!",
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Navigate back to rooms page
  const handleBack = () => {
    router.push(`/hotel-management/hotels/${hotel_id}/rooms`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hotel ? hotel.name : 'Loading...'} - Room Availability
          </h1>
          <Button variant="outline" onClick={handleBack}>
            Back to Rooms
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
                <CardDescription>
                  {room?.type} - ${room?.pricePerNight.toFixed(2)} per night
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Amenities:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {room?.amenities && JSON.parse(room.amenities).map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Availability Management</CardTitle>
                <CardDescription>
                  Select a date to view and update room availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                  />
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="availableRooms" className="text-right">
                      Available Rooms
                    </Label>
                    <Input
                      id="availableRooms"
                      type="number"
                      min="0"
                      value={availableRooms}
                      onChange={(e) => setAvailableRooms(parseInt(e.target.value) || 0)}
                      className="col-span-3"
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateAvailability}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? 'Updating...' : 'Update Availability'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
} 