import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Edit, Save, X } from 'lucide-react';
import type { User } from '../../types';

interface TeacherWithAssignments extends User {
    assigned_classes?: string[];
    subjects?: string[];
    is_main_teacher?: boolean;
    main_class_id?: string;
}

const ALL_CLASSES = [
    { id: 'c1', name: '6ème A' },
    { id: 'c2', name: '5ème B' },
    { id: 'c3', name: 'CM2 A' },
];

const ALL_SUBJECTS = [
    'Mathématiques',
    'Français',
    'Anglais',
    'Histoire-Géographie',
    'SVT',
    'Physique',
    'EPS',
    'Arts Plastiques',
];

export function TeacherManagement() {
    const [teachers, setTeachers] = useState<TeacherWithAssignments[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<TeacherWithAssignments>>({});

    useEffect(() => {
        loadTeachers();
    }, []);

    function loadTeachers() {
        // Load from localStorage
        const usersStr = localStorage.getItem('users');
        if (usersStr) {
            const users = JSON.parse(usersStr);
            const teacherUsers = users.filter((u: User) => u.role === 'TEACHER');
            setTeachers(teacherUsers);
        } else {
            // Fallback to mock data
            const mockTeachers: TeacherWithAssignments[] = [
                {
                    id: '2',
                    role: 'TEACHER',
                    name: 'Prof. Kaboré',
                    phone: '+22676543210',
                    assigned_classes: ['c1'],
                    subjects: ['Mathématiques', 'Physique'],
                    is_main_teacher: true,
                    main_class_id: 'c1',
                },
                {
                    id: '3',
                    role: 'TEACHER',
                    name: 'Prof. Sawadogo',
                    phone: '+22676543211',
                    assigned_classes: ['c2'],
                    subjects: ['Français', 'Anglais', 'Histoire-Géographie'],
                    is_main_teacher: true,
                    main_class_id: 'c2',
                },
            ];
            setTeachers(mockTeachers);
        }
    }

    function startEdit(teacher: TeacherWithAssignments) {
        setEditingId(teacher.id);
        setEditData({
            assigned_classes: teacher.assigned_classes || [],
            subjects: teacher.subjects || [],
            is_main_teacher: teacher.is_main_teacher || false,
            main_class_id: teacher.main_class_id || '',
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditData({});
    }

    function saveEdit(teacherId: string) {
        // Update teacher
        const updatedTeachers = teachers.map(t =>
            t.id === teacherId
                ? { ...t, ...editData }
                : t
        );
        setTeachers(updatedTeachers);

        // Save to localStorage (update users array)
        const usersStr = localStorage.getItem('users');
        if (usersStr) {
            const allUsers = JSON.parse(usersStr);
            const updatedUsers = allUsers.map((u: User) =>
                u.id === teacherId && u.role === 'TEACHER'
                    ? { ...u, ...editData }
                    : u
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        }

        setEditingId(null);
        setEditData({});
    }

    function toggleClass(classId: string) {
        const current = editData.assigned_classes || [];
        const updated = current.includes(classId)
            ? current.filter(c => c !== classId)
            : [...current, classId];
        setEditData({ ...editData, assigned_classes: updated });
    }

    function toggleSubject(subject: string) {
        const current = editData.subjects || [];
        const updated = current.includes(subject)
            ? current.filter(s => s !== subject)
            : [...current, subject];
        setEditData({ ...editData, subjects: updated });
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Gestion des Enseignants" subtitle={`${teachers.length} professeur(s)`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {teachers.map((teacher) => {
                    const isEditing = editingId === teacher.id;
                    const displayData = isEditing ? editData : teacher;

                    return (
                        <Card key={teacher.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary-600" />
                                        {teacher.name}
                                    </div>
                                    {!isEditing ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => startEdit(teacher)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEdit}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => saveEdit(teacher.id)}
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Classes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Classes assignées
                                    </label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            {ALL_CLASSES.map((cls) => (
                                                <label key={cls.id} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={(displayData.assigned_classes || []).includes(cls.id)}
                                                        onChange={() => toggleClass(cls.id)}
                                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="text-sm">{cls.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {(displayData.assigned_classes || []).map((classId) => {
                                                const cls = ALL_CLASSES.find(c => c.id === classId);
                                                return (
                                                    <span
                                                        key={classId}
                                                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                                    >
                                                        {cls?.name}
                                                    </span>
                                                );
                                            })}
                                            {(displayData.assigned_classes || []).length === 0 && (
                                                <span className="text-sm text-gray-500">Aucune classe</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Subjects */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Matières enseignées
                                    </label>
                                    {isEditing ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {ALL_SUBJECTS.map((subject) => (
                                                <label key={subject} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={(displayData.subjects || []).includes(subject)}
                                                        onChange={() => toggleSubject(subject)}
                                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <span className="text-xs">{subject}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {(displayData.subjects || []).map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                            {(displayData.subjects || []).length === 0 && (
                                                <span className="text-sm text-gray-500">Aucune matière</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Main Teacher */}
                                {isEditing && (
                                    <div>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={displayData.is_main_teacher || false}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, is_main_teacher: e.target.checked })
                                                }
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium">Professeur principal</span>
                                        </label>
                                    </div>
                                )}
                                {!isEditing && teacher.is_main_teacher && (
                                    <div className="text-sm text-primary-600 font-medium">
                                        ⭐ Professeur principal de {ALL_CLASSES.find(c => c.id === teacher.main_class_id)?.name}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}
