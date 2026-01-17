import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Edit, Save } from 'lucide-react';
import type { PaymentCategory } from '../../types';

interface ServiceConfig {
    category: PaymentCategory;
    label: string;
    amount: number;
    enabled: boolean;
    description: string;
}

const DEFAULT_SERVICES: ServiceConfig[] = [
    { category: 'TUITION', label: 'Scolarité', amount: 150000, enabled: true, description: 'Frais de scolarité trimestriels' },
    { category: 'CANTEEN', label: 'Cantine', amount: 25000, enabled: true, description: 'Repas quotidiens' },
    { category: 'TRANSPORT', label: 'Transport', amount: 15000, enabled: true, description: 'Bus scolaire mensuel' },
    { category: 'ACTIVITIES', label: 'Activités', amount: 10000, enabled: true, description: 'Activités culturelles et sportives' },
    { category: 'LIBRARY', label: 'Bibliothèque', amount: 5000, enabled: false, description: 'Accès bibliothèque' },
    { category: 'TRIPS', label: 'Sorties', amount: 20000, enabled: true, description: 'Sorties éducatives' },
    { category: 'PARKING', label: 'Parking', amount: 3000, enabled: false, description: 'Parking véhicules' },
    { category: 'SNACK', label: 'Goûter', amount: 8000, enabled: true, description: 'Goûters journaliers' },
    { category: 'UNIFORM', label: 'Uniforme', amount: 12000, enabled: true, description: 'Tenue scolaire officielle' },
    { category: 'BOOKS', label: 'Manuels', amount: 30000, enabled: true, description: 'Livres et fournitures' },
];

export function Services() {
    const [services, setServices] = useState<ServiceConfig[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('payment_services');
        setServices(stored ? JSON.parse(stored) : DEFAULT_SERVICES);
    }, []);

    function save() {
        localStorage.setItem('payment_services', JSON.stringify(services));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    function toggle(category: PaymentCategory) {
        setServices(services.map(s => s.category === category ? { ...s, enabled: !s.enabled } : s));
    }

    function updateAmount(category: PaymentCategory, amount: number) {
        setServices(services.map(s => s.category === category ? { ...s, amount } : s));
    }

    const enabledCount = services.filter(s => s.enabled).length;
    const totalRevenue = services.filter(s => s.enabled).reduce((sum, s) => sum + s.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Services de Paiement" subtitle={`${enabledCount} services actifs`} />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <p className="text-sm opacity-90 mb-1">Revenus potentiels (par élève)</p>
                        <p className="text-3xl font-bold">{totalRevenue.toLocaleString('fr-FR')} FCFA</p>
                        <p className="text-xs opacity-75 mt-2">{enabledCount} services configurés</p>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {services.map(service => (
                        <Card key={service.category} className={service.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={service.enabled}
                                                onChange={() => toggle(service.category)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <h3 className="font-semibold">{service.label}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 ml-7">{service.description}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditing(editing === service.category ? null : service.category)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>

                                {editing === service.category ? (
                                    <div className="ml-7 mt-3 flex gap-2">
                                        <Input
                                            type="number"
                                            value={service.amount}
                                            onChange={e => updateAmount(service.category, parseInt(e.target.value) || 0)}
                                            className="w-32"
                                        />
                                        <span className="text-sm text-gray-600 self-center">FCFA</span>
                                    </div>
                                ) : (
                                    <p className="ml-7 text-lg font-bold text-blue-600">
                                        {service.amount.toLocaleString('fr-FR')} FCFA
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button onClick={save} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <Save className="h-5 w-5 mr-2" />
                    {saved ? 'Sauvegardé ✓' : 'Sauvegarder la Configuration'}
                </Button>

                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                        <p className="text-sm font-medium text-yellow-800">💡 Conseil</p>
                        <p className="text-sm text-yellow-700 mt-1">
                            Les services désactivés n'apparaîtront pas dans les paiements parents.
                            Ajustez les montants selon vos tarifs.
                        </p>
                    </CardContent>
                </Card>
            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}
