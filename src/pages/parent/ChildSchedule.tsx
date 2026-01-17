import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent } from '../../components/ui/card';
import { ScheduleTable } from '../../components/features/ScheduleTable';
import { getChildrenByParent, getScheduleByStudent } from '../../services/api/mockApi';
import type { Student, Schedule } from '../../types';
import { Calendar } from 'lucide-react';

export function ChildSchedule() {
    const { childId } = useParams();
    const [children, setChildren] = useState<Student[]>([]);
    const [selectedChild, setSelectedChild] = useState<string>(childId || '');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            loadSchedule(selectedChild);
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
                await loadSchedule(selectedChild);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function loadSchedule(studentId: string) {
        setIsLoading(true);
        try {
            const schedulesData = await getScheduleByStudent(studentId);
            setSchedules(schedulesData);
        } finally {
            setIsLoading(false);
        }
    }

    const selectedChildData = children.find(c => c.id === selectedChild);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title={selectedChildData ? `Emploi de ${selectedChildData.first_name}` : "Emploi du temps"}
                subtitle={selectedChildData?.class_name || ''}
            />

            <main className="max-w-screen-sm mx-auto p-4">
                {/* Child Selector */}
                {children.length > 1 && (
                    <Card className="mb-4">
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

                {isLoading ? (
                    <div className="bg-white rounded-lg shadow p-8">
                        <p className="text-center text-gray-500">Chargement...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Calendar className="h-4 w-4" />
                            <span>{schedules.length} cours programmés</span>
                        </div>

                        <ScheduleTable
                            schedules={schedules}
                            emptyMessage="Aucun cours programmé pour le moment"
                        />
                    </>
                )}
            </main>

            <BottomNav role="PARENT" />
        </div>
    );
}
