import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/features/StatusBadge';
import { BulletinDownloadButton } from '../../components/features/BulletinDownloadButton';
import { getStudentById, getStudentStats, getGradesByStudentId } from '../../services/api/mockApi';
import type { Student, Grade } from '../../types';
import { TrendingUp, BookOpen, Calendar, Trophy, FileText } from 'lucide-react';

export function StudentDashboard() {
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [recentGrades, setRecentGrades] = useState<Grade[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        try {
            // TODO: Get student_id from auth context
            const studentId = 's1'; // Aminata for testing

            const [studentData, statsData, gradesData] = await Promise.all([
                getStudentById(studentId),
                getStudentStats(studentId),
                getGradesByStudentId(studentId),
            ]);

            setStudent(studentData);
            setStats(statsData);

            // Get 5 most recent grades
            const sorted = [...gradesData].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setRecentGrades(sorted.slice(0, 5));
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading || !student) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <Header title="Mon Espace" subtitle="Chargement..." />
                <main className="max-w-screen-sm mx-auto p-4">
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Chargement...</p>
                        </CardContent>
                    </Card>
                </main>
                <BottomNav role="STUDENT" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title={`Bonjour ${student.first_name} !`}
                subtitle={student.class_name}
            />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-primary-500">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-5 w-5 text-primary-600" />
                                <span className="text-sm text-gray-600">Moyenne</span>
                            </div>
                            <p className={`text-2xl font-bold ${stats?.overall_average >= 12 ? 'text-green-600' :
                                stats?.overall_average >= 10 ? 'text-orange-600' :
                                    'text-red-600'
                                }`}>
                                {stats?.overall_average || 0}/20
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <span className="text-sm text-gray-600">Notes</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {stats?.total_grades || 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Status */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Scolarité</span>
                            <StatusBadge status={student.tuition_status} />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/student/grades')}
                        className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Trophy className="h-8 w-8" />
                            <span className="font-semibold">Mes Notes</span>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/student/schedule')}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Calendar className="h-8 w-8" />
                            <span className="font-semibold">Mon Emploi</span>
                        </div>
                    </button>
                </div>

                {/* Bulletin Download */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Mon Bulletin</p>
                                    <p className="text-sm text-gray-500">Trimestre 1 • 2024/2025</p>
                                </div>
                            </div>
                            <BulletinDownloadButton
                                studentId={student.id}
                                trimester={1}
                                buttonText="Télécharger"
                                variant="outline"
                                size="sm"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Grades */}
                {recentGrades.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Notes Récentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentGrades.map(grade => (
                                    <div key={grade.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-sm font-medium">{grade.subject}</p>
                                            <p className="text-xs text-gray-500 capitalize">
                                                {grade.evaluation_type} • {new Date(grade.date).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <span className={`text-lg font-bold ${grade.score >= 12 ? 'text-green-600' :
                                            grade.score >= 10 ? 'text-orange-600' :
                                                'text-red-600'
                                            }`}>
                                            {grade.score}/20
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/student/grades')}
                                className="w-full mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Voir toutes mes notes →
                            </button>
                        </CardContent>
                    </Card>
                )}
            </main>

            <BottomNav role="STUDENT" />
        </div>
    );
}
