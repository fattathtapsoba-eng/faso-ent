import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getNotifications, markAllNotificationsAsRead } from '../services/api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookOpen, DollarSign, Megaphone, Mail, CheckCheck } from 'lucide-react';
import type { Notification } from '../types';

export function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<string>('ALL');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    async function loadNotifications() {
        setIsLoading(true);
        try {
            const userId = localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user')!).id
                : 'p1'; // Fallback for testing

            const data = await getNotifications(userId);
            setNotifications(data);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleMarkAllAsRead() {
        try {
            const userId = localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user')!).id
                : 'p1';

            await markAllNotificationsAsRead(userId);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }

    function getIcon(type: string) {
        switch (type) {
            case 'NEW_GRADE':
                return <BookOpen className="h-6 w-6 text-blue-600" />;
            case 'PAYMENT_REMINDER':
                return <DollarSign className="h-6 w-6 text-orange-600" />;
            case 'ANNOUNCEMENT':
                return <Megaphone className="h-6 w-6 text-purple-600" />;
            case 'MESSAGE':
                return <Mail className="h-6 w-6 text-green-600" />;
            default:
                return <Megaphone className="h-6 w-6 text-gray-600" />;
        }
    }

    const filteredNotifications = filter === 'ALL'
        ? notifications
        : notifications.filter(n => n.type === filter);

    // Get user role for BottomNav
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { role: 'PARENT' };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Notifications" subtitle={`${notifications.length} notification${notifications.length > 1 ? 's' : ''}`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Actions Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${filter === 'ALL' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'
                                }`}
                        >
                            Toutes
                        </button>
                        <button
                            onClick={() => setFilter('NEW_GRADE')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${filter === 'NEW_GRADE' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'
                                }`}
                        >
                            Notes
                        </button>
                        <button
                            onClick={() => setFilter('PAYMENT_REMINDER')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${filter === 'PAYMENT_REMINDER' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'
                                }`}
                        >
                            Paiements
                        </button>
                    </div>

                    <Button onClick={handleMarkAllAsRead} variant="ghost" size="sm">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Tout lire
                    </Button>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Chargement...</p>
                        </CardContent>
                    </Card>
                ) : filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Aucune notification</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                            onClick={() => {
                                if (notification.actionUrl) {
                                    navigate(notification.actionUrl);
                                }
                            }}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDistanceToNow(new Date(notification.timestamp), {
                                                addSuffix: true,
                                                locale: fr,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </main>

            <BottomNav role={user.role} />
        </div>
    );
}
