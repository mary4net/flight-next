"use client"; // Ensure this is at the top for client-side rendering

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // Import Next.js dynamic module
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/app/components/ui/dialog";

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const HotelSearchPage = () => {
    const [priceFilterVisible, setPriceFilterVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRoomType, setSearchRoomType] = useState('');
    const [starRating, setStarRating] = useState<number | "">("");
    const [startingPrice, setStartingPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(50000000);
    const [checkInDate, setCheckInDate] = useState<string | "">("");
    const [checkOutDate, setCheckOutDate] = useState<string | "">("");
    const [hotelResults, setHotelResults] = useState<any[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
    const [checkInRoomDate, setCheckInRoomDate] = useState<string | "">("");
    const [checkOutRoomDate, setCheckOutRoomDate] = useState<string | "">("");
    const [city, setCity] = useState<string | "">("");
    const [uniqueHotels, setUniqueHotels] = useState<any[]>([]);
    const [selectedHotelRooms, setSelectedHotelRooms] = useState<any[]>([]);

    const fetchHotelRooms = async (hotelId: number, checkIn: string, checkOut: string) => {
        const params = new URLSearchParams();
        params.append("dateStart", checkIn);
        params.append("dateEnd", checkOut);

        try {
            console.log(`Fetching rooms for hotel ${hotelId} with dates:`, { checkIn, checkOut });
            const fetchResponse = await fetch(`/api/hotels/${hotelId}/rooms?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (!fetchResponse.ok) {
                const errorText = await fetchResponse.text();
                console.error('Server response:', {
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    body: errorText
                });
                throw new Error(`Network response was not ok: ${fetchResponse.status} ${fetchResponse.statusText}`);
            }
            
            const data = await fetchResponse.json();
            console.log('Fetched room data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            return [];
        }
    };

    const openSelectedHotel = async (hotel: any) => {
        setSelectedHotel(hotel);
        setSelectedHotelRooms(hotelResults.filter(room => room.hotel.id === hotel.hotel.id));
    };

    const handleRoomDateChange = async () => {
        if (!selectedHotel) return;
        
        // Call handleSearchAvailability when dates change
        handleSearchAvailability();
    };

    const closeHotelDetails = () => {
        setSelectedHotel(null);
        setSelectedHotelRooms([])
    };

    const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent page reload
        
        // Construct the query string from parameters
        const params = new URLSearchParams();
        // Always include parameters, even if empty
        params.append("checkinDate", checkInDate || "");
        params.append("checkoutDate", checkOutDate || "");
        params.append("city", city || "");
        params.append("star", starRating ? String(starRating) : "");
        params.append("name", searchTerm || "");
        params.append("lowerpriceRange", String(startingPrice));
        params.append("upperpriceRange", String(maxPrice));

    
        try {
            const fetchResponse = await fetch(`/api/hotels?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (!fetchResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await fetchResponse.json(); // Extract JSON data
            console.log("Fetched hotels:", data); // Debugging log
            setHotelResults(data); // Set the actual hotel data in state
            console.log("hotelResults", hotelResults)
            setUniqueHotels(data.filter((hotel: any, index: number, self: any[]) => 
                index === self.findIndex((h) => h.hotel.id === hotel.hotel.id) // Keep only first occurrence
            ));
            
        } catch (error) {
            console.error("Error fetching hotels:", error);
        }
    };
    

    const handlePriceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPriceFilterVisible((prev) => !prev);
    };

    const handleStarRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStarRating(Number(e.target.value));
        console.log("star rating:", starRating);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "max") => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            if (type === "start") {
                setStartingPrice(value);
            } else {
                setMaxPrice(value);
            }
        }
        console.log("max val", maxPrice);
        console.log("min val", startingPrice);
    };

    // Add a new function to handle room availability search
    const handleSearchAvailability = async () => {
        if (!selectedHotel || !selectedHotel.hotel) return;

        try {
            if (checkInRoomDate && checkOutRoomDate) {
                // Make sure we're using the correct hotel ID
                const hotelId = selectedHotel.hotel.id;
                console.log('Searching rooms for hotel:', hotelId);

                // If dates are provided, fetch from API
                const rooms = await fetchHotelRooms(hotelId, checkInRoomDate, checkOutRoomDate);
                console.log('Fetched rooms:', rooms);

                let filteredRooms = rooms;

                // Apply room type filter if provided
                if (searchRoomType) {
                    filteredRooms = rooms.filter((room: any) => 
                        room.type.toLowerCase().includes(searchRoomType.toLowerCase())
                    );
                }

                setSelectedHotelRooms(filteredRooms);
            } else {
                // If no dates, show all rooms from initial results
                let rooms = hotelResults.filter(room => room.hotel.id === selectedHotel.hotel.id);
                
                // Apply room type filter if provided
                if (searchRoomType) {
                    rooms = rooms.filter((room: any) => 
                        room.type.toLowerCase().includes(searchRoomType.toLowerCase())
                    );
                }

                setSelectedHotelRooms(rooms);
            }
        } catch (error) {
            console.error('Error searching rooms:', error);
            setSelectedHotelRooms([]);
        }
    };

    return (
        <div className="container mx-auto mt">
            <form className="flex flex-col md:flex-row w-l max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg m-10" onSubmit={handleSearchSubmit}>
                <div className="flex flex-col w-900 mb-4 md:mb-0 m-2">
                    <input
                        type="text"
                        placeholder="Search for hotels"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        placeholder="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex space-x-4">
                        <input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full mb-4 md:mb-0 m-2">
                    <select
                        value={starRating}
                        onChange={handleStarRatingChange}
                        className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    >
                        <option value="">Guest Rating</option>
                        <option value={1}>1 Star</option>
                        <option value={2}>2 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={5}>5 Stars</option>
                    </select>

                    <button
                        onClick={handlePriceClick}
                        className="py-2 pl-4 pr-4 px-2 rounded-lg border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    >
                        Price Range
                    </button>
                    {priceFilterVisible && (
                        <div className="absolute mt-2 p-4 border rounded-lg bg-white shadow-md w-72">
                            <div className="flex flex-col justify-between items-center mb-2">
                                {/* Close Button */}
                                <button
                                    onClick={handlePriceClick} // Function to close the price filter
                                    className="text-red-500 font-semibold text-lg"
                                    aria-label="Close price filter"
                                >
                                    Close
                                </button>

                                {/* Price Filters */}
                                <div className="flex flex-row space-x-2 w-full">
                                    <input
                                        type="number"
                                        placeholder="Min Price"
                                        value={startingPrice}
                                        className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 w-32"
                                        min="0"
                                        onChange={(e) => handlePriceChange(e, "start")}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Price"
                                        value={maxPrice}
                                        className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 w-32"
                                        min="0"
                                        onChange={(e) => handlePriceChange(e, "max")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                <button
                    type="submit"
                    className=" py-2 pl-4 pr-4 px-2 w-full bg-blue-500 text-white py-2 rounded-lg my-3"
                >
                    Search Hotels
                </button>

                </div>
            </form>

            {/* Display Hotel Results */}

            <div className="mt-12 flex justify-center items-center">
                {uniqueHotels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {uniqueHotels.map((eachhotel, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 mb-6" onClick={() => openSelectedHotel(eachhotel)}>
  
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{eachhotel.hotel.name}</h3>
                                <p className="text-gray-500 mb-2">Rating: {eachhotel.hotel.starRating} Stars</p>
                                {/* <p className="text-gray-700 mb-2">Starting Price: ${hotel.}</p> */}
                                <p className="text-gray-500 mb-2">Location: {eachhotel.hotel.city}</p>
                                {/* <p className="text-gray-500 mb-2">Amenities:{eachhotel.amenities.join(", ")}</p> */}
                                <p>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eachhotel.hotel.address)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Open on Google Map
                                </a>
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700 text-center">No hotels found matching your search criteria.</p>
                )}
            </div>

            {selectedHotel && (
                <Dialog open={!!selectedHotel} onOpenChange={closeHotelDetails}>
                    <DialogContent className="w-[1000px] h-[90vh] max-h-[90vh] overflow-hidden p-0">
                        <DialogTitle className="sr-only">
                            {selectedHotel.hotel.name} Details
                        </DialogTitle>
                        
                        {/* Hotel Header - Fixed at top */}
                        <div className="relative h-72 bg-gray-200">
                            <img 
                                src={selectedHotel.hotel.logo || '/default-hotel.jpg'} 
                                alt={selectedHotel.hotel.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedHotel.hotel.name}</h2>
                                <div className="flex items-center text-white">
                                    <span className="mr-2">{"★".repeat(selectedHotel.hotel.starRating)}</span>
                                    <span>{selectedHotel.hotel.starRating} Stars</span>
                                </div>
                            </div>

                            {/* Close Button - Replace nested buttons with a single one */}
                            <DialogClose asChild>
                                <div className="absolute top-6 right-6">
                                    <span className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors cursor-pointer inline-flex items-center justify-center text-xl font-bold">
                                        x
                                    </span>
                                </div>
                            </DialogClose>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto h-[calc(90vh-18rem)] p-6">
                            {/* Hotel Info */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <p className="text-gray-600 text-lg">{selectedHotel.hotel.address}</p>
                                </div>
                            </div>

                            {/* Date and Room Type Selection */}
                            <div className="bg-gray-50 p-6 rounded-xl mb-8 shadow-sm">
                                <h3 className="text-xl font-semibold mb-6">Search Room Availability</h3>
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                                        <input
                                            type="date"
                                            value={checkInRoomDate}
                                            onChange={(e) => {
                                                setCheckInRoomDate(e.target.value);
                                                if (checkOutRoomDate) {  // Only search if both dates are set
                                                    handleRoomDateChange();
                                                }
                                            }}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                                        <input
                                            type="date"
                                            value={checkOutRoomDate}
                                            onChange={(e) => {
                                                setCheckOutRoomDate(e.target.value);
                                                if (checkInRoomDate) {  // Only search if both dates are set
                                                    handleRoomDateChange();
                                                }
                                            }}
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            min={checkInRoomDate || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                        <input
                                            type="text"
                                            value={searchRoomType}
                                            onChange={(e) => setSearchRoomType(e.target.value)}
                                            placeholder="Any room type"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSearchAvailability}
                                    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                                >
                                    Search Availability
                                </button>
                            </div>

                            {/* Available Rooms */}
                            <div className="space-y-6">
                                <h3 className="text-2xl font-semibold mb-6">Available Rooms</h3>
                                {selectedHotelRooms.length > 0 ? (
                                    selectedHotelRooms.map((room) => (
                                        <div 
                                            key={room.id}
                                            className="flex items-start p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-xl font-semibold mb-3">{room.type}</h4>
                                                <div className="text-sm text-gray-600 mb-4 grid grid-cols-2 gap-2">
                                                    {room.amenities && typeof room.amenities === 'string' 
                                                        ? JSON.parse(room.amenities).map((amenity: string, index: number) => (
                                                            <span key={`${room.id}-amenity-${index}`} className="flex items-center">
                                                                <span className="mr-2">•</span>
                                                                {amenity}
                                                            </span>
                                                        ))
                                                        : Array.isArray(room.amenities) && room.amenities.map((amenity: string, index: number) => (
                                                            <span key={`${room.id}-amenity-${index}`} className="flex items-center">
                                                                <span className="mr-2">•</span>
                                                                {amenity}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                                <div className="mt-4">
                                                    <span className="text-3xl font-bold text-blue-600">
                                                        ${room.pricePerNight}
                                                    </span>
                                                    <span className="text-gray-500 text-base ml-2">per night</span>
                                                </div>
                                            </div>
                                            <button 
                                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                                                onClick={() => {/* Add booking logic here */}}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <p className="text-xl text-gray-500">
                                            {searchRoomType 
                                                ? "No rooms match your search criteria" 
                                                : "No rooms available"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default HotelSearchPage;
