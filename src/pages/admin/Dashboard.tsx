import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getDashboardStats } from '../../services/api/mockApi';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        paidPercentage: 0,
        unpaidCount: 0,
        attendanceRate: 92,
    });

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        const data = await getDashboardStats();
        setStats({ ...data, attendanceRate: 92 });
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Tableau de Bord" subtitle="Vue d'ensemble" />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Élèves
                            </CardTitle>
                            <Users className="h-5 w-5 text-primary-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.totalStudents}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Inscrits cette année
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={stats.paidPercentage < 70 ? 'border-red-300 bg-red-50' : ''}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Scolarités Payées
                            </CardTitle>
                            {stats.paidPercentage < 70 ? (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${stats.paidPercentage < 70 ? 'text-red-600' : 'text-green-600'}`}>
                                {stats.paidPercentage}%
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                {stats.unpaidCount} élève{stats.unpaidCount > 1 ? 's' : ''} en retard
                            </p>
                            {stats.paidPercentage < 70 && (
                                <p className="text-xs text-red-600 font-medium mt-2">
                                    ⚠️ Taux critique - Action requise
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Attendance Rate */}
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Taux Présence</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Raccourcis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a
                            href="/admin/finances"
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm font-medium">Recouvrement des impayés</span>
                            <span className="text-xs text-red-600 font-bold">
                                {stats.unpaidCount}
                            </span>
                        </a>
                        <a
                            href="/admin/students"
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm font-medium">Liste des élèves</span>
                            <span className="text-xs text-gray-500">{stats.totalStudents}</span>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Activité Récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 text-center py-4">
                            Aucune activité récente
                        </p>
                    </CardContent>
                </Card>
            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}
