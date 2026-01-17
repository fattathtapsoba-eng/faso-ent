import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getStudentById, getGradesByStudentId, getStudentStats } from '../../services/api/mockApi';
import type { Student, Grade } from '../../types';
import { Eye, EyeOff } from 'lucide-react';

export function MyGrades() {
    const [student, setStudent] = useState<Student | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        try {
            const studentId = 's1'; // TODO: Get from auth context

            const [studentData, gradesData, statsData] = await Promise.all([
                getStudentById(studentId),
                getGradesByStudentId(studentId),
                getStudentStats(studentId),
            ]);

            setStudent(studentData);
            setGrades(gradesData);
            setStats(statsData);
        } finally {
            setIsLoading(false);
        }
    }

    // Group grades by subject
    const gradesBySubject = grades.reduce((acc, grade) => {
        if (!acc[grade.subject]) {
            acc[grade.subject] = [];
        }
        acc[grade.subject].push(grade);
        return acc;
    }, {} as Record<string, Grade[]>);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title="Mes Notes"
                subtitle={student?.class_name || ''}
            />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Overall Stats */}
                {stats && (
                    <Card className="border-l-4 border-l-primary-500">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Moyenne Générale</p>
                                    <p className={`text-4xl font-bold ${stats.overall_average >= 12 ? 'text-green-600' :
                                            stats.overall_average >= 10 ? 'text-orange-600' :
                                                'text-red-600'
                                        }`}>
                                        {stats.overall_average}/20
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">{stats.total_grades} note{stats.total_grades > 1 ? 's' : ''}</p>
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        className="mt-2 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        {showDetails ? (
                                            <><EyeOff className="h-4 w-4" /> Masquer détails</>
                                        ) : (
                                            <><Eye className="h-4 w-4" /> Afficher détails</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Grades by Subject */}
                {isLoading ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Chargement...</p>
                        </CardContent>
                    </Card>
                ) : Object.keys(gradesBySubject).length === 0 ? (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-gray-500">Aucune note disponible</p>
                        </CardContent>
                    </Card>
                ) : (
                    Object.entries(gradesBySubject).map(([subject, subjectGrades]) => {
                        const subjectStats = stats?.subject_averages.find((s: any) => s.subject === subject);

                        return (
                            <Card key={subject}>
                                <CardHeader>
                                    <CardTitle className="text-base flex justify-between items-center">
                                        <span>{subject}</span>
                                        {subjectStats && (
                                            <span className={`text-lg font-bold ${subjectStats.average >= 12 ? 'text-green-600' :
                                                    subjectStats.average >= 10 ? 'text-orange-600' :
                                                        'text-red-600'
                                                }`}>
                                                {subjectStats.average}/20
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                {showDetails && (
                                    <CardContent>
                                        <div className="space-y-2">
                                            {subjectGrades.map(grade => (
                                                <div key={grade.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium capitalize">{grade.evaluation_type}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(grade.date).toLocaleDateString('fr-FR')} • Coef. {grade.coefficient}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xl font-bold ${grade.score >= 12 ? 'text-green-600' :
                                                            grade.score >= 10 ? 'text-orange-600' :
                                                                'text-red-600'
                                                        }`}>
                                                        {grade.score}/20
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })
                )}
            </main>

            <BottomNav role="STUDENT" />
        </div>
    );
}
