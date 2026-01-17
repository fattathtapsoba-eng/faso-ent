import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Don't show prompt immediately, wait 30 seconds
            setTimeout(() => {
                const hasInstalledBefore = localStorage.getItem('pwa-install-prompted');
                if (!hasInstalledBefore) {
                    setShowPrompt(true);
                }
            }, 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            localStorage.setItem('pwa-install-prompted', 'true');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-prompted', 'true');
    };

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-2xl p-4 z-50 animate-slide-up">
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Fermer"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="pr-8">
                <h3 className="font-semibold text-lg mb-1">Installer Faso-ENT</h3>
                <p className="text-sm text-white/90 mb-3">
                    Installez l'application sur votre appareil pour un accès rapide et une meilleure expérience !
                </p>

                <button
                    onClick={handleInstallClick}
                    className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors w-full md:w-auto"
                >
                    Installer maintenant
                </button>
            </div>
        </div>
    );
}
