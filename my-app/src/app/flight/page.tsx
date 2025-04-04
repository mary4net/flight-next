'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Flight } from "@/components/search/flightResults"
import SearchForm from "@/components/search/searchForm";
import FlightResults from "@/components/search/flightResults";
import Navigation from "@/components/ui/navigation";

export default function FlightSearchPage() {
	const router = useRouter();
	const [searchResults, setSearchResults] = useState({ results: [] });

	const handleSearch = (searchParams:
		{
			origin: string;
			destination: string;
			date: string;
			round: boolean;
		}
	) => {
		// Fetch flights from API
		fetch(`/api/flights?origin=${searchParams.origin}&destination=${searchParams.destination}&date=${searchParams.date}&round=${searchParams.round}`)
			.then(response => response.json())
			.then(data => setSearchResults(data))
			.catch(error => console.error('Error fetching city suggestions:', error));
	};

	const handleAddToCart = (flights: Flight[]) => {
		const params = new URLSearchParams({
			bookings: JSON.stringify(flights)
		});
		console.log(flights)

		// Navigate to cart page with the parameters
		router.push(`/cart?${params.toString()}`);
	};



	return (
		<>
			<Navigation />
			<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
				<SearchForm onSearchAction={handleSearch} />
				<FlightResults searchResults={searchResults}
					onAddToCart={handleAddToCart}
				/>
			</div>
		</>
	)
}

