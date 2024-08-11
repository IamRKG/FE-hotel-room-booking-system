import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { checkRoomAvailability } from '../services/api';

interface AvailabilityCheckerProps {
  roomId: string;
}

const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({ roomId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: availability, isLoading, error, refetch } = useQuery({
    queryKey: ['roomAvailability', roomId, startDate, endDate],
    queryFn: () => checkRoomAvailability(roomId, startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  const handleCheck = () => {
    if (startDate && endDate) {
      refetch();
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Check Availability</h3>
      <div className="flex space-x-2 mb-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleCheck}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Check
        </button>
      </div>
      {isLoading && <p>Checking availability...</p>}
      {error && <p className="text-red-500">Error checking availability</p>}
      {availability !== undefined && (
        <p className={availability ? "text-green-500" : "text-red-500"}>
          {availability ? "Room is available!" : "Room is not available for selected dates."}
        </p>
      )}
    </div>
  );
};

export default AvailabilityChecker;