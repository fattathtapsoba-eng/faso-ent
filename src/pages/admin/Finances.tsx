import { useEffect, useState } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { getStudents, sendSMSReminder, markTuitionPaid } from '../../services/api/mockApi';
import type { Student } from '../../types';
import { getInitials } from '../../utils';
import { MessageSquare, CheckCircle, DollarSign } from 'lucide-react';

export function Finances() {
    const [unpaidStudents, setUnpaidStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadUnpaidStudents();
    }, []);

    async function loadUnpaidStudents() {
        try {
            const allStudents = await getStudents();
            const unpaid = allStudents.filter(s => s.tuition_status === 'UNPAID');
            setUnpaidStudents(unpaid);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSendSMS(studentId: string) {
        setActionLoading(`sms-${studentId}`);
        try {
            await sendSMSReminder(studentId);
            alert('SMS de rappel envoyé avec succès!');
        } catch (error) {
            alert('Erreur lors de l\'envoi du SMS');
        } finally {
            setActionLoading(null);
        }
    }

    async function handleMarkPaid(studentId: string) {
        setActionLoading(`pay-${studentId}`);
        try {
            await markTuitionPaid(studentId);
            setUnpaidStudents(prev => prev.filter(s => s.id !== studentId));
            alert('Scolarité marquée comme payée!');
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header
                title="Finances"
                subtitle={`${unpaidStudents.length} impayé(s)`}
            />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card className="border-red-300 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-red-800">
                            <DollarSign className="h-5 w-5" />
                            Recouvrement des Scolarités
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-700">
                            {unpaidStudents.length} élève{unpaidStudents.length > 1 ? 's' : ''} en retard de paiement
                        </p>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {isLoading ? (
                        <Card>
                            <CardContent className="py-8">
                                <p className="text-center text-gray-500">Chargement...</p>
                            </CardContent>
                        </Card>
                    ) : unpaidStudents.length === 0 ? (
                        <Card>
                            <CardContent className="py-8">
                                <div className="text-center">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                    <p className="text-gray-900 font-medium">Toutes les scolarités sont à jour!</p>
                                    <p className="text-sm text-gray-500 mt-1">Aucun impayé à ce jour</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        unpaidStudents.map(student => (
                            <Card key={student.id} className="border-l-4 border-l-red-500">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">
                                            {getInitials(student.name, student.first_name)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">
                                                {student.name} {student.first_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{student.class_name}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Parent: {student.parent_phone}
                                            </p>

                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSendSMS(student.id)}
                                                    disabled={actionLoading !== null}
                                                    className="flex-1"
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    {actionLoading === `sms-${student.id}` ? 'Envoi...' : 'Relancer SMS'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleMarkPaid(student.id)}
                                                    disabled={actionLoading !== null}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    {actionLoading === `pay-${student.id}` ? 'Mise à jour...' : 'Marquer Payé'}
                                                </Button>
                                            </div>
                                        </div>
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
