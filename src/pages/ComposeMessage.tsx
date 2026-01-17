import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { VoiceRecorder } from '../components/features/VoiceRecorder';
import { sendMessage } from '../services/api/notificationApi';
import { ArrowLeft, Send, MessageSquare, Mic } from 'lucide-react';

export function ComposeMessage() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [messageType, setMessageType] = useState<'text' | 'voice'>('text');
    const [audioBase64, setAudioBase64] = useState<string>('');
    const [audioDuration, setAudioDuration] = useState<number>(0);

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { id: 'p1', name: 'Parent Test', role: 'PARENT' };

    function handleRecordingComplete(audio: string, duration: number) {
        setAudioBase64(audio);
        setAudioDuration(duration);
    }

    async function handleSend() {
        setError('');

        if (!subject.trim() || !recipientPhone.trim()) {
            setError('Sujet et destinataire requis');
            return;
        }

        if (messageType === 'text' && !content.trim()) {
            setError('Message texte vide');
            return;
        }

        if (messageType === 'voice' && !audioBase64) {
            setError('Veuillez enregistrer un message vocal');
            return;
        }

        setIsSending(true);
        try {
            // For MVP, we'll use a simple mapping for demo
            const recipientId = recipientPhone === '+22676543210' ? '2' : 'p1';
            const recipientName = recipientPhone === '+22676543210' ? 'Prof. Kaboré' : 'Parent Destinataire';

            await sendMessage({
                from_user_id: user.id,
                from_user_name: user.name,
                to_user_id: recipientId,
                to_user_name: recipientName,
                subject,
                content: messageType === 'text' ? content : `Message vocal (${Math.floor(audioDuration)}s)`,
                audio_base64: messageType === 'voice' ? audioBase64 : undefined,
                audio_duration: messageType === 'voice' ? audioDuration : undefined,
            });

            navigate('/messages');
        } catch (err) {
            setError('Erreur lors de l\'envoi du message');
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Nouveau Message" subtitle="Envoyer un message" />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Back button */}
                <Button variant="ghost" size="sm" onClick={() => navigate('/messages')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                </Button>

                <Card>
                    <CardContent className="p-4 space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Destinataire (Téléphone)</label>
                            <Input
                                type="tel"
                                placeholder="+226 76 54 32 10"
                                value={recipientPhone}
                                onChange={(e) => setRecipientPhone(e.target.value)}
                                disabled={isSending}
                            />
                            <p className="text-xs text-gray-500">
                                Demo: +22676543210 (Prof. Kaboré)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sujet</label>
                            <Input
                                placeholder="Objet du message"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={isSending}
                            />
                        </div>

                        {/* Message Type Toggle */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Type de message</label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setMessageType('text')}
                                    variant={messageType === 'text' ? 'default' : 'outline'}
                                    className="flex-1"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Texte
                                </Button>
                                <Button
                                    onClick={() => setMessageType('voice')}
                                    variant={messageType === 'voice' ? 'default' : 'outline'}
                                    className="flex-1"
                                >
                                    <Mic className="h-4 w-4 mr-2" />
                                    Vocal
                                </Button>
                            </div>
                        </div>

                        {/* Text Message */}
                        {messageType === 'text' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    placeholder="Écrivez votre message ici..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isSending}
                                    rows={6}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                />
                            </div>
                        )}

                        {/* Voice Message */}
                        {messageType === 'voice' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Message Vocal</label>
                                <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
                            </div>
                        )}

                        <Button
                            onClick={handleSend}
                            disabled={isSending}
                            className="w-full"
                            size="lg"
                        >
                            {isSending ? (
                                <>Envoi...</>
                            ) : (
                                <>
                                    <Send className="h-5 w-5 mr-2" />
                                    Envoyer le message
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </main>

            <BottomNav role={user.role} />
        </div>
    );
}
