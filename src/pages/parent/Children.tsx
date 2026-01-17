import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent } from '../../components/ui/card';
import { StatusBadge } from '../../components/features/StatusBadge';
import { getChildrenByParent, getStudentStats } from '../../services/api/mockApi';
import type { Student } from '../../types';
import { getInitials } from '../../utils';
import { TrendingUp, BookOpen } from 'lucide-react';

interface ChildWithStats extends Student {
    overall_average: number;
    total_grades: number;
}

export function Children() {
    const navigate = useNavigate();
    const [children, setChildren] = useState<ChildWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadChildren();
    }, []);

    async function loadChildren() {
        setIsLoading(true);
        try {
            const parentId = 'p1'; // TODO: Get from auth context
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
            <Header title="Mes Enfants" subtitle={`${children.length} enfant(s)`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-3">
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
                        <Card key={child.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                                        {getInitials(child.name, child.first_name)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {child.first_name} {child.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{child.class_name}</p>

                                        <div className="grid grid-cols-2 gap-3 my-3">
                                            <div className="bg-green-50 rounded-lg p-2">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                    <span className="text-xs text-gray-600">Moyenne</span>
                                                </div>
                                                <p className={`text-lg font-bold ${child.overall_average >= 12 ? 'text-green-600' :
                                                        child.overall_average >= 10 ? 'text-orange-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {child.overall_average > 0 ? `${child.overall_average}/20` : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="bg-blue-50 rounded-lg p-2">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                                    <span className="text-xs text-gray-600">Notes</span>
                                                </div>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {child.total_grades}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm text-gray-600">Scolarité:</span>
                                            <StatusBadge status={child.tuition_status} />
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/parent/grades/${child.id}`)}
                                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                            >
                                                📊 Voir les notes
                                            </button>
                                            <button
                                                onClick={() => navigate(`/parent/schedule/${child.id}`)}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                📅 Emploi du temps
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </main>

            <BottomNav role="PARENT" />
        </div>
    );
}
