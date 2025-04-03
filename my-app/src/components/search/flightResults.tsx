interface Flight {
  id: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: number;
  currency: string;
  availableSeats: number;
  status: string;
  airline: {
    code: string;
    name: string;
  };
  origin: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
    country: string;
  };
}

interface SearchResult {
  legs: number;
  flights: Flight[];
}

interface FlightResultsProps {
  searchResults: { results: SearchResult[] };
}

const FlightResults: React.FC<FlightResultsProps> = ({ searchResults }) => {
  return (
    <div className="p-4">
      {searchResults.results.map((result, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Flight Option {index + 1}</h2>
          {result.flights.map((flight) => (
            <div key={flight.id} className="p-3 border-b last:border-b-0">
              <p className="text-sm text-gray-500">
                {flight.airline.name} ({flight.airline.code}) - Flight {flight.flightNumber}
              </p>
              <p>
                <span className="font-semibold">{flight.origin.city} ({flight.origin.code})</span> →{" "}
                <span className="font-semibold">{flight.destination.city} ({flight.destination.code})</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(flight.departureTime).toLocaleString()} →{" "}
                {new Date(flight.arrivalTime).toLocaleString()}
              </p>
              <p className="text-sm">Duration: {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
              <p className="text-sm font-semibold text-blue-600">
                {flight.currency} {flight.price.toFixed(2)}
              </p>
              <p className="text-xs text-green-600">{flight.status}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FlightResults;
