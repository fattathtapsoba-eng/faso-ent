import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Users, DollarSign, BookOpen, Calendar, MessageSquare, Bell, ClipboardCheck, Menu } from 'lucide-react';
import { AdminMenuDrawer } from '../features/AdminMenuDrawer';

export function BottomNav({ role }: { role: 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' }) {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    if (role === 'ADMIN') {
        const adminItems = [
            { to: '/admin/dashboard', icon: Home, label: 'Accueil' },
            { to: '/admin/pilotage', icon: LayoutDashboard, label: 'Pilotage' },
            { to: '/admin/students', icon: Users, label: 'Élèves' },
            { to: '/admin/finances', icon: DollarSign, label: 'Finances' },
            { to: '/messages', icon: MessageSquare, label: 'Messages' },
        ];

        return (
            <>
                <AdminMenuDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-30">
                    <div className="max-w-screen-sm mx-auto flex justify-around">
                        {adminItems.map(item => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.to);
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex flex-col items-center py-3 px-4 min-w-touch transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs mt-1">{item.label}</span>
                                </Link>
                            );
                        })}
                        {/* Bouton Plus → ouvre drawer */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex flex-col items-center py-3 px-4 min-w-touch transition-colors text-gray-600 hover:text-primary-600"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="text-xs mt-1">Plus</span>
                        </button>
                    </div>
                </nav>
            </>
        );
    }

    const navItems = role === 'TEACHER'
        ? [
            { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Accueil' },
            { to: '/teacher/grade-entry', icon: BookOpen, label: 'Notes' },
            { to: '/teacher/attendance', icon: ClipboardCheck, label: 'Présence' },
            { to: '/teacher/schedule', icon: Calendar, label: 'Emploi' },
        ]
        : role === 'PARENT'
            ? [
                { to: '/parent/dashboard', icon: LayoutDashboard, label: 'Accueil' },
                { to: '/parent/children', icon: Users, label: 'Enfants' },
                { to: '/parent/payments', icon: DollarSign, label: 'Paiements' },
                { to: '/messages', icon: MessageSquare, label: 'Messages' },
                { to: '/notifications', icon: Bell, label: 'Notifs' },
            ]
            : [ // STUDENT
                { to: '/student/dashboard', icon: LayoutDashboard, label: 'Accueil' },
                { to: '/student/grades', icon: BookOpen, label: 'Notes' },
                { to: '/student/schedule', icon: Calendar, label: 'Emploi' },
            ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-30">
            <div className="max-w-screen-sm mx-auto flex justify-around">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center py-3 px-4 min-w-touch transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                                }`}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
