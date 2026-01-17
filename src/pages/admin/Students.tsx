import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { StatusBadge } from '../../components/features/StatusBadge';
import { getStudents, getClasses } from '../../services/api/mockApi';
import type { Student, Class } from '../../types';
import { getInitials } from '../../utils';
import { Search, Filter } from 'lucide-react';

export function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [selectedClass]);

    async function loadData() {
        try {
            const [studentsData, classesData] = await Promise.all([
                getStudents(selectedClass || undefined),
                getClasses(),
            ]);
            setStudents(studentsData);
            setClasses(classesData);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredStudents = students.filter(student => {
        const fullName = `${student.name} ${student.first_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Élèves" subtitle={`${filteredStudents.length} élève(s)`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher un élève..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Toutes les classes</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-2">
                    {filteredStudents.length === 0 ? (
                        <Card>
                            <CardContent className="py-8">
                                <p className="text-center text-gray-500">
                                    {isLoading ? 'Chargement...' : 'Aucun élève trouvé'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredStudents.map(student => (
                            <Card
                                key={student.id}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                                            {getInitials(student.name, student.first_name)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {student.name} {student.first_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {student.class_name}
                                            </p>
                                        </div>

                                        <StatusBadge status={student.tuition_status} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}
