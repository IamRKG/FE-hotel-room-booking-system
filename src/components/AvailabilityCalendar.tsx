import React, { useState, useEffect } from 'react';
import { Calendar, DateObject } from 'react-multi-date-picker';
import { useQuery } from '@tanstack/react-query';
import { checkRoomAvailability } from '../services/api';

interface AvailabilityCalendarProps {
  roomId: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ roomId }) => {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['roomAvailability', roomId],
    queryFn: () => checkRoomAvailability(roomId, new Date().toISOString(), new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString())
  });

  useEffect(() => {
    if (data && typeof data === 'object' && 'availableDates' in data && Array.isArray((data as { availableDates: string[] }).availableDates)) {
      setAvailableDates((data as { availableDates: string[] }).availableDates.map((date: string) => new Date(date)));
    }
  }, [data]);

  const isDateAvailable = (date: DateObject) => {
    return availableDates.some(availableDate => 
      availableDate.getDate() === date.day &&
      availableDate.getMonth() === date.month.number - 1 &&
      availableDate.getFullYear() === date.year
    );
  };

  if (isLoading) return <div>Loading availability...</div>;
  if (error) return <div>Error loading availability</div>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Room Availability</h3>
      <Calendar
        value={availableDates}
        multiple
        readOnly
        minDate={new Date()}
        mapDays={({ date }) => ({
          disabled: !isDateAvailable(date),
          style: isDateAvailable(date) ? { backgroundColor: '#10B981', color: 'white' } : {}
        })}
        className="custom-calendar"
      />
      <div className="mt-2 text-sm text-gray-600">
        <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>
        Available dates
      </div>
    </div>
  );
};

export default AvailabilityCalendar;