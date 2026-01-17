import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AudioPlayer } from '../components/features/AudioPlayer';
import { getMessageThread, sendMessage, markMessageAsRead } from '../services/api/notificationApi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Send, ArrowLeft } from 'lucide-react';
import type { Message } from '../types';

export function MessageThread() {
    const { threadId } = useParams<{ threadId: string }>();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyContent, setReplyContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { id: 'p1', name: 'Parent Test', role: 'PARENT' };

    useEffect(() => {
        if (threadId) {
            loadMessages();
        }
    }, [threadId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function loadMessages() {
        if (!threadId) return;

        setIsLoading(true);
        try {
            const data = await getMessageThread(user.id, threadId);
            setMessages(data);

            // Mark unread messages as read
            const unreadUserMessages = data.filter(m => !m.read && m.to_user_id === user.id);
            for (const msg of unreadUserMessages) {
                await markMessageAsRead(msg.id);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSendReply() {
        if (!replyContent.trim() || !threadId) return;

        setIsSending(true);
        try {
            const partnerName = messages.length > 0
                ? (messages[0].from_user_id === user.id ? messages[0].to_user_name : messages[0].from_user_name)
                : 'Destinataire';

            const subject = messages.length > 0 ? `Re: ${messages[0].subject}` : 'Réponse';

            await sendMessage({
                from_user_id: user.id,
                from_user_name: user.name,
                to_user_id: threadId,
                to_user_name: partnerName,
                subject,
                content: replyContent,
                parent_message_id: messages.length > 0 ? messages[messages.length - 1].id : undefined,
            });

            setReplyContent('');
            await loadMessages();
        } finally {
            setIsSending(false);
        }
    }

    const conversationPartner = messages.length > 0
        ? (messages[0].from_user_id === user.id ? messages[0].to_user_name : messages[0].from_user_name)
        : 'Conversation';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title={conversationPartner}
                subtitle={messages.length > 0 ? messages[0].subject : ''}
            />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Back button */}
                <Button variant="ghost" size="sm" onClick={() => navigate('/messages')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux messages
                </Button>

                {/* Messages Thread */}
                {isLoading ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Chargement...</p>
                        </CardContent>
                    </Card>
                ) : messages.length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Aucun message</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => {
                            const isOwn = message.from_user_id === user.id;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <Card className={`max-w-[80%] ${isOwn ? 'bg-primary-500 text-white' : 'bg-white'}`}>
                                        <CardContent className="p-3">
                                            <p className={`text-xs font-medium ${isOwn ? 'text-primary-100' : 'text-gray-600'}`}>
                                                {isOwn ? 'Vous' : message.from_user_name}
                                            </p>

                                            {/* Voice Message */}
                                            {message.audio_base64 ? (
                                                <div className="mt-2">
                                                    <AudioPlayer
                                                        audioBase64={message.audio_base64}
                                                        duration={message.audio_duration}
                                                    />
                                                </div>
                                            ) : (
                                                /* Text Message */
                                                <p className={`text-sm mt-1 ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                                                    {message.content}
                                                </p>
                                            )}

                                            <p className={`text-xs mt-2 ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                                                {formatDistanceToNow(new Date(message.timestamp), {
                                                    addSuffix: true,
                                                    locale: fr,
                                                })}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Reply Input */}
                <Card className="sticky bottom-24">
                    <CardContent className="p-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Écrivez votre réponse..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                                disabled={isSending}
                            />
                            <Button onClick={handleSendReply} disabled={isSending || !replyContent.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <BottomNav role={user.role} />
        </div>
    );
}
