import { useNavigate } from 'react-router-dom';
import { Users, Settings, ListChecks, UserCog, FileText, X, UsersRound, Megaphone, CalendarDays } from 'lucide-react';

interface AdminMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { to: '/admin/parents', icon: UsersRound, label: 'Parents', color: 'bg-violet-100 text-violet-700' },
    { to: '/admin/teachers', icon: UserCog, label: 'Enseignants', color: 'bg-blue-100 text-blue-700' },
    { to: '/admin/services', icon: ListChecks, label: 'Services & Tarifs', color: 'bg-amber-100 text-amber-700' },
    { to: '/admin/messages/compose', icon: Megaphone, label: 'Communication', color: 'bg-green-100 text-green-700' },
    { to: '/admin/students', icon: Users, label: 'Tous les élèves', color: 'bg-sky-100 text-sky-700' },
    { to: '/admin/school-years', icon: CalendarDays, label: 'Années scolaires', color: 'bg-indigo-100 text-indigo-700' },
    { to: '/admin/settings', icon: Settings, label: 'Paramètres', color: 'bg-gray-100 text-gray-700' },
    { to: '/admin/pilotage', icon: FileText, label: 'Rapports & Export', color: 'bg-rose-100 text-rose-700' },
];

export function AdminMenuDrawer({ isOpen, onClose }: AdminMenuDrawerProps) {
    const navigate = useNavigate();

    function handleNavigate(to: string) {
        onClose();
        navigate(to);
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <span className="text-base font-semibold text-gray-900">Menu Direction</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="grid grid-cols-2 gap-3 p-5 pb-8">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.to}
                                onClick={() => handleNavigate(item.to)}
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left active:scale-95"
                            >
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 leading-tight">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
