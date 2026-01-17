import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
    audioBase64: string;
    duration?: number;
}

export function AudioPlayer({ audioBase64, duration }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressInterval = useRef<number | null>(null);

    useEffect(() => {
        // Create audio element
        const audio = new Audio(`data:audio/webm;base64,${audioBase64}`);
        audioRef.current = audio;

        audio.onended = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };

        return () => {
            audio.pause();
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [audioBase64]);

    function togglePlay() {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        } else {
            audioRef.current.play();

            // Update progress
            progressInterval.current = setInterval(() => {
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            }, 100);
        }

        setIsPlaying(!isPlaying);
    }

    function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
        if (!audioRef.current) return;
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const totalDuration = duration || audioRef.current?.duration || 0;

    return (
        <div className="bg-purple-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-purple-600 text-sm font-medium">🎤 Message vocal</span>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    onClick={togglePlay}
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 px-2"
                >
                    {isPlaying ? (
                        <Pause className="h-5 w-5" />
                    ) : (
                        <Play className="h-5 w-5" />
                    )}
                </Button>

                <div className="flex-1 space-y-1">
                    <input
                        type="range"
                        min="0"
                        max={totalDuration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(totalDuration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
