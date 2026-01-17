import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Save, Building, Calendar as CalendarIcon, DollarSign } from 'lucide-react';

interface SchoolSettings {
    name: string;
    address: string;
    trimester1Start: string;
    trimester1End: string;
    trimester2Start: string;
    trimester2End: string;
    trimester3Start: string;
    trimester3End: string;
    tuition6eme: string;
    tuition5eme: string;
    tuitionCM2: string;
}

export function Settings() {
    const [settings, setSettings] = useState<SchoolSettings>({
        name: 'Collège Faso-ENT',
        address: 'Ouagadougou, Burkina Faso',
        trimester1Start: '2024-09-01',
        trimester1End: '2024-12-15',
        trimester2Start: '2025-01-05',
        trimester2End: '2025-03-31',
        trimester3Start: '2025-04-07',
        trimester3End: '2025-06-30',
        tuition6eme: '150000',
        tuition5eme: '150000',
        tuitionCM2: '120000',
    });

    const [saved, setSaved] = useState(false);

    function handleSave() {
        // Save to localStorage
        localStorage.setItem('school_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    function updateField(field: keyof SchoolSettings, value: string) {
        setSettings(prev => ({ ...prev, [field]: value }));
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="Paramètres" subtitle="Configuration de l'école" />

            <main className="max-w-screen-sm mx-auto p-4 space-y-4">
                {saved && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        ✓ Paramètres enregistrés avec succès
                    </div>
                )}

                {/* Informations École */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary-600" />
                            Informations de l'École
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom de l'école
                            </label>
                            <Input
                                value={settings.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                placeholder="Nom de l'école"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse
                            </label>
                            <Input
                                value={settings.address}
                                onChange={(e) => updateField('address', e.target.value)}
                                placeholder="Adresse complète"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Année Scolaire */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary-600" />
                            Année Scolaire 2024-2025
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Trimestre 1</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Début</label>
                                    <Input
                                        type="date"
                                        value={settings.trimester1Start}
                                        onChange={(e) => updateField('trimester1Start', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Fin</label>
                                    <Input
                                        type="date"
                                        value={settings.trimester1End}
                                        onChange={(e) => updateField('trimester1End', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Trimestre 2</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Début</label>
                                    <Input
                                        type="date"
                                        value={settings.trimester2Start}
                                        onChange={(e) => updateField('trimester2Start', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Fin</label>
                                    <Input
                                        type="date"
                                        value={settings.trimester2End}
                                        onChange={(e) => updateField('trimester2End', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Trimestre 3</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Début</label>
                                    <Input
                                        type="date"
                                        value={settings.trimester3Start}
                                        onChange={(e) => updateField('trimester3Start', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Fin</label>
                                    <Input
                                        type="date"
                                        value={settings.trimester3End}
                                        onChange={(e) => updateField('trimester3End', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Frais de Scolarité */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary-600" />
                            Frais de Scolarité (FCFA)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                6ème
                            </label>
                            <Input
                                type="number"
                                value={settings.tuition6eme}
                                onChange={(e) => updateField('tuition6eme', e.target.value)}
                                placeholder="150000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                5ème
                            </label>
                            <Input
                                type="number"
                                value={settings.tuition5eme}
                                onChange={(e) => updateField('tuition5eme', e.target.value)}
                                placeholder="150000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CM2
                            </label>
                            <Input
                                type="number"
                                value={settings.tuitionCM2}
                                onChange={(e) => updateField('tuitionCM2', e.target.value)}
                                placeholder="120000"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Button onClick={handleSave} className="w-full" size="lg">
                    <Save className="h-5 w-5 mr-2" />
                    Enregistrer les paramètres
                </Button>
            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}
