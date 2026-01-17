import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { CheckCircle, Clock, CreditCard, Smartphone, Check } from 'lucide-react';
import type { Payment, MobileMoneyProvider } from '../../types';

const LABELS: Record<string, string> = {
    TUITION: 'Scolarité', CANTEEN: 'Cantine', TRANSPORT: 'Transport',
    ACTIVITIES: 'Activités Culturelles', LIBRARY: 'Bibliothèque', TRIPS: 'Sorties Scolaires',
    PARKING: 'Parking', SNACK: 'Goûter', UNIFORM: 'Uniforme', BOOKS: 'Manuels Scolaires',
};

const PROVIDERS = [
    { id: 'ORANGE_MONEY' as const, name: 'Orange Money', color: 'bg-orange-500', logo: '🍊' },
    { id: 'MOOV_MONEY' as const, name: 'Moov Money', color: 'bg-blue-600', logo: '📱' },
    { id: 'CORIS_MONEY' as const, name: 'Coris Money', color: 'bg-green-600', logo: '💳' },
];

export function Payments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<Payment | null>(null);
    const [provider, setProvider] = useState<MobileMoneyProvider | null>(null);
    const [phone, setPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setPayments([
            { id: 'p1', student_id: 's1', student_name: 'Aminata', category: 'TUITION', amount: 150000, status: 'PENDING', due_date: '2025-03-31', created_at: '2025-01-05' },
            { id: 'p2', student_id: 's1', student_name: 'Aminata', category: 'CANTEEN', amount: 25000, status: 'PENDING', due_date: '2025-03-01', created_at: '2025-02-01' },
            { id: 'p3', student_id: 's1', student_name: 'Aminata', category: 'TRANSPORT', amount: 15000, status: 'PENDING', due_date: '2025-02-28', created_at: '2025-02-01' },
            { id: 'p4', student_id: 's1', student_name: 'Aminata', category: 'TRIPS', amount: 20000, status: 'PENDING', due_date: '2025-03-15', created_at: '2025-02-15' },
            { id: 'p5', student_id: 's1', student_name: 'Aminata', category: 'ACTIVITIES', amount: 10000, status: 'PENDING', due_date: '2025-02-28', created_at: '2025-02-01' },
            { id: 'p6', student_id: 's1', student_name: 'Aminata', category: 'UNIFORM', amount: 12000, status: 'PENDING', due_date: '2025-02-20', created_at: '2025-02-01' },
            { id: 'p7', student_id: 's1', student_name: 'Aminata', category: 'BOOKS', amount: 30000, status: 'PENDING', due_date: '2025-02-15', created_at: '2025-01-20' },
            { id: 'p8', student_id: 's1', student_name: 'Aminata', category: 'SNACK', amount: 8000, status: 'PENDING', due_date: '2025-03-01', created_at: '2025-02-01' },
            { id: 'p9', student_id: 's1', student_name: 'Aminata', category: 'LIBRARY', amount: 5000, status: 'PAID', payment_method: 'MOBILE_MONEY', provider: 'MOOV_MONEY', paid_date: '2025-01-10', created_at: '2024-12-15' },
            { id: 'p10', student_id: 's1', student_name: 'Aminata', category: 'PARKING', amount: 3000, status: 'PAID', payment_method: 'MOBILE_MONEY', provider: 'ORANGE_MONEY', paid_date: '2025-01-08', created_at: '2024-12-10' },
        ]);
    }, []);

    const pending = payments.filter(p => p.status === 'PENDING');
    const paid = payments.filter(p => p.status === 'PAID');
    const total = pending.reduce((sum, p) => sum + p.amount, 0);

    const fmt = (amount: number) => amount.toLocaleString('fr-FR') + ' FCFA';
    const fmtDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

    const openModal = (payment: Payment) => {
        setSelected(payment);
        setProvider(null);
        setPhone('');
        setSuccess(false);
        setShowModal(true);
    };

    const processPayment = async () => {
        if (!provider || !phone) return;
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
            setPayments(payments.map(p =>
                p.id === selected?.id
                    ? { ...p, status: 'PAID' as const, payment_method: 'MOBILE_MONEY' as const, provider, paid_date: new Date().toISOString() }
                    : p
            ));
            setTimeout(() => setShowModal(false), 1500);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Paiements" subtitle={`${pending.length} en attente`} />
            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <p className="text-sm opacity-90 mb-1">Total à payer</p>
                        <p className="text-3xl font-bold">{fmt(total)}</p>
                        <p className="text-xs opacity-75 mt-2">{pending.length} services différents</p>
                    </CardContent>
                </Card>

                {pending.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            Paiements En Attente
                        </h3>
                        {pending.map(p => (
                            <Card key={p.id} className="border-orange-200">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-semibold">{LABELS[p.category]}</p>
                                            <p className="text-xs text-gray-500">{p.student_name}</p>
                                            <p className="text-sm text-gray-600">Échéance: {fmtDate(p.due_date!)}</p>
                                        </div>
                                        <p className="text-lg font-bold text-orange-600">{fmt(p.amount)}</p>
                                    </div>
                                    <Button onClick={() => openModal(p)} className="w-full bg-orange-600" size="sm">
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Payer via Mobile Money
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {paid.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Historique Paiements
                        </h3>
                        {paid.map(p => (
                            <Card key={p.id} className="bg-green-50 border-green-200">
                                <CardContent className="p-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{LABELS[p.category]}</p>
                                            <p className="text-sm text-gray-600">Payé le {fmtDate(p.paid_date!)}</p>
                                            {p.provider && <p className="text-xs text-green-700">{p.provider.replace('_', ' ')}</p>}
                                        </div>
                                        <p className="text-lg font-bold text-green-700">{fmt(p.amount)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {showModal && selected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        {success ? (
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-600 mb-2">Paiement Réussi !</h3>
                                <p className="text-gray-600">Transaction confirmée</p>
                            </CardContent>
                        ) : (
                            <>
                                <CardHeader>
                                    <CardTitle>Paiement Mobile Money</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Montant</p>
                                        <p className="text-2xl font-bold">{fmt(selected.amount)}</p>
                                        <p className="text-sm mt-1">{LABELS[selected.category]}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium mb-2">Choisissez votre opérateur</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {PROVIDERS.map(prov => (
                                                <button
                                                    key={prov.id}
                                                    onClick={() => setProvider(prov.id)}
                                                    className={`p-4 rounded-lg border-2 transition-all ${provider === prov.id ? `${prov.color} text-white border-transparent` : 'bg-white border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{prov.logo}</div>
                                                    <p className="text-xs font-medium">{prov.name.split(' ')[0]}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {provider && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                <Smartphone className="inline h-4 w-4 mr-1" />
                                                Numéro de téléphone
                                            </label>
                                            <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="XX XX XX XX XX" className="text-lg" />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1" disabled={processing}>Annuler</Button>
                                        <Button onClick={processPayment} disabled={!provider || !phone || processing} className="flex-1 bg-blue-600">
                                            {processing ? 'Traitement...' : 'Payer'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </div>
            )}
            <BottomNav role="PARENT" />
        </div>
    );
}
