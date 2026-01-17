import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { BookOpen, ClipboardCheck, Calendar, Users, Clock } from 'lucide-react';

interface ClassInfo {
    id: string;
    name: string;
}

export function TeacherDashboard() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {
        id: '2',
        name: 'Prof. Test',
        role: 'TEACHER',
        assigned_classes: ['c1'],
        subjects: ['Mathématiques', 'Physique'],
        is_main_teacher: true,
    };

    // Map class IDs to names
    const classNames: Record<string, string> = {
        'c1': '6ème A',
        'c2': '5ème B',
    };

    const myClasses: ClassInfo[] = (user.assigned_classes || []).map((id: string) => ({
        id,
        name: classNames[id] || id,
    }));

    const mySubjects: string[] = user.subjects || [];

    // Get current time for "Prochain cours"
    const currentHour = new Date().getHours();
    const nextCourse = currentHour < 15 ? '14h00 - 15h00' : 'Terminé pour aujourd\'hui';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title={`Bonjour ${user.name} 👋`}
                subtitle={`${mySubjects.join(' • ')} | ${myClasses.map((c: ClassInfo) => c.name).join(', ')}`}
            />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {/* Mes Classes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary-600" />
                            Mes Classes Assignées
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {myClasses.length > 0 ? (
                            myClasses.map((cls: ClassInfo) => (
                                <div
                                    key={cls.id}
                                    className="p-4 bg-primary-50 rounded-lg border border-primary-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {mySubjects.join(', ')}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            ~25 élèves
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">Aucune classe assignée</p>
                        )}
                    </CardContent>
                </Card>

                {/* Prochain Cours */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary-600" />
                            Prochain Cours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="font-semibold text-gray-900">{nextCourse}</p>
                                    <p className="text-sm text-gray-600">
                                        {mySubjects[0] || 'Mathématiques'} - {myClasses[0]?.name || '6ème A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions Rapides */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => navigate('/teacher/attendance')}
                            className="h-20 flex-col gap-2"
                            variant="outline"
                        >
                            <ClipboardCheck className="h-6 w-6" />
                            <span className="text-sm">Présences</span>
                        </Button>
                        <Button
                            onClick={() => navigate('/teacher/grade-entry')}
                            className="h-20 flex-col gap-2"
                            variant="outline"
                        >
                            <BookOpen className="h-6 w-6" />
                            <span className="text-sm">Saisir Notes</span>
                        </Button>
                        <Button
                            onClick={() => navigate('/teacher/schedule')}
                            className="h-20 flex-col gap-2"
                            variant="outline"
                        >
                            <Calendar className="h-6 w-6" />
                            <span className="text-sm">Mon Emploi</span>
                        </Button>
                        <Button
                            onClick={() => navigate('/messages')}
                            className="h-20 flex-col gap-2"
                            variant="outline"
                        >
                            <Users className="h-6 w-6" />
                            <span className="text-sm">Messages</span>
                        </Button>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Espace personnel</strong> : Vous voyez uniquement vos classes et matières assignées.
                        </p>
                    </CardContent>
                </Card>
            </main>

            <BottomNav role={user.role} />
        </div>
    );
}
