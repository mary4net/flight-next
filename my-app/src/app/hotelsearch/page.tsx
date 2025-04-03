"use client"; // Ensure this is at the top for client-side rendering

import React, { useState } from "react";
import dynamic from "next/dynamic"; // Import Next.js dynamic module
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

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
    const [hotelResults, setHotelResults] = useState<any[]>([]); // Example results array
    const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
    const [checkInRoomDate, setCheckInRoomDate] = useState<string | "">("");
    const [checkOutRoomDate, setCheckOutRoomDate] = useState<string | "">("");

    const openSelectedHotel = (hotel: any) => {
        setSelectedHotel(hotel);
    }

    const closeHotelDetails = () => {
        setSelectedHotel(null);
    };
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for hotels:", searchTerm);
        console.log("Check-in date:", checkInDate);
        console.log("Check-out date:", checkOutDate);
        console.log("Price range:", startingPrice, "to", maxPrice);
        console.log("Star rating:", starRating);

        // Simulate fetching hotel results with some locations
        const dummyResults = [
            { hotelId: 1, name: "Hotel A", rating: 4, price: 100, location: "New York", lat: 40.7128, lon: -74.0060, amenities: ["Free WiFi", "Pool", "Gym"] },
            { hotelId: 2, name: "Hotel B", rating: 3, price: 200, location: "Los Angeles", lat: 34.0522, lon: -118.2437, amenities: ["Free WiFi", "Pool", "Hello"] },
            { hotelId: 3, name: "Hotel C", rating: 5, price: 150, location: "Chicago", lat: 41.8781, lon: -87.6298, amenities: ["Free WiFi", "Gym"] },
            { hotelId: 4, name: "Hotel A", rating: 4, price: 100, location: "New York", lat: 40.7128, lon: -74.0060, amenities: ["Free WiFi", "Bar"] },
            { hotelId: 5, name: "Hotel B", rating: 3, price: 200, location: "Los Angeles", lat: 34.0522, lon: -118.2437, amenities: ["Free WiFi", "Swim"] },
            { hotelId: 5, name: "Hotel C", rating: 5, price: 150, location: "Chicago", lat: 41.8781, lon: -87.6298, amenities: ["Free WiFi", "Hall"] },
        ];
        setHotelResults(dummyResults);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log("Search submitted for:", searchTerm);
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

    return (
        <div className="container mx-auto mt">
            <form className="flex flex-col md:flex-row w-l max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg m-10" onSubmit={handleSearchSubmit}>
                <div className="flex flex-col w-900 mb-4 md:mb-0 m-2">
                    <input
                        type="text"
                        placeholder="Search for hotels (city)"
                        value={searchTerm}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchTerm(e.target.value)}
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

                </div>
                <button
                    type="submit"
                    className="w-80 h-25 bg-blue-500 text-white py-2 rounded-lg mt-4 md:mt-0"
                >
                    Search Hotels
                </button>
            </form>

            {/* Display Hotel Results */}
            <div className="mt-12 flex justify-center items-center">
                {hotelResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {hotelResults.map((hotel, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 mb-6" onClick={() => openSelectedHotel(hotel)}>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                                <p className="text-gray-500 mb-2">Rating: {hotel.rating} Stars</p>
                                <p className="text-gray-700 mb-2">Starting Price: ${hotel.price}</p>
                                <p className="text-gray-500 mb-2">Location: {hotel.location}</p>
                                <p className="text-gray-500 mb-2">Amenities:{hotel.amenities}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700 text-center">No hotels found matching your search criteria.</p>
                )}
            </div>

            {/* Hotel Details */}
            {selectedHotel && (
                <Dialog open={!!selectedHotel} onOpenChange={closeHotelDetails}>
                    <DialogContent className="w-[600px] max-h-[90vh] overflow-y-auto p-6">
                        {/* Hotel Image */}
                        <div className="flex justify-center mb-4">
                            <img
                                src={selectedHotel.imageUrl} // Replace with your actual image source
                                alt={selectedHotel.name}
                                className="rounded-lg max-w-full h-auto"
                            />
                        </div>

                        {/* Room Type, Date inputs */}
                        <div className="flex flex-row items-center justify-center w-full mb-6 md:mb-0 m-2 space-x-6">
                            <div className="flex flex-col items-start space-y-2">
                                <label htmlFor="start-date" className="text-sm font-medium">Room Type</label>
                                <input
                                    type="text"
                                    placeholder="Room Type"
                                    value={searchRoomType}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setSearchRoomType(e.target.value)}
                                    className="py-3 px-5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-center w-48"
                                />
                            </div>
                            {/* Start Date and End Date */}
                            <div className="flex flex-col items-start space-y-2">
                                <label htmlFor="start-date" className="text-sm font-medium">Start Date</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={checkInRoomDate}
                                    onChange={(e) => setCheckInRoomDate(e.target.value)}
                                    className="py-3 px-5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                                />
                            </div>

                            <div className="flex flex-col items-start space-y-2">
                                <label htmlFor="end-date" className="text-sm font-medium">End Date</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={checkOutRoomDate}
                                    onChange={(e) => setCheckOutRoomDate(e.target.value)}
                                    className="py-3 px-5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                                />
                            </div>
                        </div>

                        {/* Hotel Details */}
                        <DialogTitle>{selectedHotel.name}</DialogTitle>
                        <DialogDescription>
                            {/* show only available rooms */}
                            {/* show images */}
                            <span>⭐ Rating: {selectedHotel.rating} Stars</span><br />
                            <span>💰 Price: ${selectedHotel.price} per night</span><br />
                            <span>📍 Location: {selectedHotel.location}</span><br />
                            <span>🛏️ Amenities: {selectedHotel.amenities.join(", ")}</span>
                        </DialogDescription>

                        {/* Close Button */}
                        <DialogClose asChild>
                            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full">Close</button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            )}




            {/* Display Map */}
            {hotelResults.length > 0 && (
                <div className="mt-12 w-full h-[400px]">
                    <MapContainer center={[hotelResults[0].lat, hotelResults[0].lon]} zoom={10} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {hotelResults.map((hotel, index) => (
                            <Marker key={index} position={[hotel.lat, hotel.lon]}>
                                <Popup>{hotel.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default HotelSearchPage;
