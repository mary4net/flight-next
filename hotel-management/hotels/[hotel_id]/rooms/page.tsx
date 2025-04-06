"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/ui/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HotelRoomsPage({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const { hotel_id } = params;
  
  // State
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false);
  
  // Form state for adding a new room
  const [formData, setFormData] = useState({
    type: '',
    amenities: '[]',
    pricePerNight: '',
    images: '[]'
  });
  
  // Fetch hotel and rooms data
  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        setLoading(true);
        
        // Fetch hotel details
        const hotelResponse = await fetch(`/api/hotels/${hotel_id}`);
        if (!hotelResponse.ok) {
          throw new Error('Failed to fetch hotel details');
        }
        const hotelData = await hotelResponse.json();
        setHotel(hotelData);
        
        // Fetch rooms for this hotel
        const roomsResponse = await fetch(`/api/hotels/${hotel_id}/rooms`);
        if (!roomsResponse.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const roomsData = await roomsResponse.json();
        setRooms(roomsData);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load hotel data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelAndRooms();
  }, [hotel_id, toast]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for adding a new room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.type || !formData.pricePerNight) {
        throw new Error('Please fill in all required fields');
      }
      
      // Convert price to number
      const pricePerNight = parseFloat(formData.pricePerNight);
      
      // Submit the form data
      const response = await fetch(`/api/hotels/${hotel_id}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pricePerNight
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add room');
      }
      
      const data = await response.json();
      
      // Add the new room to the state
      setRooms(prev => [...prev, data.room]);
      
      // Reset form and close dialog
      setFormData({
        type: '',
        amenities: '[]',
        pricePerNight: '',
        images: '[]'
      });
      setIsAddRoomDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Room added successfully!",
      });
    } catch (error) {
      console.error('Error adding room:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add room. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Navigate back to hotel management
  const handleBack = () => {
    router.push('/hotel-management');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {hotel ? hotel.name : 'Loading...'} - Room Management
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBack}>
              Back to Dashboard
            </Button>
            <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add New Room Type
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Room Type</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new room type to your hotel.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddRoom}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Room Type *
                      </Label>
                      <Input
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="col-span-3"
                        placeholder="e.g., Deluxe, Suite, Standard"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="pricePerNight" className="text-right">
                        Price/Night *
                      </Label>
                      <Input
                        id="pricePerNight"
                        name="pricePerNight"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.pricePerNight}
                        onChange={handleChange}
                        className="col-span-3"
                        placeholder="Enter price per night"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amenities" className="text-right">
                        Amenities
                      </Label>
                      <Textarea
                        id="amenities"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleChange}
                        className="col-span-3"
                        placeholder='Enter amenities as a JSON array, e.g., ["WiFi", "TV", "Mini-bar"]'
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="images" className="text-right">
                        Images
                      </Label>
                      <Textarea
                        id="images"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        className="col-span-3"
                        placeholder='Enter image URLs as a JSON array, e.g., ["url1", "url2"]'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Room Type</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading hotel and room data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : rooms.length === 0 ? (
          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle>No Room Types Found</CardTitle>
              <CardDescription>
                You haven't added any room types yet. Click the button above to add your first room type.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  {room.images && JSON.parse(room.images).length > 0 ? (
                    <img 
                      src={JSON.parse(room.images)[0]} 
                      alt={room.type} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{room.type}</CardTitle>
                  <CardDescription>
                    ${room.pricePerNight.toFixed(2)} per night
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Amenities:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {room.amenities && JSON.parse(room.amenities).map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/hotel-management/hotels/${hotel_id}/availability?roomType=${room.type}`)}
                  >
                    View Availability
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/hotel-management/hotels/${hotel_id}/bookings?roomType=${room.type}`)}
                  >
                    View Bookings
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 