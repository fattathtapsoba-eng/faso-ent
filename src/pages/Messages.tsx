import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { getConversations } from '../services/api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Mail, MailOpen } from 'lucide-react';
import type { ConversationThread } from '../types';

export function Messages() {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<ConversationThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    async function loadConversations() {
        setIsLoading(true);
        try {
            const userId = localStorage.getItem('user')
                ? JSON.parse(localStorage.getItem('user')!).id
                : 'p1';

            const data = await getConversations(userId);
            setConversations(data);
        } finally {
            setIsLoading(false);
        }
    }

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { role: 'PARENT' };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Messages" subtitle={`${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Compose Button */}
                <Button
                    onClick={() => navigate('/messages/compose')}
                    className="w-full"
                    size="lg"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau message
                </Button>

                {/* Conversations List */}
                {isLoading ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Chargement...</p>
                        </CardContent>
                    </Card>
                ) : conversations.length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Aucun message</p>
                            <p className="text-center text-sm text-gray-400 mt-2">
                                Cliquez sur "Nouveau message" pour commencer
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    conversations.map((conversation) => (
                        <Card
                            key={conversation.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/messages/${conversation.id}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary-100 p-3 rounded-full mt-1">
                                        {conversation.unread_count > 0 ? (
                                            <Mail className="h-5 w-5 text-primary-600" />
                                        ) : (
                                            <MailOpen className="h-5 w-5 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {conversation.participantNames[0]}
                                            </h3>
                                            {conversation.unread_count > 0 && (
                                                <span className="bg-primary-500 text-white text-xs font-bold rounded-full px-2 py-1">
                                                    {conversation.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 mt-1 truncate">
                                            {conversation.last_message.audio_base64 && '🎤 '}
                                            {conversation.last_message.subject}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {conversation.last_message.audio_base64
                                                ? `Message vocal (${Math.floor(conversation.last_message.audio_duration || 0)}s)`
                                                : conversation.last_message.content.substring(0, 100)
                                            }
                                            {!conversation.last_message.audio_base64 && conversation.last_message.content.length > 100 ? '...' : ''}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDistanceToNow(new Date(conversation.last_message.timestamp), {
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
