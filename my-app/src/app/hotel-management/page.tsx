"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/ui/navigation";
import { SimpleTabs, SimpleTabsList, SimpleTabsTrigger, SimpleTabsContent } from "@/components/ui/simple-tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useSimpleToast } from "@/components/ui/use-simple-toast";

// Hotel Management Dashboard
export default function HotelManagementPage() {
  const router = useRouter();
  const { toast, Toaster } = useSimpleToast();
  const [activeTab, setActiveTab] = useState("hotels");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/hotels/owned");
        
        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }
        
        const data = await response.json();
        setHotels(data);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load your hotels. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [toast]);

  const handleAddHotel = () => {
    router.push("/hotel-management/add-hotel");
  };

  const handleManageRooms = (hotelId) => {
    router.push(`/hotel-management/hotels/${hotelId}/rooms`);
  };

  const handleViewAvailability = (hotelId) => {
    router.push(`/hotel-management/hotels/${hotelId}/availability`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hotel Management</h1>
          <Button onClick={handleAddHotel}>Add New Hotel</Button>
        </div>

        <SimpleTabs defaultValue="hotels" value={activeTab} onValueChange={setActiveTab}>
          <SimpleTabsList className="mb-6">
            <SimpleTabsTrigger value="hotels">My Hotels</SimpleTabsTrigger>
            <SimpleTabsTrigger value="bookings">Bookings</SimpleTabsTrigger>
            <SimpleTabsTrigger value="availability">Availability</SimpleTabsTrigger>
          </SimpleTabsList>

          <SimpleTabsContent value="hotels">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-300">Loading your hotels...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 dark:text-gray-300">You don't have any hotels yet.</p>
                <Button className="mt-4" onClick={handleAddHotel}>Add Your First Hotel</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden">
                    <div className="h-48 relative">
                      <img
                        src={hotel.logo || "/default-hotel.jpg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-yellow-500">
                        {"★".repeat(hotel.starRating)}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{hotel.name}</CardTitle>
                      <CardDescription>{hotel.city}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{hotel.address}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => handleManageRooms(hotel.id)}>
                        Manage Rooms
                      </Button>
                      <Button variant="outline" onClick={() => handleViewAvailability(hotel.id)}>
                        View Availability
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </SimpleTabsContent>

          <SimpleTabsContent value="bookings">
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">Select a hotel to view its bookings.</p>
            </div>
          </SimpleTabsContent>

          <SimpleTabsContent value="availability">
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">Select a hotel to manage room availability.</p>
            </div>
          </SimpleTabsContent>
        </SimpleTabs>
      </div>
      <Toaster />
    </div>
  );
} 