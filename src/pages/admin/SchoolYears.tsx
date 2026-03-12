import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { BottomNav } from '../../components/layout/BottomNav';
import {
    CalendarDays, PlusCircle, Lock, Unlock, CheckCircle,
    AlertTriangle, ArrowRight, ChevronRight,
} from 'lucide-react';
import { useSchoolYear } from '../../context/SchoolYearContext';

function generateNextYearId(years: { id: string }[]): string {
    const ids = years.map(y => y.id).sort();
    const last = ids[ids.length - 1] ?? '2024-2025';
    const [, endStr] = last.split('-');
    const end = parseInt(endStr, 10);
    return `${end}-${end + 1}`;
}

export function SchoolYears() {
    const navigate = useNavigate();
    const { schoolYears, selectedYear, setSelectedYear, openNewYear, closeCurrentYear } = useSchoolYear();
    const [confirmClose, setConfirmClose] = useState(false);

    const activeYear = schoolYears.find(y => y.is_active);
    const nextId = generateNextYearId(schoolYears);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Années scolaires" subtitle="Gestion et archives" />

            <main className="max-w-screen-sm mx-auto px-4 py-6 pb-24 space-y-6">

                {/* Année active */}
                <section>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Année en cours
                    </h2>
                    {activeYear ? (
                        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                            <CheckCircle className="w-3 h-3" /> Active
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-gray-900">{activeYear.id}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Du {activeYear.start_date} au {activeYear.end_date}
                                    </p>
                                </div>
                                <CalendarDays className="w-8 h-8 text-emerald-400" />
                            </div>

                            {/* Action : clôturer */}
                            {!confirmClose ? (
                                <button
                                    onClick={() => setConfirmClose(true)}
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors"
                                >
                                    <Lock className="w-4 h-4" />
                                    Clôturer l'année (lecture seule)
                                </button>
                            ) : (
                                <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-3">
                                    <div className="flex items-start gap-2 mb-3">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800 font-medium">
                                            La clôture est irréversible. L'année passera en lecture seule
                                            et ne pourra plus être modifiée.
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setConfirmClose(false)}
                                            className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() => { closeCurrentYear(); setConfirmClose(false); }}
                                            className="flex-1 py-2 rounded-lg bg-amber-500 text-white text-xs font-bold">
                                            Confirmer la clôture
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                            <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                            <p className="text-sm text-amber-700 font-semibold">Aucune année active</p>
                            <p className="text-xs text-amber-600 mt-1">Ouvrez une nouvelle année ci-dessous.</p>
                        </div>
                    )}
                </section>

                {/* Ouvrir nouvelle année */}
                {!activeYear && (
                    <section>
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                            Nouvelle année
                        </h2>
                        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-4">
                            <p className="text-sm text-gray-700 mb-1">Prochaine année détectée :</p>
                            <p className="text-2xl font-bold text-blue-700 mb-4">{nextId}</p>
                            <button
                                onClick={() => openNewYear(nextId)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Ouvrir l'année {nextId}
                            </button>
                            <p className="text-[11px] text-gray-400 mt-2 text-center">
                                Les classes et élèves seront reconduits automatiquement.
                            </p>
                        </div>
                    </section>
                )}

                {/* Archives */}
                <section>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Archives
                    </h2>
                    <div className="space-y-2">
                        {[...schoolYears].reverse().map(year => (
                            <button
                                key={year.id}
                                onClick={() => { setSelectedYear(year); navigate('/admin/pilotage'); }}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border bg-white shadow-sm hover:border-blue-300 transition-all text-left
                                    ${selectedYear.id === year.id ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {year.is_active
                                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        : year.is_closed
                                            ? <Lock className="w-5 h-5 text-gray-400" />
                                            : <Unlock className="w-5 h-5 text-blue-400" />
                                    }
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{year.id}</p>
                                        <p className="text-xs text-gray-500">
                                            {year.is_active ? 'En cours' : year.is_closed ? 'Archivée' : 'Non démarrée'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedYear.id === year.id && (
                                        <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                                            Affichée
                                        </span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-700 space-y-1">
                            <p><strong>Année active :</strong> données modifiables (notes, présences, frais)</p>
                            <p><strong>Année archivée :</strong> consultation seule — aucune modification possible</p>
                            <p><strong>Changement d'affichage :</strong> cliquer sur une année la sélectionne dans le header</p>
                        </div>
                    </div>
                </div>

            </main>
            <BottomNav role="ADMIN" />
        </div>
    );
}
