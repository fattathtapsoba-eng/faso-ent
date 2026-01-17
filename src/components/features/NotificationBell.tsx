import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications, markNotificationAsRead } from '../../services/api/notificationApi';
import { NotificationDropdown } from './NotificationDropdown';
import type { Notification } from '../../types';

interface NotificationBellProps {
    userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    async function loadNotifications() {
        try {
            const data = await getNotifications(userId);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    async function handleNotificationClick(notificationId: string) {
        try {
            await markNotificationAsRead(notificationId);
            await loadNotifications(); // Refresh
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationDropdown
                    notifications={notifications.slice(0, 5)}
                    onNotificationClick={handleNotificationClick}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
