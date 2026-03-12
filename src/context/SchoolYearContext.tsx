import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SchoolYear } from '../types';

// ─── Données mock des années scolaires ─────────────────────────────────────
export const MOCK_SCHOOL_YEARS: SchoolYear[] = [
    {
        id: '2022-2023',
        label: 'Année 2022-2023',
        start_date: '2022-10-03',
        end_date: '2023-07-28',
        is_active: false,
        is_closed: true,
    },
    {
        id: '2023-2024',
        label: 'Année 2023-2024',
        start_date: '2023-10-02',
        end_date: '2024-07-26',
        is_active: false,
        is_closed: true,
    },
    {
        id: '2024-2025',
        label: 'Année 2024-2025',
        start_date: '2024-09-30',
        end_date: '2025-07-25',
        is_active: true,
        is_closed: false,
    },
];

// ─── Contexte ───────────────────────────────────────────────────────────────
interface SchoolYearContextValue {
    /** Année scolaire sélectionnée dans l'UI (pas forcément l'active) */
    selectedYear: SchoolYear;
    /** Toutes les années disponibles */
    schoolYears: SchoolYear[];
    /** Changer l'année affichée */
    setSelectedYear: (year: SchoolYear) => void;
    /** Créer une nouvelle année et la marquer active */
    openNewYear: (id: string) => void;
    /** Clore l'année active (lecture seule) */
    closeCurrentYear: () => void;
    /** Vrai si l'année affichée est en lecture seule */
    isReadOnly: boolean;
}

const SchoolYearContext = createContext<SchoolYearContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────
const LS_KEY = 'faso_ent_school_years';
const LS_SELECTED = 'faso_ent_selected_year';

function loadYears(): SchoolYear[] {
    try {
        const stored = localStorage.getItem(LS_KEY);
        return stored ? JSON.parse(stored) : MOCK_SCHOOL_YEARS;
    } catch {
        return MOCK_SCHOOL_YEARS;
    }
}

export function SchoolYearProvider({ children }: { children: ReactNode }) {
    const [schoolYears, setSchoolYears] = useState<SchoolYear[]>(loadYears);

    // Au premier rendu, pré-sélectionner l'année enregistrée (ou l'active)
    const initSelected = (): SchoolYear => {
        const stored = localStorage.getItem(LS_SELECTED);
        if (stored) {
            const found = schoolYears.find(y => y.id === stored);
            if (found) return found;
        }
        return schoolYears.find(y => y.is_active) ?? schoolYears[schoolYears.length - 1];
    };

    const [selectedYear, setSelectedYearState] = useState<SchoolYear>(initSelected);

    // Persister les années dans localStorage
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(schoolYears));
    }, [schoolYears]);

    function setSelectedYear(year: SchoolYear) {
        setSelectedYearState(year);
        localStorage.setItem(LS_SELECTED, year.id);
    }

    function openNewYear(id: string) {
        const label = `Année ${id}`;
        const [startY] = id.split('-').map(Number);
        const newYear: SchoolYear = {
            id,
            label,
            start_date: `${startY}-10-01`,
            end_date: `${startY + 1}-07-31`,
            is_active: true,
            is_closed: false,
        };
        setSchoolYears(prev =>
            [...prev.map(y => ({ ...y, is_active: false })), newYear]
        );
        setSelectedYear(newYear);
    }

    function closeCurrentYear() {
        setSchoolYears(prev =>
            prev.map(y =>
                y.id === selectedYear.id ? { ...y, is_closed: true, is_active: false } : y
            )
        );
    }

    const isReadOnly = selectedYear.is_closed;

    return (
        <SchoolYearContext.Provider value={{
            selectedYear,
            schoolYears,
            setSelectedYear,
            openNewYear,
            closeCurrentYear,
            isReadOnly,
        }}>
            {children}
        </SchoolYearContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useSchoolYear() {
    const ctx = useContext(SchoolYearContext);
    if (!ctx) throw new Error('useSchoolYear must be used inside SchoolYearProvider');
    return ctx;
}
