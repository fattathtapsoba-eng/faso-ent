import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { VoiceRecorder } from '../../components/features/VoiceRecorder';
import { Send, MessageSquare, Mic } from 'lucide-react';
import { sendMessage } from '../../services/api/notificationApi';

const TEMPLATES = [
    { id: '1', title: '📋 Absence', content: 'Bonjour, nous avons constaté que votre enfant était absent(e). Merci de justifier.' },
    { id: '2', title: '⚠️ Comportement', content: 'Bonjour, nous souhaitons discuter du comportement de votre enfant.' },
    { id: '3', title: '🎉 Félicitations', content: 'Félicitations ! Votre enfant a d\'excellents résultats !' },
    { id: '4', title: '📅 Réunion', content: 'Vous êtes convoqué(e) à une réunion concernant votre enfant.' },
    { id: '5', title: '💰 Paiement', content: 'Rappel : les frais de scolarité sont impayés.' },
];

export function ComposeParentMessage() {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<'text' | 'voice'>('text');
    const [audio, setAudio] = useState('');
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(false);

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { id: '1', name: 'Admin', role: 'ADMIN' };

    async function send() {
        if (type === 'text' && !content) return alert('Saisissez un message');
        if (type === 'voice' && !audio) return alert('Enregistrez un message vocal');

        setLoading(true);
        try {
            await sendMessage({
                from_user_id: user.id,
                from_user_name: user.name || 'Admin',
                to_user_id: 'p1',
                to_user_name: 'Parent',
                subject: subject || 'Message',
                content: type === 'text' ? content : `Message vocal (${Math.floor(duration)}s)`,
                audio_base64: type === 'voice' ? audio : undefined,
                audio_duration: type === 'voice' ? duration : undefined,
            });
            alert('Message envoyé !');
            navigate(-1);
        } catch {
            alert('Erreur');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Nouveau Message" subtitle="Aux parents" />
            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card>
                    <CardContent className="p-4 flex gap-2">
                        <Button variant={type === 'text' ? 'default' : 'outline'} onClick={() => setType('text')} className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />Texte
                        </Button>
                        <Button variant={type === 'voice' ? 'default' : 'outline'} onClick={() => setType('voice')} className="flex-1">
                            <Mic className="h-4 w-4 mr-2" />Vocal
                        </Button>
                    </CardContent>
                </Card>

                {type === 'text' && (
                    <Card>
                        <CardHeader><CardTitle className="text-base">Templates</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {TEMPLATES.map(t => (
                                <Button key={t.id} variant="outline" size="sm" onClick={() => { setSubject(t.title); setContent(t.content); }} className="w-full justify-start">{t.title}</Button>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader><CardTitle className="text-base">Message</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {type === 'text' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sujet</label>
                                    <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Objet" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contenu</label>
                                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Votre message..." />
                                </div>
                            </>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-600 mb-3">🎤 Message vocal (accessibilité parents)</p>
                                <VoiceRecorder onRecordingComplete={(b, d) => { setAudio(b); setDuration(d); }} />
                                {audio && <p className="text-sm text-green-600 mt-2">✓ Enregistré ({Math.floor(duration)}s)</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)} className="flex-1" disabled={loading}>Annuler</Button>
                    <Button onClick={send} className="flex-1" disabled={loading}>
                        <Send className="h-4 w-4 mr-2" />{loading ? 'Envoi...' : 'Envoyer'}
                    </Button>
                </div>
            </main>
            <BottomNav role={user.role} />
        </div>
    );
}
