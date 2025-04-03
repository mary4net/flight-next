// app/notification/page.tsx
"use client";
import NotificationsList from "@/components/NotificationsList";

const NotificationPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Notifications</h1>
      <NotificationsList />
    </div>
  );
};

export default NotificationPage;
