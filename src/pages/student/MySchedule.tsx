import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { ScheduleTable } from '../../components/features/ScheduleTable';
import { getStudentById, getScheduleByStudent } from '../../services/api/mockApi';
import type { Student, Schedule } from '../../types';
import { Calendar } from 'lucide-react';

export function MySchedule() {
    const [student, setStudent] = useState<Student | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        try {
            const studentId = 's1'; // TODO: Get from auth context

            const [studentData, schedulesData] = await Promise.all([
                getStudentById(studentId),
                getScheduleByStudent(studentId),
            ]);

            setStudent(studentData);
            setSchedules(schedulesData);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title="Mon Emploi du Temps"
                subtitle={student?.class_name || ''}
            />

            <main className="max-w-screen-sm mx-auto p-4">
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow p-8">
                        <p className="text-center text-gray-500">Chargement...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Calendar className="h-4 w-4" />
                            <span>{schedules.length} cours programmés cette semaine</span>
                        </div>

                        <ScheduleTable
                            schedules={schedules}
                            emptyMessage="Aucun cours programmé pour le moment"
                        />
                    </>
                )}
            </main>

            <BottomNav role="STUDENT" />
        </div>
    );
}
