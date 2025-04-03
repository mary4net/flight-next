// smart component

'use client';
import { useState } from 'react';
import CityPicker from '@/components/search/cityPicker';
import Button from '@/components/ui/button';
import Date from '@/components/search/date';

interface onSearchProps {
  onSearchAction: (
    data: {
      origin: string;
      destination: string;
      date: string;
      round: boolean;
    }
  ) => void;
}
export default function SearchForm({ onSearchAction }: onSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDesti] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isRound, setRound] = useState(false);

  const handleSubmit = () => {
    let date;
    if (isRound) {
      date = `${departureDate},${returnDate}`
    } else {
      date = `${departureDate}`
    }
    onSearchAction({
      origin, destination,
      date: date,
      round: isRound
    });
  };
  const handleCitySelect =
    (type: 'origin' | 'desti', city: string) => {
      if (type == 'origin')
        setOrigin(city);
      else
        setDesti(city);
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12 max-w-screen-md lg:max-w-screen-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-center">Find you Flights</h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-center">
          <CityPicker type="origin" onCitySelect={handleCitySelect} />
          <CityPicker type="desti" onCitySelect={handleCitySelect} />
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 mt-4">
          <Date label="Departure Date" value={departureDate} onChangeAction={setDepartureDate} />
          {isRound && (
            <Date label="Return Date" value={returnDate} onChangeAction={setReturnDate} />
          )}
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            checked={isRound}
            onChange={(e) => setRound(e.target.checked)}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring focus:ring-blue-300"
          />
          <span className="text-gray-900 dark:text-gray-100">Get a round trip?</span>
        </div>

        <div className="mt-6 text-center">
          <Button label="Search Flights" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

