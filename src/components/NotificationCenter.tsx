import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../services/api';
import { useAuthStore } from '../store/authStore';

const NotificationCenter: React.FC = () => {
  const { user } = useAuthStore();
  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getNotifications(user?.id || ''),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  if (!user) return null;

  return (
    <div className="notification-center">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications && Array.isArray(notifications) && notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notification: any) => (
            <li key={notification._id} className="bg-white shadow rounded p-2">
              <p className="text-sm">{notification.message}</p>
              <small className="text-gray-500">{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

export default NotificationCenter;
