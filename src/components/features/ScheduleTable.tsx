import type { Schedule, DayOfWeek } from '../../types';
import { Card, CardContent } from '../ui/card';

const DAYS: DayOfWeek[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const DAY_LABELS: Record<DayOfWeek, string> = {
    lundi: 'Lundi',
    mardi: 'Mardi',
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi',
    samedi: 'Samedi',
};

interface ScheduleTableProps {
    schedules: Schedule[];
    emptyMessage?: string;
}

export function ScheduleTable({ schedules, emptyMessage = 'Aucun cours programmé' }: ScheduleTableProps) {
    if (schedules.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <p className="text-center text-gray-500">{emptyMessage}</p>
                </CardContent>
            </Card>
        );
    }

    // Group schedules by day
    const schedulesByDay = DAYS.reduce((acc, day) => {
        acc[day] = schedules
            .filter(s => s.day === day)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
        return acc;
    }, {} as Record<DayOfWeek, Schedule[]>);

    return (
        <div className="space-y-4">
            {DAYS.map(day => {
                const daySchedules = schedulesByDay[day];
                if (daySchedules.length === 0) return null;

                return (
                    <div key={day}>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">
                            {DAY_LABELS[day]}
                        </h3>
                        <div className="space-y-2">
                            {daySchedules.map(schedule => (
                                <Card key={schedule.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            {/* Time */}
                                            <div className="flex-shrink-0">
                                                <div className="text-sm font-semibold text-primary-600">
                                                    {schedule.start_time}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {schedule.end_time}
                                                </div>
                                            </div>

                                            {/* Subject & Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {schedule.subject}
                                                </h4>
                                                <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                                                    {schedule.teacher_name && (
                                                        <div className="truncate">{schedule.teacher_name}</div>
                                                    )}
                                                    {schedule.room && (
                                                        <div className="text-xs text-gray-500">{schedule.room}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
