import { type ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { SyncIndicator } from '../features/SyncIndicator';
import { NotificationBell } from '../features/NotificationBell';

interface HeaderProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    }

    // Get current user ID for notifications
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-screen-sm mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {user && <NotificationBell userId={user.id} />}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </Button>
                    </div>
                </div>

                {/* Sync indicator */}
                <div className="flex items-center justify-between">
                    <SyncIndicator />
                    {children}
                </div>
            </div>
        </header>
    );
}

