import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { getClasses, getStudents, upsertGrade } from '../../services/api/mockApi';
import { saveGrade, getGradesByStudent } from '../../services/db/indexedDB';
import type { Class, Student, Grade } from '../../types';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { generateId } from '../../utils';
import { CloudOff, Check, BookOpen } from 'lucide-react';

const SUBJECTS = [
    'Mathématiques',
    'Français',
    'Anglais',
    'Histoire-Géographie',
    'SVT',
    'Physique-Chimie',
    'EPS',
];

export function GradeEntry() {
    const isOnline = useNetworkStatus();
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [grades, setGrades] = useState<Record<string, string>>({});
    const [savedGrades, setSavedGrades] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            loadStudents();
        }
    }, [selectedClass]);

    async function loadClasses() {
        const data = await getClasses();

        // Filter classes by teacher's assignments
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
        if (user?.role === 'TEACHER' && user.assigned_classes) {
            const filteredClasses = data.filter((c: Class) => user.assigned_classes.includes(c.id));
            setClasses(filteredClasses);
        } else {
            setClasses(data);
        }
    }

    async function loadStudents() {
        setIsLoading(true);
        try {
            const data = await getStudents(selectedClass);
            setStudents(data);

            const gradeValues: Record<string, string> = {};
            const saved = new Set<string>();

            for (const student of data) {
                const existingGrades = await getGradesByStudent(student.id);
                const subjectGrade = existingGrades.find(g => g.subject === selectedSubject);
                if (subjectGrade) {
                    gradeValues[student.id] = subjectGrade.score.toString();
                    if (subjectGrade.synced) {
                        saved.add(student.id);
                    }
                }
            }

            setGrades(gradeValues);
            setSavedGrades(saved);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGradeChange(studentId: string, value: string) {
        setGrades(prev => ({ ...prev, [studentId]: value }));

        if (value && !isNaN(Number(value))) {
            await saveGradeOffline(studentId, Number(value));
        }
    }

    async function saveGradeOffline(studentId: string, score: number) {
        const grade: Grade = {
            id: generateId(),
            student_id: studentId,
            subject: selectedSubject,
            score,
            coefficient: 1,
            evaluation_type: 'devoir',
            trimester: 1,
            date: new Date().toISOString(),
            synced: false,
            sync_status: 'pending',
        };

        await saveGrade(grade);

        if (isOnline) {
            try {
                await upsertGrade(grade);
                grade.synced = true;
                grade.sync_status = 'synced';
                await saveGrade(grade);
                setSavedGrades(prev => new Set([...prev, studentId]));
            } catch (error) {
                console.error('Failed to sync grade:', error);
            }
        }
    }

    const canEnterGrades = selectedClass && selectedSubject;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Saisie des Notes" subtitle="Professeur" />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Sélection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Classe
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Choisir une classe...</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Matière
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Choisir une matière...</option>
                                {(() => {
                                    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
                                    const availableSubjects = (user?.role === 'TEACHER' && user.subjects) ? user.subjects : SUBJECTS;
                                    return availableSubjects.map((subject: string) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ));
                                })()}
                            </select>
                        </div>

                        {!isOnline && (
                            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                                <CloudOff className="h-4 w-4" />
                                <span>Hors ligne - Les notes seront synchronisées automatiquement</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {canEnterGrades && (
                    <div className="space-y-2">
                        {isLoading ? (
                            <Card>
                                <CardContent className="py-8">
                                    <p className="text-center text-gray-500">Chargement...</p>
                                </CardContent>
                            </Card>
                        ) : students.length === 0 ? (
                            <Card>
                                <CardContent className="py-8">
                                    <p className="text-center text-gray-500">
                                        Aucun élève dans cette classe
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            students.map(student => (
                                <Card key={student.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {student.name} {student.first_name}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.5"
                                                    placeholder="Note"
                                                    value={grades[student.id] || ''}
                                                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                    className="w-20 text-center text-lg font-semibold"
                                                />
                                                <span className="text-gray-400">/20</span>

                                                <div className="w-6">
                                                    {savedGrades.has(student.id) ? (
                                                        <Check className="h-5 w-5 text-green-500" />
                                                    ) : grades[student.id] && !isOnline ? (
                                                        <CloudOff className="h-5 w-5 text-orange-500" />
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {!canEnterGrades && (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-gray-500">
                                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">Sélectionnez une classe et une matière</p>
                                <p className="text-sm mt-1">pour commencer la saisie des notes</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>

            <BottomNav role="TEACHER" />
        </div>
    );
}
