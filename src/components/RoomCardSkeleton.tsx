import React from "react";

const RoomCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex space-x-4 mb-6">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-10 bg-gray-300 rounded-full w-1/3"></div>
        </div>
      </div>
    </div>
  );

export default RoomCardSkeleton;