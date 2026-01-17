import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, Square, Play, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
    onRecordingComplete: (audioBase64: string, duration: number) => void;
    maxDurationSeconds?: number;
}

type RecordingState = 'idle' | 'recording' | 'recorded';

export function VoiceRecorder({ onRecordingComplete, maxDurationSeconds = 120 }: VoiceRecorderProps) {
    const [state, setState] = useState<RecordingState>('idle');
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            // Cleanup
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    async function startRecording() {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Convert to base64
                const base64 = await blobToBase64(blob);
                onRecordingComplete(base64, duration);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
                setState('recorded');
            };

            mediaRecorder.start();
            setState('recording');
            setDuration(0);

            // Start timer
            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setDuration(seconds);

                // Auto-stop at max duration
                if (seconds >= maxDurationSeconds) {
                    stopRecording();
                }
            }, 1000);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Impossible d\'accéder au microphone. Vérifiez les permissions.');
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current && state === 'recording') {
            mediaRecorderRef.current.stop();
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }

    function playPreview() {
        if (audioUrl && !audioRef.current) {
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.play();
            audio.onended = () => {
                audioRef.current = null;
            };
        }
    }

    function deleteRecording() {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
        setState('idle');
        setDuration(0);
        chunksRef.current = [];
    }

    function formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    async function blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    return (
        <div className="space-y-3">
            {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-2">
                {state === 'idle' && (
                    <Button onClick={startRecording} className="w-full" size="lg">
                        <Mic className="h-5 w-5 mr-2" />
                        Enregistrer un message vocal
                    </Button>
                )}

                {state === 'recording' && (
                    <Button onClick={stopRecording} variant="destructive" className="w-full" size="lg">
                        <Square className="h-5 w-5 mr-2 animate-pulse" />
                        Arrêter ({formatDuration(duration)})
                    </Button>
                )}

                {state === 'recorded' && (
                    <>
                        <Button onClick={playPreview} variant="outline" className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Écouter ({formatDuration(duration)})
                        </Button>
                        <Button onClick={deleteRecording} variant="ghost" size="sm" className="px-2">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            {state === 'recording' && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Enregistrement en cours...</span>
                </div>
            )}

            {state === 'recorded' && (
                <p className="text-sm text-green-600">
                    ✓ Message vocal enregistré ({formatDuration(duration)})
                </p>
            )}
        </div>
    );
}
