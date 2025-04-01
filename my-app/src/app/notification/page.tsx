// app/notification/page.tsx
import NotificationsList from "@/app/components/NotificationsList";

const NotificationPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Notifications</h1>
      <NotificationsList />
    </div>
  );
};

export default NotificationPage;
