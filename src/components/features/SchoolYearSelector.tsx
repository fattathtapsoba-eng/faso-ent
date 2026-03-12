import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Lock, CheckCircle } from 'lucide-react';
import { useSchoolYear } from '../../context/SchoolYearContext';

/**
 * Sélecteur d'année scolaire affiché dans le header admin.
 * Affiche un badge cliquable → dropdown avec toutes les années.
 */
export function SchoolYearSelector() {
    const { selectedYear, schoolYears, setSelectedYear, isReadOnly } = useSchoolYear();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Fermer si clic extérieur
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all
                    ${isReadOnly
                        ? 'border-amber-400/50 bg-amber-50 text-amber-700'
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                title="Changer d'année scolaire"
            >
                {isReadOnly ? <Lock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                <span>{selectedYear.id}</span>
                {isReadOnly && <span className="text-[10px] font-normal opacity-70">(archivée)</span>}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100">
                        Année scolaire
                    </div>
                    {[...schoolYears].reverse().map(year => (
                        <button
                            key={year.id}
                            onClick={() => { setSelectedYear(year); setOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors hover:bg-blue-50
                                ${selectedYear.id === year.id ? 'font-bold text-blue-700 bg-blue-50/70' : 'text-gray-700'}`}
                        >
                            <span>{year.id}</span>
                            <div className="flex items-center gap-1.5">
                                {year.is_active && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                        <CheckCircle className="w-2.5 h-2.5" /> Active
                                    </span>
                                )}
                                {year.is_closed && (
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                        <Lock className="w-2.5 h-2.5" /> Archivée
                                    </span>
                                )}
                                {selectedYear.id === year.id && (
                                    <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                                )}
                            </div>
                        </button>
                    ))}
                    <div className="border-t border-gray-100 p-2">
                        <a href="/admin/school-years"
                            className="block w-full text-center text-xs text-blue-600 hover:text-blue-800 py-1 font-medium"
                            onClick={() => setOpen(false)}>
                            Gérer les années →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
