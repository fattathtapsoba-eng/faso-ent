import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BulletinDownloadButton } from '../../components/features/BulletinDownloadButton';
import { getChildrenByParent, getGradesByStudentId, getStudentStats } from '../../services/api/mockApi';
import type { Student, Grade } from '../../types';
import { Eye, EyeOff } from 'lucide-react';

export function ChildGrades() {
    const { childId } = useParams();
    const [children, setChildren] = useState<Student[]>([]);
    const [selectedChild, setSelectedChild] = useState<string>(childId || '');
    const [grades, setGrades] = useState<Grade[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            loadGrades(selectedChild);
        }
    }, [selectedChild]);

    async function loadData() {
        setIsLoading(true);
        try {
            const parentId = 'p1'; // TODO: Get from auth context
            const childrenData = await getChildrenByParent(parentId);
            setChildren(childrenData);

            if (childrenData.length > 0 && !selectedChild) {
                setSelectedChild(childrenData[0].id);
            } else if (selectedChild) {
                await loadGrades(selectedChild);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function loadGrades(studentId: string) {
        setIsLoading(true);
        try {
            const [gradesData, statsData] = await Promise.all([
                getGradesByStudentId(studentId),
                getStudentStats(studentId),
            ]);

            setGrades(gradesData);
            setStats(statsData);
        } finally {
            setIsLoading(false);
        }
    }

    const selectedChildData = children.find(c => c.id === selectedChild);

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
                title={selectedChildData ? `Notes de ${selectedChildData.first_name}` : "Notes"}
                subtitle={selectedChildData?.class_name || ''}
            />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Child Selector */}
                {children.length > 1 && (
                    <Card>
                        <CardContent className="pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sélectionner un enfant
                            </label>
                            <select
                                value={selectedChild}
                                onChange={(e) => setSelectedChild(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {children.map(child => (
                                    <option key={child.id} value={child.id}>
                                        {child.first_name} {child.name} - {child.class_name}
                                    </option>
                                ))}
                            </select>
                        </CardContent>
                    </Card>
                )}

                {/* Overall Stats */}
                {stats && (
                    <Card className="border-l-4 border-l-primary-500">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Moyenne Générale</p>
                                    <p className={`text-3xl font-bold ${stats.overall_average >= 12 ? 'text-green-600' :
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

                {/* Bulletin Download */}
                {selectedChild && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Bulletin Scolaire</p>
                                    <p className="text-sm text-gray-500">Télécharger en PDF</p>
                                </div>
                                <BulletinDownloadButton
                                    studentId={selectedChild}
                                    trimester={1}
                                    buttonText="📄 Télécharger"
                                    variant="outline"
                                />
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
                                                <div key={grade.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <div>
                                                        <p className="text-sm font-medium capitalize">{grade.evaluation_type}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(grade.date).toLocaleDateString('fr-FR')} • Coef. {grade.coefficient}
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
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })
                )}
            </main>

            <BottomNav role="PARENT" />
        </div>
    );
}
