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
    <div className="flex bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-screen-lg lg:max-w-screen-xl">
        <div className="text-center">
          <CityPicker
            type='origin'
            onCitySelect={handleCitySelect}
          />
          <CityPicker
            type='desti'
            onCitySelect={handleCitySelect}
          />
          <Date
            label="Departure Date"
            value={departureDate}
            onChangeAction={setDepartureDate}
          />
          {isRound && <Date
            label="Return Date"
            value={returnDate}
            onChangeAction={setReturnDate}
          />
          }
          <Button label="Search Flights" onClick={handleSubmit} />

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isRound}
                onChange={(e) => setRound(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Get a round trip?</span>
            </label>
          </div>

        </div>

      </div>
    </div>
  );
}

