// app/components/NotificationsList.tsx
import { useEffect, useState } from "react";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("/api/notification");
      const data = await response.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    await fetch(`/api/notification/${id}`, {
      method: "PUT",
    });

    setNotifications((prevNotifications) =>
      prevNotifications.map((noti) =>
        noti.id === id ? { ...noti, isRead: true } : noti
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-md mb-2 ${
                notification.isRead ? "bg-gray-200" : "bg-blue-100"
              }`}
            >
              <div className="flex justify-between">
                <span>{notification.message}</span>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
