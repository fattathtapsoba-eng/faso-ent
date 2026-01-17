import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { CheckCircle, XCircle, Clock, Save, Users } from 'lucide-react';
import { getStudentsByClass, markAttendance } from '../../services/api/mockApi';
import type { Student, AttendanceRecord } from '../../types';

export function Attendance() {
    const [selectedClass, setSelectedClass] = useState('c1');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCourse, setSelectedCourse] = useState('Mathématiques');
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Map<string, { status: string; notes: string; excused: boolean }>>(new Map());
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : { id: '2', name: 'Prof. Koné', role: 'TEACHER' };

    // Filter classes by teacher's assignments
    const allClasses = [{ id: 'c1', name: '6ème A' }, { id: 'c2', name: '5ème B' }];
    const assignedClasses = user.assigned_classes || ['c1', 'c2'];
    const availableClasses = allClasses.filter(c => assignedClasses.includes(c.id));

    const courses = user.subjects || ['Mathématiques', 'Français', 'SVT', 'Histoire-Géo', 'Anglais', 'EPS'];

    useEffect(() => {
        loadStudents();
    }, [selectedClass]);

    async function loadStudents() {
        try {
            const data = await getStudentsByClass(selectedClass);
            setStudents(data);

            // Initialize all as present
            const initialAttendance = new Map();
            data.forEach((student: Student) => {
                initialAttendance.set(student.id, { status: 'PRESENT', notes: '', excused: false });
            });
            setAttendance(initialAttendance);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    function updateAttendance(studentId: string, field: 'status' | 'notes' | 'excused', value: any) {
        setAttendance(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(studentId) || { status: 'PRESENT', notes: '', excused: false };
            newMap.set(studentId, { ...current, [field]: value });
            return newMap;
        });
    }

    function markAllPresent() {
        setAttendance(prev => {
            const newMap = new Map(prev);
            students.forEach((student: Student) => {
                newMap.set(student.id, { status: 'PRESENT', notes: '', excused: false });
            });
            return newMap;
        });
    }

    async function handleSave() {
        setIsSaving(true);
        setSuccessMessage('');

        try {
            const records: Omit<AttendanceRecord, 'id' | 'timestamp'>[] = students.map(student => {
                const att = attendance.get(student.id)!;
                const finalStatus = att.excused ? 'EXCUSED' : att.status;

                return {
                    student_id: student.id,
                    student_name: student.name,
                    class_id: selectedClass,
                    date: selectedDate,
                    course: selectedCourse,
                    status: finalStatus as any,
                    notes: att.notes || undefined,
                    marked_by: user.id,
                };
            });

            await markAttendance(records);
            setSuccessMessage(`✓ Présences enregistrées pour ${students.length} élèves`);

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error saving attendance:', error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Feuille de Présence" subtitle={`${students.length} élève${students.length > 1 ? 's' : ''}`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Filters */}
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Classe</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {availableClasses.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cours</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {courses.map((course: string) => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Action */}
                <Button onClick={markAllPresent} variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Marquer tous présents
                </Button>

                {/* Success Message */}
                {successMessage && (
                    <div className="p-3 text-sm text-green-800 bg-green-50 rounded-lg border border-green-200">
                        {successMessage}
                    </div>
                )}

                {/* Students List */}
                <div className="space-y-3">
                    {students.map((student) => {
                        const att = attendance.get(student.id) || { status: 'PRESENT', notes: '', excused: false };

                        return (
                            <Card key={student.id}>
                                <CardContent className="p-4 space-y-3">
                                    <h3 className="font-semibold text-gray-900">{student.name}</h3>

                                    {/* Status Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => updateAttendance(student.id, 'status', 'PRESENT')}
                                            variant={att.status === 'PRESENT' ? 'default' : 'outline'}
                                            className="flex-1"
                                            size="sm"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Présent
                                        </Button>
                                        <Button
                                            onClick={() => updateAttendance(student.id, 'status', 'ABSENT')}
                                            variant={att.status === 'ABSENT' ? 'destructive' : 'outline'}
                                            className="flex-1"
                                            size="sm"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Absent
                                        </Button>
                                        <Button
                                            onClick={() => updateAttendance(student.id, 'status', 'LATE')}
                                            variant={att.status === 'LATE' ? 'default' : 'outline'}
                                            className="flex-1"
                                            size="sm"
                                        >
                                            <Clock className="h-4 w-4 mr-1" />
                                            Retard
                                        </Button>
                                    </div>

                                    {/* Excused Checkbox */}
                                    {att.status === 'ABSENT' && (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={att.excused}
                                                onChange={(e) => updateAttendance(student.id, 'excused', e.target.checked)}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span>Absence justifiée</span>
                                        </label>
                                    )}

                                    {/* Notes */}
                                    {att.status !== 'PRESENT' && (
                                        <Input
                                            placeholder="Commentaire (optionnel)"
                                            value={att.notes}
                                            onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sticky bottom-24"
                    size="lg"
                >
                    {isSaving ? (
                        <>Enregistrement...</>
                    ) : (
                        <>
                            <Save className="h-5 w-5 mr-2" />
                            Enregistrer les présences
                        </>
                    )}
                </Button>
            </main>

            <BottomNav role={user.role} />
        </div>
    );
}
