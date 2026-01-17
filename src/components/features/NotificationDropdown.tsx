import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookOpen, DollarSign, Megaphone, Mail, ExternalLink } from 'lucide-react';
import type { Notification } from '../../types';

interface NotificationDropdownProps {
    notifications: Notification[];
    onNotificationClick: (notificationId: string) => void;
    onClose: () => void;
}

export function NotificationDropdown({
    notifications,
    onNotificationClick,
    onClose,
}: NotificationDropdownProps) {
    const navigate = useNavigate();

    function getIcon(type: string) {
        switch (type) {
            case 'NEW_GRADE':
                return <BookOpen className="h-5 w-5 text-blue-600" />;
            case 'PAYMENT_REMINDER':
                return <DollarSign className="h-5 w-5 text-orange-600" />;
            case 'ANNOUNCEMENT':
                return <Megaphone className="h-5 w-5 text-purple-600" />;
            case 'MESSAGE':
                return <Mail className="h-5 w-5 text-green-600" />;
            default:
                return <Megaphone className="h-5 w-5 text-gray-600" />;
        }
    }

    function handleNotificationClick(notification: Notification) {
        onNotificationClick(notification.id);

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            onClose();
        }
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>

            {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Aucune notification</p>
                </div>
            ) : (
                <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                        <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${!notification.read ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">{getIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDistanceToNow(new Date(notification.timestamp), {
                                            addSuffix: true,
                                            locale: fr,
                                        })}
                                    </p>
                                </div>
                                {notification.actionUrl && (
                                    <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <div className="p-3 border-t border-gray-200">
                <button
                    onClick={() => {
                        navigate('/notifications');
                        onClose();
                    }}
                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Voir toutes les notifications →
                </button>
            </div>
        </div>
    );
}
