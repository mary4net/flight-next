"use client"; // Ensure this is at the top for client-side rendering

import React, { useState } from "react";
import dynamic from "next/dynamic"; // Import Next.js dynamic module
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const HotelSearchPage = () => {
    const [priceFilterVisible, setPriceFilterVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [starRating, setStarRating] = useState<number | "">("");
    const [startingPrice, setStartingPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(50000000);
    const [checkInDate, setCheckInDate] = useState<string | "">("");
    const [checkOutDate, setCheckOutDate] = useState<string | "">("");
    const [hotelResults, setHotelResults] = useState<any[]>([]); // Example results array

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for hotels:", searchTerm);
        console.log("Check-in date:", checkInDate);
        console.log("Check-out date:", checkOutDate);
        console.log("Price range:", startingPrice, "to", maxPrice);
        console.log("Star rating:", starRating);

        // Simulate fetching hotel results with some locations
        const dummyResults = [
            { name: "Hotel A", rating: 4, price: 100, location: "New York", lat: 40.7128, lon: -74.0060 },
            { name: "Hotel B", rating: 3, price: 200, location: "Los Angeles", lat: 34.0522, lon: -118.2437 },
            { name: "Hotel C", rating: 5, price: 150, location: "Chicago", lat: 41.8781, lon: -87.6298 },
            { name: "Hotel A", rating: 4, price: 100, location: "New York", lat: 40.7128, lon: -74.0060 },
            { name: "Hotel B", rating: 3, price: 200, location: "Los Angeles", lat: 34.0522, lon: -118.2437 },
            { name: "Hotel C", rating: 5, price: 150, location: "Chicago", lat: 41.8781, lon: -87.6298 },
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
        <div className="container mx-auto mt-8">
            <form className="flex flex-col md:flex-row w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg" onSubmit={handleSearchSubmit}>
                <div className="flex flex-col w-full mb-4 md:mb-0 m-2">
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
                        className="py-2 pl-4 pr-4 rounded-lg border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    >
                        Price Range
                    </button>
                    {priceFilterVisible && (
                        <div className="absolute mt-2 p-4 border rounded-lg bg-white shadow-md w-72">
                            <div className="flex space-x-4 mb-2">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={startingPrice}
                                    className="w-full py-2 pl-4 pr-4 rounded-lg border border-gray-300"
                                    min="0"
                                    onChange={(e) => handlePriceChange(e, "start")}
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                    className="w-full py-2 pl-4 pr-4 rounded-lg border border-gray-300"
                                    min="0"
                                    onChange={(e) => handlePriceChange(e, "max")}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-50 h-25 bg-blue-500 text-white py-2 rounded-lg mt-4 md:mt-0"
                >
                    Search Hotels
                </button>
            </form>

            {/* Display Hotel Results */}
            <div className="mt-12 flex justify-center items-center">
                {hotelResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {hotelResults.map((hotel, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                                <p className="text-gray-500 mb-2">Rating: {hotel.rating} Stars</p>
                                <p className="text-gray-700 mb-2">Price: ${hotel.price}</p>
                                <p className="text-gray-500">Location: {hotel.location}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700 text-center">No hotels found matching your search criteria.</p>
                )}
            </div>

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
