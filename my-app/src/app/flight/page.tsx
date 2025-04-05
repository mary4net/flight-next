'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Flight } from "@/components/search/flightResults"
import SearchForm from "@/components/search/searchForm";
import FlightResults from "@/components/search/flightResults";
import Navigation from "@/components/ui/navigation";
import { Suspense } from 'react';


export default function FlightSearchPage() {
	const router = useRouter();
	const [searchResults, setSearchResults] = useState({ results: [] });
	const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);


	const handleSearch = (searchParams:
		{
			origin: string;
			destination: string;
			date: string;
			round: boolean;
			arrive?: string;
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

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			setSearchParams(params);
		}
	}, []);

	useEffect(() => {
		if (!searchParams) return;

		const origin = searchParams.get('origin');
		const destination = searchParams.get('destination');
		const departTime = searchParams.get('departTime');
		const roundParam = searchParams.get('round');
		let arrive = '';
		let date = '';
		if (roundParam === 'true') {
			arrive = searchParams.get('arrivalTime') || '';
			if (!origin || !destination || !departTime || !arrive) return;

			const departDate = departTime.split('T')[0];  // Extract "YYYY-MM-DD"
			const arriveDate = arrive.split('T')[0];      // Extract "YYYY-MM-DD"
			date = `${departDate},${arriveDate}`;
		} else {
			if (!origin || !destination || !departTime) return;

			const departDate = departTime.split('T')[0];
			date = departDate;
		}
		const round = roundParam === 'true';

		handleSearch({ origin, destination, date, round });
	}, []);



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

