'use client';

import { useState } from "react";
import SearchForm from "@/components/search/searchForm";
import FlightResults from "@/components/search/flightResults";
import Navigation from "@/components/ui/navigation";

export default function FlightSearchPage() {
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


	return (
		<>
			<Navigation />
			<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
				<h1 className="text-3xl font-bold text-center">Search for Flights</h1>
				<SearchForm onSearchAction={handleSearch} />
				<FlightResults searchResults={searchResults} />
			</div>
		</>
	)
}

