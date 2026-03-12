import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';
import { Header } from '../../components/layout/Header';
import {
    getAdminPilotageStats,
    getDirectionAlerts,
    getDirectionAgenda,
    getClassList,
    getClassDetails,
    sendSMSReminder,
} from '../../services/api/mockApi';
import {
    Users,
    DollarSign,
    ClipboardCheck,
    MessageSquare,
    AlertTriangle,
    CalendarDays,
    TrendingUp,
    BadgeAlert,
    BookOpen,
    Megaphone,
    Download,
    RefreshCw,
    ChevronRight,
    CheckCircle2,
    Clock,
    Phone,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    School,
    CreditCard,
    UserCheck,
    Trophy,
} from 'lucide-react';

type Period = 'today' | '7days' | 'month' | 'trimester';

const PERIOD_LABELS: Record<Period, string> = {
    today: "Aujourd'hui",
    '7days': '7 jours',
    month: 'Ce mois',
    trimester: 'Trimestre',
};

const ALERT_COLORS: Record<string, string> = {
    HIGH: 'bg-red-50 border-red-400 text-red-800',
    MEDIUM: 'bg-amber-50 border-amber-400 text-amber-800',
    LOW: 'bg-blue-50 border-blue-400 text-blue-800',
};

const ALERT_ICONS: Record<string, string> = {
    FINANCE: '💰', ABSENCE: '📋', PEDAGOGY: '📚', RH: '👤',
};

