import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { ScheduleTable } from '../../components/features/ScheduleTable';
import type { Schedule } from '../../types';
import { getScheduleByTeacher } from '../../services/api/mockApi';
import { Calendar } from 'lucide-react';

export function TeacherSchedule() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSchedule();
    }, []);

    async function loadSchedule() {
        setIsLoading(true);
        try {
            const teacherId = '2';
            const data = await getScheduleByTeacher(teacherId);
            setSchedules(data);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Mon Emploi du Temps" subtitle="Professeur" />

            <main className="max-w-screen-sm mx-auto p-4">
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

            <BottomNav role="TEACHER" />
        </div>
    );
}
