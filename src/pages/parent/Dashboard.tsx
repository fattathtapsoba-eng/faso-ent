import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getChildrenByParent, getStudentStats } from '../../services/api/mockApi';
import type { Student } from '../../types';
import { getInitials } from '../../utils';
import { Users, TrendingUp, Calendar, BookOpen, DollarSign, AlertCircle, Bell, MessageCircle, UserX, FileText, Download, Phone } from 'lucide-react';

interface ChildWithStats extends Student {
    overall_average: number;
    total_grades: number;
}

export function ParentDashboard() {
    const navigate = useNavigate();
    const [children, setChildren] = useState<ChildWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadChildren();
    }, []);

    async function loadChildren() {
        setIsLoading(true);
        try {
            const parentId = 'p1';
            const childrenData = await getChildrenByParent(parentId);

            const childrenWithStats = await Promise.all(
                childrenData.map(async (child) => {
                    const stats = await getStudentStats(child.id);
                    return {
                        ...child,
                        overall_average: stats.overall_average,
                        total_grades: stats.total_grades,
                    };
                })
            );

            setChildren(childrenWithStats);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Espace Parent" subtitle="Tableau de bord" />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Mes Enfants
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            {children.length} enfant{children.length > 1 ? 's' : ''} inscrit{children.length > 1 ? 's' : ''}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="h-5 w-5" />
                                    <p className="text-sm font-medium opacity-90">Paiements en attente</p>
                                </div>
                                <p className="text-3xl font-bold">270,000 FCFA</p>
                                <p className="text-xs opacity-75 mt-1">8 services à régler</p>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                                <p className="text-xs font-semibold">Mars 2025</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-red-500 bg-opacity-40 rounded-lg px-3 py-2 mb-3">
                            <AlertCircle className="h-4 w-4" />
                            <p className="text-xs font-medium">3 paiements arrivent à échéance</p>
                        </div>

                        <button
                            onClick={() => navigate('/parent/payments')}
                            className="w-full bg-white text-orange-600 font-semibold py-2.5 rounded-lg hover:bg-opacity-90 transition-all"
                        >
                            💳 Payer maintenant
                        </button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-blue-600" />
                                Notifications Récentes
                            </div>
                            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">6 nouvelles</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => navigate('/messages')}>
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">3 nouveaux messages</p>
                                <p className="text-xs text-gray-600">École Faso-ENT • Il y a 2h</p>
                            </div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <UserX className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">Absence signalée</p>
                                <p className="text-xs text-gray-600">Aminata - Aujourd'hui 08:00</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer" onClick={() => navigate('/parent/children')}>
                            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">2 nouvelles notes publiées</p>
                                <p className="text-xs text-gray-600">Mathématiques, Français • Hier</p>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-sm font-semibold mb-3 opacity-90">⚡ Actions Rapides</p>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => navigate('/parent/payments')}
                                className="flex items-center gap-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-all"
                            >
                                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">Gérer tous les paiements</p>
                                    <p className="text-xs opacity-75">270,000 FCFA en attente</p>
                                </div>
                            </button>

                            <button
                                onClick={() => alert('Téléchargement des bulletins en cours...')}
                                className="flex items-center gap-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-all"
                            >
                                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                                    <Download className="h-5 w-5" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">Télécharger tous les bulletins</p>
                                    <p className="text-xs opacity-75">PDF des 3 trimestres</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/messages')}
                                className="flex items-center gap-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-all"
                            >
                                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">Contacter l'école</p>
                                    <p className="text-xs opacity-75">Messages et communications</p>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {isLoading ? (
                        <Card>
                            <CardContent className="py-8">
                                <p className="text-center text-gray-500">Chargement...</p>
                            </CardContent>
                        </Card>
                    ) : children.length === 0 ? (
                        <Card>
                            <CardContent className="py-8">
                                <p className="text-center text-gray-500">Aucun enfant trouvé</p>
                            </CardContent>
                        </Card>
                    ) : (
                        children.map(child => (
                            <Card key={child.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                                            {getInitials(child.name, child.first_name)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">
                                                {child.first_name} {child.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{child.class_name}</p>

                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                    <span className={`text-sm font-semibold ${child.overall_average >= 12 ? 'text-green-600' :
                                                        child.overall_average >= 10 ? 'text-orange-600' :
                                                            'text-red-600'
                                                        }`}>
                                                        {child.overall_average > 0 ? `${child.overall_average}/20` : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {child.total_grades} note{child.total_grades > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/parent/grades/${child.id}`);
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                                                >
                                                    📊 Notes
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/parent/schedule/${child.id}`);
                                                    }}
                                                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <Calendar className="h-4 w-4 inline mr-1" />
                                                    Emploi
                                                </button>
                                            </div>

                                            <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                                                <p className="text-xs font-semibold text-gray-700 mb-2">📊 Évolution Trimestrielle</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-white rounded p-2">
                                                        <p className="text-xs text-gray-500">T1</p>
                                                        <p className="font-bold text-sm text-gray-900">13.2</p>
                                                        <div className="h-1 bg-gray-200 rounded-full mt-1">
                                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '66%' }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded p-2">
                                                        <p className="text-xs text-gray-500">T2</p>
                                                        <p className="font-bold text-sm text-gray-900">13.8</p>
                                                        <div className="h-1 bg-gray-200 rounded-full mt-1">
                                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '69%' }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-green-100 rounded p-2 border border-green-300">
                                                        <p className="text-xs text-green-700 font-semibold">T3 ↗️</p>
                                                        <p className="font-bold text-sm text-green-700">{child.overall_average.toFixed(1)}</p>
                                                        <div className="h-1 bg-green-200 rounded-full mt-1">
                                                            <div className="h-full bg-green-600 rounded-full" style={{ width: `${(child.overall_average / 20) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-green-700 font-medium mt-2 text-center">+1.3 points sur l'année</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <BottomNav role="PARENT" />
        </div>
    );
}