const AGENDA_COLORS: Record<string, string> = {
    MEETING: 'bg-violet-600', DEADLINE: 'bg-rose-500', EVENT: 'bg-emerald-500',
};
const AGENDA_LABELS: Record<string, string> = {
    MEETING: 'Réunion', DEADLINE: 'Échéance', EVENT: 'Événement',
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ─── Composants réutilisables ─────────────────────────────────────────────────

function SectionTitle({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="text-gray-500">{icon}</div>
            <div>
                <h2 className="text-sm font-bold text-gray-800">{title}</h2>
                {sub && <p className="text-xs text-gray-500">{sub}</p>}
            </div>
        </div>
    );
}

function KpiCard({ icon, label, value, sub, sub2, color, alert, onClick }: {
    icon: React.ReactNode; label: string; value: string | number;
    sub?: string; sub2?: string; color: string; alert?: boolean; onClick?: () => void;
}) {
    return (
        <div
            className={`relative rounded-2xl p-4 border ${alert ? 'border-red-300 bg-gradient-to-br from-red-50 to-white' : 'border-gray-100 bg-white'} shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]`}
            onClick={onClick}
        >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${color}`}>{icon}</div>
            {alert && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
            <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>
            {sub && <div className="text-xs text-gray-500">{sub}</div>}
            {sub2 && <div className={`text-xs font-medium mt-0.5 ${alert ? 'text-red-600' : 'text-gray-600'}`}>{sub2}</div>}
        </div>
    );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
    );
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
    if (trend === 'up') return <ArrowUpRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />;
    if (trend === 'down') return <ArrowDownRight className="w-3 h-3 text-rose-400 flex-shrink-0" />;
    return <Minus className="w-3 h-3 text-gray-400 flex-shrink-0" />;
}

// ─── Mini-KPI pour la vue classe ──────────────────────────────────────────────

function ClassKpi({ label, value, sub, color, icon }: {
    label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{label}</p>
                {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────

type ClassData = Awaited<ReturnType<typeof getClassDetails>>;
type ClassItem = { id: string; name: string; level: string };

export function Pilotage() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('today');
    const [isLoading, setIsLoading] = useState(true);
    const [classLoading, setClassLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [trimesterFilter, setTrimesterFilter] = useState<1 | 2 | 3 | 'annual'>('annual');

    // Données globales école
    const [stats, setStats] = useState({
        totalStudents: 0, newEnrollments: 0, paidPercentage: 0,
        unpaidCount: 0, attendanceRate: 0, absentToday: 0, lateToday: 0,
        unreadMessages: 0, classesByLevel: [] as { level: string; count: number }[],
    });
    const [alerts, setAlerts] = useState<Awaited<ReturnType<typeof getDirectionAlerts>>>([]);
    const [agenda, setAgenda] = useState<Awaited<ReturnType<typeof getDirectionAgenda>>>([]);

    // Données par classe
    const [classList, setClassList] = useState<ClassItem[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classData, setClassData] = useState<ClassData | null>(null);

    // Chargement global
    const loadGlobal = useCallback(async () => {
        setIsLoading(true);
        try {
            const [s, a, ag, cl] = await Promise.all([
                getAdminPilotageStats(period),
                getDirectionAlerts(),
                getDirectionAgenda(),
                getClassList(),
            ]);
            setStats(s);
            setAlerts(a);
            setAgenda(ag);
            setClassList(cl);
            if (cl.length > 0 && !selectedClassId) {
                setSelectedClassId(cl[0].id);
            }
        } finally {
            setIsLoading(false);
        }
    }, [period, selectedClassId]);

    // Chargement par classe
    const loadClass = useCallback(async (classId: string, tri?: 1 | 2 | 3 | 'annual') => {
        if (!classId) return;
        setClassLoading(true);
        try {
            const trimArg = tri !== undefined ? tri : trimesterFilter;
            const data = await getClassDetails(
                classId,
                trimArg === 'annual' ? undefined : trimArg
            );
            setClassData(data);
        } finally {
            setClassLoading(false);
        }
    }, [trimesterFilter]);

    useEffect(() => { loadGlobal(); }, [period]);
    useEffect(() => { if (selectedClassId) loadClass(selectedClassId); }, [selectedClassId]);
    useEffect(() => { if (selectedClassId) loadClass(selectedClassId, trimesterFilter); }, [trimesterFilter]);

    const highAlerts = alerts.filter(a => a.severity === 'HIGH').length;

    async function handleSMS(studentId: string, studentName: string) {
        setActionLoading(studentId);
        try {
            await sendSMSReminder(studentId);
            setSuccessMsg(`✓ SMS envoyé au parent de ${studentName}`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleBulkSMS() {
        if (!classData) return;
        setActionLoading('bulk');
        try {
            await Promise.all(classData.unpaid.map(s => sendSMSReminder(s.id)));
            setSuccessMsg(`✓ ${classData.unpaid.length} SMS de relance envoyés`);
            setTimeout(() => setSuccessMsg(''), 3000);
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">

            {/* ── Header standard ── */}
            <Header
                title="Pilotage Direction"
                subtitle={highAlerts > 0 ? `${highAlerts} alerte${highAlerts > 1 ? 's' : ''} critique${highAlerts > 1 ? 's' : ''}` : "Vue d'ensemble"}
            >
                <button onClick={loadGlobal} disabled={isLoading}
                    className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </Header>

            {/* Filtres période */}
            <div className="max-w-screen-lg mx-auto px-4 pt-3">
                <div className="flex gap-1.5">
                    {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${period === p
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {PERIOD_LABELS[p]}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-screen-lg mx-auto px-4 py-5 space-y-6 mt-3">

                {/* Message succès */}
                {successMsg && (
                    <div className="p-3 text-sm text-green-800 bg-green-100 rounded-xl border border-green-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /> {successMsg}
                    </div>
                )}

                {/* ══ VUE GLOBALE ÉCOLE ══ */}
                <section>
                    <SectionTitle icon={<School className="w-4 h-4" />} title="Vue globale — École" sub="Indicateurs globaux de l'établissement" />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <KpiCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Élèves" value={stats.totalStudents}
                            sub={stats.classesByLevel.map(c => `${c.count} ${c.level}`).join(' · ')}
                            sub2={stats.newEnrollments > 0 ? `+${stats.newEnrollments} nouvelles inscriptions` : 'Effectif stable'}
                            color="bg-blue-100" onClick={() => navigate('/admin/students')} />
                        <KpiCard icon={<ClipboardCheck className="w-5 h-5 text-emerald-600" />} label="Présences" value={`${stats.attendanceRate}%`}
                            sub={`Absents: ${stats.absentToday} · Retards: ${stats.lateToday}`}
                            sub2={stats.attendanceRate < 80 ? '⚠ Taux faible' : '✓ Taux satisfaisant'}
                            color="bg-emerald-100" alert={stats.attendanceRate < 80} onClick={() => navigate('/admin/students')} />
                        <KpiCard icon={<DollarSign className="w-5 h-5 text-amber-600" />} label="Finances" value={`${stats.paidPercentage}%`}
                            sub={`${stats.unpaidCount} impayé${stats.unpaidCount > 1 ? 's' : ''}`}
                            sub2={stats.paidPercentage < 70 ? '⚠ Taux critique' : '✓ Recouvrement OK'}
                            color="bg-amber-100" alert={stats.paidPercentage < 70} onClick={() => navigate('/admin/finances')} />
                        <KpiCard icon={<MessageSquare className="w-5 h-5 text-violet-600" />} label="Messages" value={stats.unreadMessages || 0}
                            sub="Non lus en attente" sub2="Accéder à la messagerie"
                            color="bg-violet-100" alert={stats.unreadMessages > 3} onClick={() => navigate('/messages')} />
                    </div>
                </section>

                {/* ══ ALERTES + AGENDA ══ */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Alertes */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <SectionTitle icon={<BadgeAlert className="w-4 h-4 text-rose-400" />}
                            title="Alertes prioritaires"
                            sub={`${alerts.length} alerte${alerts.length > 1 ? 's' : ''} active${alerts.length > 1 ? 's' : ''}`} />
                        {isLoading ? (
                            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-4 text-emerald-300 text-sm">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-1" />Aucune alerte critique
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {alerts.map(alert => (
                                    <button key={alert.id} onClick={() => alert.actionUrl && navigate(alert.actionUrl)}
                                        className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-l-4 transition-all hover:opacity-80 ${ALERT_COLORS[alert.severity]}`}>
                                        <span className="text-lg leading-none mt-0.5">{ALERT_ICONS[alert.type]}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold truncate">{alert.title}</p>
                                                {alert.count && <span className="flex-shrink-0 text-xs font-bold bg-white/50 px-1.5 py-0.5 rounded-full">{alert.count}</span>}
                                            </div>
                                            <p className="text-xs opacity-80 line-clamp-2 mt-0.5">{alert.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-50" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Agenda */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <SectionTitle icon={<CalendarDays className="w-4 h-4 text-blue-300" />} title="Agenda — 7 prochains jours" />
                        <div className="space-y-2">
                            {agenda.map(item => (
                                <div key={item.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className={`flex-shrink-0 w-1.5 min-h-[2.5rem] rounded-full ${AGENDA_COLORS[item.type]}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${AGENDA_COLORS[item.type]}`}>{AGENDA_LABELS[item.type]}</span>
                                            <span className="text-[10px] text-gray-500">{formatDate(item.date)}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-800 mt-0.5">{item.title}</p>
                                        {item.description && <p className="text-[10px] text-gray-500">{item.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ SÉLECTEUR DE CLASSE + FILTRE TRIMESTRE ══ */}
                <section>
                    <SectionTitle icon={<BookOpen className="w-4 h-4 text-sky-300" />}
                        title="Gestion par classe"
                        sub="Sélectionnez une classe puis la période à analyser" />
                    {/* Sélecteur de classe */}
                    <div className="flex gap-2 flex-wrap mb-3">
                        {classList.map(cls => (
                            <button key={cls.id} onClick={() => setSelectedClassId(cls.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedClassId === cls.id
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {cls.name}
                                <span className="ml-1.5 text-[10px] opacity-70 font-normal">{cls.level}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filtres trimestre — visibles dès qu'une classe est sélectionnée */}
                    {selectedClassId && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-400 font-semibold">Période :</span>
                            {([
                                ['annual', 'Annuel', 'bg-violet-500 shadow-violet-500/30'],
                                [1, 'Trimestre 1', 'bg-indigo-500 shadow-indigo-500/30'],
                                [2, 'Trimestre 2', 'bg-indigo-500 shadow-indigo-500/30'],
                                [3, 'Trimestre 3', 'bg-indigo-500 shadow-indigo-500/30'],
                            ] as [1 | 2 | 3 | 'annual', string, string][]).map(([val, label, activeColor]) => (
                                <button key={String(val)} onClick={() => setTrimesterFilter(val)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${trimesterFilter === val
                                        ? `${activeColor} text-white shadow-md`
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* ══ VUE DÉTAILLÉE PAR CLASSE ══ */}
                {selectedClassId && (
                    <section className="space-y-4">
                        {classLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : classData && (
                            <>
                                {/* ── KPIs de la classe ── */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                            <span className="px-2 py-1 rounded-lg bg-primary-100 text-primary-700 text-sm">{classData.className}</span>
                                            <span className="text-xs text-gray-500 font-normal">{classData.level}</span>
                                        </h2>
                                        <button onClick={() => loadClass(selectedClassId)}
                                            className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                                            <RefreshCw className={`w-3 h-3 ${classLoading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <ClassKpi label="Élèves" value={classData.kpis.totalStudents}
                                            icon={<Users className="w-4 h-4 text-blue-300" />}
                                            color="bg-blue-500/20" />
                                        <ClassKpi label="Présents" value={`${classData.kpis.attendanceRate}%`}
                                            sub={`${classData.kpis.absentToday} abs · ${classData.kpis.lateToday} ret`}
                                            icon={<UserCheck className="w-4 h-4 text-emerald-300" />}
                                            color={classData.kpis.attendanceRate < 80 ? 'bg-rose-500/20' : 'bg-emerald-500/20'} />
                                        <ClassKpi label="Réussite" value={`${classData.kpis.successRate}%`}
                                            sub={`Moy. ${classData.kpis.classAverage > 0 ? classData.kpis.classAverage + '/20' : 'N/A'}`}
                                            icon={<Trophy className="w-4 h-4 text-amber-300" />}
                                            color={classData.kpis.successRate >= 70 ? 'bg-emerald-500/20' : 'bg-amber-500/20'} />
                                        <ClassKpi label="Frais payés" value={`${classData.kpis.feeRate}%`}
                                            sub={`${classData.kpis.unpaidCount} impayé${classData.kpis.unpaidCount > 1 ? 's' : ''}`}
                                            icon={<CreditCard className="w-4 h-4 text-amber-300" />}
                                            color={classData.kpis.feeRate < 70 ? 'bg-rose-500/20' : 'bg-amber-500/20'} />
                                    </div>
                                </div>

                                {/* ── TOP 5 / BOTTOM 5 ── */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Top 5 */}
                                    <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm">
                                        <SectionTitle icon={<Trophy className="w-4 h-4 text-amber-500" />}
                                            title="🏆 Top 5 élèves"
                                            sub="Meilleurs résultats cette année" />
                                        <div className="space-y-2">
                                            {classData.top5.length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-3">Pas de notes saisies</p>
                                            )}
                                            {classData.top5.map((s, idx) => (
                                                <div key={s.id} className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-amber-400 text-amber-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-amber-700 text-amber-100' : 'bg-gray-100 text-gray-600'}`}>
                                                        {s.rank}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                                                        <p className="text-[10px] text-gray-500">{s.absencesTotal} absence{s.absencesTotal !== 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <TrendIcon trend={s.trend} />
                                                        <span className={`text-xs font-bold ${s.average >= 14 ? 'text-emerald-400' : s.average >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                            {s.average > 0 ? `${s.average}/20` : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom 5 */}
                                    <div className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm">
                                        <SectionTitle icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
                                            title="⚠ Élèves en difficulté"
                                            sub="Suivi prioritaire requis" />
                                        <div className="space-y-2">
                                            {classData.bottom5.length === 0 && (
                                                <p className="text-xs text-gray-400 text-center py-3">Pas de notes saisies</p>
                                            )}
                                            {classData.bottom5.map((s) => (
                                                <div key={s.id} className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                        {s.rank}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                                                        <p className="text-[10px] text-gray-500">{s.absencesTotal} absence{s.absencesTotal !== 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <TrendIcon trend={s.trend} />
                                                        <span className={`text-xs font-bold ${s.average >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                            {s.average > 0 ? `${s.average}/20` : '—'}
                                                        </span>
                                                        <button onClick={() => handleSMS(s.id, s.name)}
                                                            disabled={actionLoading === s.id}
                                                            className="p-1.5 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors"
                                                            title="Contacter parent">
                                                            <Phone className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── ABSENTS DU JOUR ── */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                    <SectionTitle icon={<ClipboardCheck className="w-4 h-4 text-rose-500" />}
                                        title={`Absents aujourd'hui — ${classData.className}`}
                                        sub={classData.absentStudentsToday.length === 0 ? 'Tous les élèves sont présents ✓' : `${classData.absentStudentsToday.length} élève${classData.absentStudentsToday.length > 1 ? 's' : ''} absent${classData.absentStudentsToday.length > 1 ? 's' : ''}`} />

                                    {classData.absentStudentsToday.length === 0 ? (
                                        <div className="text-center py-4">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                                            <p className="text-xs text-emerald-600">Présence complète aujourd'hui</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {classData.absentStudentsToday.map(s => (
                                                <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'ABSENT' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800">{s.name}</p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {s.status === 'ABSENT' ? 'Absent' : 'En retard'}
                                                            {s.justified ? ' · Justifié' : ' · Non justifié'}
                                                        </p>
                                                    </div>
                                                    <a href={`tel:${s.phone}`}
                                                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-xs font-semibold">
                                                        <Phone className="w-3 h-3" />
                                                        Appeler
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ── ÉLÈVES LES PLUS ABSENTS (année) ── */}
                                {classData.mostAbsent.length > 0 && (
                                    <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
                                        <SectionTitle icon={<Clock className="w-4 h-4 text-amber-500" />}
                                            title="Absentéisme récurrent"
                                            sub="Élèves avec le plus d'absences sur l'année" />
                                        <div className="space-y-2">
                                            {classData.mostAbsent.map(s => (
                                                <div key={s.id} className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800">{s.name}</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-amber-400 flex-shrink-0">
                                                        {s.absences} abs.
                                                    </span>
                                                    <a href={`tel:${s.phone}`}
                                                        className="flex items-center gap-1 py-1 px-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-xs">
                                                        <Phone className="w-3 h-3" /> Appeler
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── IMPAYÉS DE LA CLASSE ── */}
                                {classData.unpaid.length > 0 && (
                                    <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <SectionTitle icon={<DollarSign className="w-4 h-4 text-amber-500" />}
                                                title={`Impayés — ${classData.className}`}
                                                sub={`${classData.unpaid.length} élève${classData.unpaid.length > 1 ? 's' : ''} en attente de paiement`} />
                                            <button onClick={handleBulkSMS} disabled={actionLoading === 'bulk'}
                                                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 text-white hover:bg-amber-400 disabled:opacity-50 transition-colors text-xs font-bold flex-shrink-0">
                                                <MessageSquare className="w-3 h-3" />
                                                {actionLoading === 'bulk' ? 'Envoi...' : 'Relancer tous'}
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {classData.unpaid.map(s => (
                                                <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                                                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                                                    <p className="text-xs font-semibold text-gray-800 flex-1 min-w-0 truncate">{s.name}</p>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button onClick={() => handleSMS(s.id, s.name)} disabled={actionLoading === s.id}
                                                            className="flex items-center gap-1 py-1 px-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-xs disabled:opacity-50">
                                                            <MessageSquare className="w-3 h-3" /> SMS
                                                        </button>
                                                        <a href={`tel:${s.phone}`}
                                                            className="flex items-center gap-1 py-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-xs">
                                                            <Phone className="w-3 h-3" /> Appeler
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── NOTES PAR MATIÈRE ── */}
                                {classData.subjectAverages.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                                        <SectionTitle icon={<BookOpen className="w-4 h-4 text-primary-500" />}
                                            title={`Notes par matière — ${classData.className}`}
                                            sub="Moyenne annuelle de la classe dans chaque matière" />
                                        <div className="space-y-3">
                                            {classData.subjectAverages.map(subj => (
                                                <div key={subj.subject}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-gray-800">{subj.subject}</span>
                                                        <span className={`text-xs font-bold ${subj.average >= 12 ? 'text-emerald-400' : subj.average >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                            {subj.average > 0 ? `${subj.average}/20` : '—'}
                                                        </span>
                                                    </div>
                                                    {subj.average > 0 && (
                                                        <ProgressBar
                                                            pct={(subj.average / 20) * 100}
                                                            color={subj.average >= 12 ? 'bg-emerald-500' : subj.average >= 10 ? 'bg-amber-500' : 'bg-rose-500'}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )}

                {/* ══ ACTIONS RAPIDES GLOBALES ══ */}
                <section>
                    <SectionTitle icon={<TrendingUp className="w-4 h-4 text-white" />} title="Actions rapides" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button onClick={() => navigate('/admin/students')}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all text-white shadow-lg shadow-blue-600/30 active:scale-95">
                            <Users className="w-6 h-6" />
                            <span className="text-xs font-bold text-center">Gérer élèves</span>
                        </button>
                        <button onClick={() => navigate('/admin/finances')}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 transition-all text-white shadow-lg shadow-amber-500/30 active:scale-95">
                            <DollarSign className="w-6 h-6" />
                            <span className="text-xs font-bold text-center">Suivi finances</span>
                        </button>
                        <button onClick={() => navigate('/admin/messages/compose')}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition-all text-white shadow-lg shadow-emerald-600/30 active:scale-95">
                            <Megaphone className="w-6 h-6" />
                            <span className="text-xs font-bold text-center">Annonce école</span>
                        </button>
                        <button onClick={() => {
                            if (!classData) return;
                            const csv = `Élève,Moyenne,Frais,Absences\n${classData.allStudents.map(s => `${s.name},${s.average}/20,${s.tuition_status === 'PAID' ? 'Payé' : 'Impayé'},${s.absencesTotal}`).join('\n')}`;
                            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = `classe_${classData?.className ?? 'export'}.csv`; a.click();
                            URL.revokeObjectURL(url);
                        }}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-sky-600 hover:bg-sky-500 transition-all text-white shadow-lg shadow-sky-600/30 active:scale-95">
                            <Download className="w-6 h-6" />
                            <span className="text-xs font-bold text-center">Export classe</span>
                        </button>
                    </div>
                </section>

            </main>

            <BottomNav role="ADMIN" />
        </div>
    );
}
