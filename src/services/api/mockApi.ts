import type { User, Parent, StudentUser, Student, Grade, LoginCredentials, AuthResponse, Class, Schedule, AttendanceRecord, AttendanceStats } from '../../types';

/**
 * Mock API service to simulate backend calls
 * This allows development without Supabase dependency
 * Can be replaced with real Supabase calls later
 */

// Mock data
let mockUsers: (User | Parent | StudentUser)[] = [
    {
        id: '1',
        role: 'ADMIN',
        name: 'Directeur Touré',
        phone: '+22670123456',
    },
    {
        id: '2',
        role: 'TEACHER',
        name: 'Prof. Kaboré',
        phone: '+22676543210',
        assigned_classes: ['c1'],                    // Seulement 6ème A
        subjects: ['Mathématiques', 'Physique'],
        is_main_teacher: true,
        main_class_id: 'c1',
    },
    {
        id: '3',
        role: 'TEACHER',
        name: 'Prof. Sawadogo',
        phone: '+22676543211',
        assigned_classes: ['c2'],                    // Seulement 5ème B
        subjects: ['Français', 'Anglais', 'Histoire-Géo'],
        is_main_teacher: true,
        main_class_id: 'c2',
    },
    {
        id: 'p1',
        role: 'PARENT',
        name: 'OUEDRAOGO Marie',
        phone: '+22678901234',
        children: ['s1', 's2'], // Aminata + Ibrahim (multi-child for testing)
    },
    {
        id: 'p2',
        role: 'PARENT',
        name: 'SAWADOGO Pierre',
        phone: '+22678901235',
        children: ['s3'], // Fatoumata
    },
    {
        id: 'stu1',
        role: 'STUDENT',
        name: 'Aminata Ouédraogo',
        phone: '+22678901236',
        student_id: 's1',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES RÉALISTES — Collège + Lycée Burkina Faso
// ─────────────────────────────────────────────────────────────────────────────

// Noms burkinabés authentiques
const SURNAMES = [
    'Ouédraogo', 'Sawadogo', 'Traoré', 'Compaoré', 'Kaboré', 'Zongo', 'Tapsoba',
    'Ilboudo', 'Sow', 'Barry', 'Diallo', 'Yago', 'Belem', 'Nikiema', 'Koné',
    'Sanogo', 'Ouattara', 'Coulibaly', 'Ky', 'Guiro', 'Lompo', 'Badini',
    'Bambara', 'Dicko', 'Drabo', 'Gnankambary', 'Hien', 'Kabré', 'Lankoandé',
];
const MALE_NAMES = [
    'Ibrahim', 'Moussa', 'Boureima', 'Souleymane', 'Adama', 'Seydou', 'Hamidou',
    'Zakaria', 'Issouf', 'Yacouba', 'Oumarou', 'Mahamadou', 'Idrissa', 'Abdoulaye',
    'Saidou', 'Boubacar', 'Lassané', 'Dramane', 'Youssouf', 'Abdoulkarim',
    'Daouda', 'Sibiri', 'Rasmané', 'Wendyam', 'Pingdwendé', 'Naby', 'Sékou',
];
const FEMALE_NAMES = [
    'Aminata', 'Fatoumata', 'Mariam', 'Aïcha', 'Hawa', 'Salimata', 'Rokia',
    'Bintou', 'Kadiatou', 'Ramata', 'Assétou', 'Djeneba', 'Habibatou',
    'Rasmata', 'Fanta', 'Nafissatou', 'Biba', 'Djénébou', 'Roukiatou',
    'Safiatou', 'Zénabou', 'Korotoumou', 'Agathe', 'Odile', 'Martine',
];

// Matières par filière
const SUBJECTS: Record<string, { name: string; coef: number }[]> = {
    'college': [
        { name: 'Mathématiques', coef: 4 },
        { name: 'Français', coef: 4 },
        { name: 'Anglais', coef: 2 },
        { name: 'Histoire-Géo', coef: 2 },
        { name: 'SVT', coef: 2 },
        { name: 'Physique-Chimie', coef: 2 },
    ],
    'lycee_a': [
        { name: 'Philosophie', coef: 4 },
        { name: 'Français', coef: 4 },
        { name: 'Histoire-Géo', coef: 3 },
        { name: 'Anglais', coef: 2 },
        { name: 'Espagnol', coef: 2 },
        { name: 'Mathématiques', coef: 2 },
    ],
    'lycee_c': [
        { name: 'Mathématiques', coef: 5 },
        { name: 'Physique-Chimie', coef: 4 },
        { name: 'SVT', coef: 3 },
        { name: 'Français', coef: 3 },
        { name: 'Anglais', coef: 2 },
    ],
    'lycee_d': [
        { name: 'Mathématiques', coef: 4 },
        { name: 'Physique-Chimie', coef: 4 },
        { name: 'Sciences Nat.', coef: 4 },
        { name: 'Français', coef: 3 },
        { name: 'Anglais', coef: 2 },
    ],
};

// Déterministe — évite les valeurs aléatoires à chaque rechargement
function det(seed: number): number {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

// Définition des classes
const CLASS_DEFS: { id: string; name: string; level: string; filiere: string; count: number }[] = [
    // ── Collège ──
    { id: 'c6a', name: '6ème A', level: 'Collège', filiere: 'college', count: 38 },
    { id: 'c6b', name: '6ème B', level: 'Collège', filiere: 'college', count: 42 },
    { id: 'c5a', name: '5ème A', level: 'Collège', filiere: 'college', count: 35 },
    { id: 'c5b', name: '5ème B', level: 'Collège', filiere: 'college', count: 40 },
    { id: 'c4a', name: '4ème A', level: 'Collège', filiere: 'college', count: 37 },
    { id: 'c4b', name: '4ème B', level: 'Collège', filiere: 'college', count: 33 },
    { id: 'c3a', name: '3ème A', level: 'Collège', filiere: 'college', count: 36 },
    { id: 'c3b', name: '3ème B', level: 'Collège', filiere: 'college', count: 38 },
    // ── Lycée 2nde ──
    { id: 'c2a', name: '2nde A', level: 'Lycée', filiere: 'lycee_a', count: 40 },
    { id: 'c2c', name: '2nde C', level: 'Lycée', filiere: 'lycee_c', count: 38 },
    { id: 'c2d', name: '2nde D', level: 'Lycée', filiere: 'lycee_d', count: 35 },
    // ── Lycée 1ère ──
    { id: 'c1a', name: '1ère A', level: 'Lycée', filiere: 'lycee_a', count: 32 },
    { id: 'c1c', name: '1ère C', level: 'Lycée', filiere: 'lycee_c', count: 30 },
    { id: 'c1d', name: '1ère D', level: 'Lycée', filiere: 'lycee_d', count: 33 },
    // ── Lycée Terminale ──
    { id: 'cta', name: 'Tle A', level: 'Lycée', filiere: 'lycee_a', count: 35 },
    { id: 'ctc', name: 'Tle C', level: 'Lycée', filiere: 'lycee_c', count: 31 },
    { id: 'ctd', name: 'Tle D', level: 'Lycée', filiere: 'lycee_d', count: 30 },
];

let mockClasses: Class[] = CLASS_DEFS.map(({ id, name, level }) => ({ id, name, level }));

// ── Génération déterministe des élèves ──────────────────────────────────────
let mockStudents: Student[] = [];
{
    let sid = 0;
    for (const cls of CLASS_DEFS) {
        for (let i = 0; i < cls.count; i++) {
            const isFemale = det(sid * 3 + 1) > 0.48;
            const firstPool = isFemale ? FEMALE_NAMES : MALE_NAMES;
            const fn = firstPool[Math.floor(det(sid * 11 + 2) * firstPool.length)];
            const ln = SURNAMES[Math.floor(det(sid * 7 + 3) * SURNAMES.length)];
            const phone = `+2267${String(Math.floor(det(sid * 13 + 4) * 90000000) + 10000000).slice(0, 8)}`;
            const paid = det(sid * 17 + 5) > 0.28; // ~72% taux de paiement
            mockStudents.push({
                id: `s${sid}`,
                name: ln,
                first_name: fn,
                class_id: cls.id,
                class_name: cls.name,
                parent_phone: phone,
                tuition_status: paid ? 'PAID' : 'UNPAID',
            });
            sid++;
        }
    }
}

// ── Génération déterministe des notes ────────────────────────────────────────
// 2 évaluations par matière par trimestre (devoir + composition)
let mockGrades: Grade[] = [];
{
    let gid = 0;
    for (const cls of CLASS_DEFS) {
        const subjects = SUBJECTS[cls.filiere];
        const clsStudents = mockStudents.filter(s => s.class_id === cls.id);
        for (const student of clsStudents) {
            const sNum = parseInt(student.id.replace('s', ''));
            // Profil de l'élève : 0 = en difficulté, 1 = excellent
            const talent = det(sNum * 19 + 7);
            const baseScore = 5 + talent * 14; // entre 5 et 19
            for (let t = 1; t <= 3; t++) {
                for (const subj of subjects) {
                    // Devoir
                    const scoreD = Math.max(2, Math.min(20, parseFloat(
                        (baseScore + (det(gid * 3 + 1) - 0.5) * 5).toFixed(1)
                    )));
                    mockGrades.push({
                        id: `g${gid}`,
                        student_id: student.id,
                        subject: subj.name,
                        score: scoreD,
                        coefficient: 2,
                        evaluation_type: 'devoir',
                        trimester: t as 1 | 2 | 3,
                        date: `2024-${t === 1 ? '10' : t === 2 ? '01' : '04'}-15`,
                        synced: true,
                        sync_status: 'synced',
                    });
                    gid++;
                    // Composition
                    const scoreC = Math.max(2, Math.min(20, parseFloat(
                        (baseScore + (det(gid * 3 + 1) - 0.5) * 4).toFixed(1)
                    )));
                    mockGrades.push({
                        id: `g${gid}`,
                        student_id: student.id,
                        subject: subj.name,
                        score: scoreC,
                        coefficient: subj.coef,
                        evaluation_type: 'composition',
                        trimester: t as 1 | 2 | 3,
                        date: `2024-${t === 1 ? '11' : t === 2 ? '02' : '05'}-20`,
                        synced: true,
                        sync_status: 'synced',
                    });
                    gid++;
                }
            }
        }
    }
}



let mockSchedules: Schedule[] = [
    { id: 'sch1', class_id: 'c6a', day: 'lundi', start_time: '08:00', end_time: '10:00', subject: 'Mathématiques', teacher_id: '2', teacher_name: 'Prof. Kaboré', room: 'Salle 101' },
    { id: 'sch2', class_id: 'c6a', day: 'mardi', start_time: '10:00', end_time: '12:00', subject: 'Français', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 101' },
    { id: 'sch3', class_id: 'c5a', day: 'lundi', start_time: '08:00', end_time: '10:00', subject: 'Mathématiques', teacher_id: '2', teacher_name: 'Prof. Kaboré', room: 'Salle 201' },
    { id: 'sch4', class_id: 'c5a', day: 'lundi', start_time: '14:00', end_time: '16:00', subject: 'Anglais', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 202' },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));




// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcStudentAverage(studentId: string, grades: typeof mockGrades): number {
    const g = grades.filter(x => x.student_id === studentId);
    if (g.length === 0) return 0;
    const ws = g.reduce((a, x) => a + x.score * x.coefficient, 0);
    const tc = g.reduce((a, x) => a + x.coefficient, 0);
    return tc > 0 ? parseFloat((ws / tc).toFixed(1)) : 0;
}

function calcTrend(studentId: string, grades: typeof mockGrades): 'up' | 'down' | 'stable' {
    const t1 = grades.filter(g => g.student_id === studentId && g.trimester === 1);
    const t3 = grades.filter(g => g.student_id === studentId && g.trimester === 3);
    const avg = (gs: typeof mockGrades) => {
        const ws = gs.reduce((a, g) => a + g.score * g.coefficient, 0);
        const tc = gs.reduce((a, g) => a + g.coefficient, 0);
        return tc > 0 ? ws / tc : 0;
    };
    const a1 = avg(t1), a3 = avg(t3);
    return a3 > a1 + 0.5 ? 'up' : a3 < a1 - 0.5 ? 'down' : 'stable';
}

/**
 * Liste toutes les classes disponibles
 */
export async function getClassList() {
    await delay(100);
    return mockClasses.map(c => ({ id: c.id, name: c.name, level: c.level }));
}

/**
 * Données complètes d'une classe pour la gestion quotidienne
 * @param trimester 1|2|3 pour filtrer, undefined = annuel (tous les trimestres)
 */
export async function getClassDetails(classId: string, trimester?: 1 | 2 | 3) {
    await delay(300);

    const cls = mockClasses.find(c => c.id === classId);
    if (!cls) throw new Error('Classe introuvable');

    const students = mockStudents.filter(s => s.class_id === classId);
    // Filtrer les notes par trimestre si spécifié
    const allGrades = mockGrades.filter(g => students.some(s => s.id === g.student_id));
    const grades = trimester
        ? allGrades.filter(g => g.trimester === trimester)
        : allGrades;

    // Attendances from localStorage
    const stored = localStorage.getItem('faso_ent_attendance');
    const allAttendance: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = allAttendance.filter(r =>
        r.date === todayStr && students.some(s => s.id === r.student_id)
    );

    // ── KPIs de la classe ──
    const totalStudents = students.length;
    const absentToday = todayRecords.filter(r => r.status === 'ABSENT').length;
    const lateToday = todayRecords.filter(r => r.status === 'LATE').length;
    const presentToday = totalStudents - absentToday - lateToday;
    const attendanceRate = totalStudents > 0
        ? Math.round((presentToday / totalStudents) * 100) : 100;

    const paid = students.filter(s => s.tuition_status === 'PAID').length;
    const feeRate = totalStudents > 0 ? Math.round((paid / totalStudents) * 100) : 0;

    const studentsWithGrades = students.filter(s =>
        grades.some(g => g.student_id === s.id)
    );
    const classAverage = studentsWithGrades.length > 0
        ? parseFloat((
            studentsWithGrades.reduce((sum, s) => sum + calcStudentAverage(s.id, grades), 0)
            / studentsWithGrades.length
        ).toFixed(1))
        : 0;
    const successRate = studentsWithGrades.length > 0
        ? Math.round(
            (studentsWithGrades.filter(s => calcStudentAverage(s.id, grades) >= 10).length
                / studentsWithGrades.length) * 100
        ) : 0;

    // ── Classement élèves ──
    const ranked = students
        .map(s => {
            const avg = calcStudentAverage(s.id, grades);
            const trend = calcTrend(s.id, grades);
            const absences = allAttendance.filter(
                r => r.student_id === s.id && r.status === 'ABSENT'
            ).length;
            return {
                id: s.id,
                name: `${s.first_name} ${s.name}`,
                firstName: s.first_name,
                lastName: s.name,
                phone: s.parent_phone,
                average: avg,
                trend,
                tuition_status: s.tuition_status,
                absencesTotal: absences,
            };
        })
        .sort((a, b) => b.average - a.average);

    const top5 = ranked.slice(0, 5).map((s, i) => ({ ...s, rank: i + 1 }));
    const bottom5 = [...ranked].reverse().slice(0, 5).map((s, i) => ({ ...s, rank: ranked.length - i }));

    // ── Absents aujourd'hui ──
    const absentStudentsToday = todayRecords
        .filter(r => r.status === 'ABSENT' || r.status === 'LATE')
        .map(r => {
            const s = students.find(st => st.id === r.student_id);
            return s ? {
                id: s.id,
                name: `${s.first_name} ${s.name}`,
                phone: s.parent_phone,
                status: r.status as 'ABSENT' | 'LATE',
                justified: r.status === 'EXCUSED',
            } : null;
        })
        .filter(Boolean) as { id: string; name: string; phone: string; status: 'ABSENT' | 'LATE'; justified: boolean }[];

    // Si aucune présence saisie → simuler un absent pour demo
    if (absentStudentsToday.length === 0 && students.length > 0) {
        const mockAbsent = students.find(s => s.tuition_status === 'UNPAID') ?? students[0];
        absentStudentsToday.push({
            id: mockAbsent.id,
            name: `${mockAbsent.first_name} ${mockAbsent.name}`,
            phone: mockAbsent.parent_phone,
            status: 'ABSENT',
            justified: false,
        });
    }

    // ── Élèves les plus absents (sur toute l'année) ──
    const absenceMap = new Map<string, number>();
    allAttendance
        .filter(r => r.status === 'ABSENT' && students.some(s => s.id === r.student_id))
        .forEach(r => absenceMap.set(r.student_id, (absenceMap.get(r.student_id) || 0) + 1));

    const mostAbsent = Array.from(absenceMap.entries())
        .map(([studentId, count]) => {
            const s = students.find(st => st.id === studentId)!;
            return { id: s.id, name: `${s.first_name} ${s.name}`, phone: s.parent_phone, absences: count };
        })
        .sort((a, b) => b.absences - a.absences)
        .slice(0, 5);

    // ── Impayés de la classe ──
    const unpaid = students
        .filter(s => s.tuition_status === 'UNPAID')
        .map(s => ({ id: s.id, name: `${s.first_name} ${s.name}`, phone: s.parent_phone }));

    // ── Notes par matière dans la classe ──
    const subjectMap = new Map<string, { total: number; coef: number; students: Set<string> }>();
    grades.forEach(g => {
        const prev = subjectMap.get(g.subject) || { total: 0, coef: 0, students: new Set() };
        prev.students.add(g.student_id);
        subjectMap.set(g.subject, {
            total: prev.total + g.score * g.coefficient,
            coef: prev.coef + g.coefficient,
            students: prev.students,
        });
    });
    const subjectAverages = Array.from(subjectMap.entries())
        .map(([subject, data]) => ({
            subject,
            average: data.coef > 0 ? parseFloat((data.total / data.coef).toFixed(1)) : 0,
            studentCount: data.students.size,
        }))
        .sort((a, b) => a.subject.localeCompare(b.subject));

    return {
        classId,
        className: cls.name,
        level: cls.level,
        kpis: {
            totalStudents,
            presentToday,
            absentToday,
            lateToday,
            attendanceRate,
            paid,
            unpaidCount: totalStudents - paid,
            feeRate,
            classAverage,
            successRate,
        },
        top5,
        bottom5,
        absentStudentsToday,
        mostAbsent,
        unpaid,
        subjectAverages,
        allStudents: ranked, // liste complète pour tableau de bord
    };
}


/**
 * Mock Authentication
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(500);

    // Simple mock authentication
    const user = mockUsers.find(u => u.phone === credentials.phone);

    if (!user || credentials.password !== 'password') {
        throw new Error('Invalid credentials');
    }

    return {
        user,
        token: 'mock-jwt-token-' + user.id,
    };
}

/**
 * Get current user
 */
export async function getCurrentUser(token: string): Promise<User | Parent | StudentUser | null> {
    await delay(200);
    const userId = token.replace('mock-jwt-token-', '');
    return mockUsers.find(u => u.id === userId) || null;
}

/**
 * Get all students
 */
export async function getStudents(classId?: string): Promise<Student[]> {
    await delay(300);
    if (classId) {
        return mockStudents.filter(s => s.class_id === classId);
    }
    return mockStudents;
}

/**
 * Get student by ID
 */
export async function getStudentById(id: string): Promise<Student | null> {
    await delay(200);
    return mockStudents.find(s => s.id === id) || null;
}

/**
 * Update student
 */
export async function updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    await delay(300);
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Student not found');

    mockStudents[index] = { ...mockStudents[index], ...data };
    return mockStudents[index];
}

/**
 * Get all classes
 */
export async function getClasses(): Promise<Class[]> {
    await delay(200);
    return mockClasses;
}

/**
 * Get grades for a student
 */
export async function getGradesByStudentId(studentId: string): Promise<Grade[]> {
    await delay(300);
    return mockGrades.filter(g => g.student_id === studentId);
}

/**
 * Get grades for a class and subject
 */
export async function getGradesByClassAndSubject(
    classId: string,
    subject: string
): Promise<Grade[]> {
    await delay(300);
    const studentsInClass = mockStudents.filter(s => s.class_id === classId);
    const studentIds = studentsInClass.map(s => s.id);

    return mockGrades.filter(g => studentIds.includes(g.student_id) && g.subject === subject);
}

/**
 * Create or update grade
 */
export async function upsertGrade(grade: Grade): Promise<Grade> {
    await delay(300);
    const index = mockGrades.findIndex(g => g.id === grade.id);

    if (index >= 0) {
        mockGrades[index] = grade;
    } else {
        mockGrades.push(grade);
    }

    return grade;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
    totalStudents: number;
    paidPercentage: number;
    unpaidCount: number;
}> {
    await delay(300);

    const totalStudents = mockStudents.length;
    const paidCount = mockStudents.filter(s => s.tuition_status === 'PAID').length;
    const paidPercentage = (paidCount / totalStudents) * 100;
    const unpaidCount = totalStudents - paidCount;

    return {
        totalStudents,
        paidPercentage: Math.round(paidPercentage),
        unpaidCount,
    };
}

/**
 * Send SMS reminder (simulated)
 */
export async function sendSMSReminder(studentId: string): Promise<boolean> {
    await delay(500);
    console.log(`📱 SMS sent to parent of student ${studentId}: "Rappel: Veuillez régulariser la scolarité de votre enfant."`);
    return true;
}

/**
 * Mark tuition as paid
 */
export async function markTuitionPaid(studentId: string): Promise<Student> {
    await delay(300);
    return updateStudent(studentId, { tuition_status: 'PAID' });
}

// ============ SCHEDULE (EMPLOI DU TEMPS) API ============

/**
 * Get schedule for a class
 */
export async function getScheduleByClass(classId: string): Promise<Schedule[]> {
    await delay(300);
    return mockSchedules.filter(s => s.class_id === classId);
}

/**
 * Get schedule for a teacher (all their courses)
 */
export async function getScheduleByTeacher(teacherId: string): Promise<Schedule[]> {
    await delay(300);
    return mockSchedules.filter(s => s.teacher_id === teacherId);
}

/**
 * Get all schedules (for admin)
 */
export async function getAllSchedules(): Promise<Schedule[]> {
    await delay(300);
    return mockSchedules;
}

/**
 * Create schedule
 */
export async function createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    await delay(300);
    const newSchedule: Schedule = {
        ...schedule,
        id: `sch${mockSchedules.length + 1}`,
    };
    mockSchedules.push(newSchedule);
    return newSchedule;
}

/**
 * Update schedule
 */
export async function updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
    await delay(300);
    const index = mockSchedules.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Schedule not found');

    mockSchedules[index] = { ...mockSchedules[index], ...data };
    return mockSchedules[index];
}

/**
 * Delete schedule
 */
export async function deleteSchedule(id: string): Promise<boolean> {
    await delay(300);
    const index = mockSchedules.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Schedule not found');

    mockSchedules.splice(index, 1);
    return true;
}

// ============ PARENT PORTAL API ============

/**
 * Get children for a parent
 */
export async function getChildrenByParent(parentId: string): Promise<Student[]> {
    await delay(300);
    const parent = mockUsers.find(u => u.id === parentId && u.role === 'PARENT') as Parent | undefined;
    if (!parent) throw new Error('Parent not found');

    return mockStudents.filter(s => parent.children.includes(s.id));
}

/**
 * Get students by class
 */
export async function getStudentsByClass(classId: string): Promise<Student[]> {
    await delay(200);
    return mockStudents.filter(student => student.class_id === classId);
}

/**
 * Get student statistics (averages, etc.)
 */
export async function getStudentStats(studentId: string): Promise<{
    overall_average: number;
    subject_averages: { subject: string; average: number; coefficient: number }[];
    total_grades: number;
}> {
    await delay(300);
    const grades = mockGrades.filter(g => g.student_id === studentId);

    if (grades.length === 0) {
        return {
            overall_average: 0,
            subject_averages: [],
            total_grades: 0,
        };
    }

    // Calculate subject averages
    const subjectMap = new Map<string, { total: number; totalCoef: number; coefficient: number }>();

    grades.forEach(grade => {
        const existing = subjectMap.get(grade.subject) || { total: 0, totalCoef: 0, coefficient: grade.coefficient };
        existing.total += grade.score * grade.coefficient;
        existing.totalCoef += grade.coefficient;
        subjectMap.set(grade.subject, existing);
    });

    const subject_averages = Array.from(subjectMap.entries()).map(([subject, data]) => ({
        subject,
        average: parseFloat((data.total / data.totalCoef).toFixed(2)),
        coefficient: data.coefficient,
    }));

    // Calculate overall average
    let totalWeighted = 0;
    let totalCoef = 0;
    subject_averages.forEach(subj => {
        totalWeighted += subj.average * subj.coefficient;
        totalCoef += subj.coefficient;
    });

    const overall_average = totalCoef > 0 ? parseFloat((totalWeighted / totalCoef).toFixed(2)) : 0;

    return {
        overall_average,
        subject_averages,
        total_grades: grades.length,
    };
}

/**
 * Get schedule for a student (via their class)
 */
export async function getScheduleByStudent(studentId: string): Promise<Schedule[]> {
    await delay(300);
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');

    return mockSchedules.filter(s => s.class_id === student.class_id);
}

// ============ BULLETIN API ============

/**
 * Get school information for bulletin header
 */
export async function getSchoolInfo(): Promise<import('../../types').SchoolInfo> {
    await delay(200);
    return {
        name: 'École Privée Faso Excellence',
        address: 'Secteur 15, Ouagadougou, Burkina Faso',
        phone: '+226 25 36 48 92',
    };
}

/**
 * Get all bulletin data for a student and trimester
 */
export async function getBulletinData(
    studentId: string,
    trimester: number
): Promise<import('../../types').BulletinData> {
    await delay(300);

    const student = mockStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const grades = mockGrades.filter(g =>
        g.student_id === studentId && g.trimester === trimester
    );

    const stats = await getStudentStats(studentId);
    const rankInfo = await getStudentRank(studentId, student.class_id);

    return {
        student,
        trimester,
        schoolYear: '2024/2025',
        grades,
        stats: {
            ...stats,
            ...rankInfo,
        },
        observations: undefined, // Can be customized later
    };
}

/**
 * Calculate student rank in their class
 */
export async function getStudentRank(
    studentId: string,
    classId: string
): Promise<{ rank: number; total_students: number }> {
    await delay(200);

    // Get all students in the class
    const studentsInClass = mockStudents.filter(s => s.class_id === classId);

    // Calculate averages for all students
    const studentAverages = await Promise.all(
        studentsInClass.map(async (s) => {
            const stats = await getStudentStats(s.id);
            return {
                studentId: s.id,
                average: stats.overall_average,
            };
        })
    );

    // Sort by average descending
    studentAverages.sort((a, b) => b.average - a.average);

    // Find rank
    const rank = studentAverages.findIndex(s => s.studentId === studentId) + 1;

    return {
        rank: rank || 1,
        total_students: studentsInClass.length,
    };
}

// ============ ATTENDANCE API ============

const ATTENDANCE_STORAGE_KEY = 'faso_ent_attendance';

export async function markAttendance(records: Omit<AttendanceRecord, 'id' | 'timestamp'>[]): Promise<void> {
    await delay(300);

    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    const allAttendance: AttendanceRecord[] = stored ? JSON.parse(stored) : [];

    const newRecords: AttendanceRecord[] = records.map(record => ({
        ...record,
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
    }));

    allAttendance.push(...newRecords);
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(allAttendance));

    // Auto-notify parents for absences
    const { createNotification } = await import('./notificationApi');
    for (const record of newRecords) {
        if (record.status === 'ABSENT') {
            const student = mockStudents.find(s => s.id === record.student_id);
            if (student) {
                // Find parent by phone number
                const parent = mockUsers.find(u => u.role === 'PARENT' && u.phone === student.parent_phone);
                if (parent) {
                    await createNotification({
                        type: 'ANNOUNCEMENT',
                        title: 'Absence signalée',
                        message: `${record.student_name} était absent(e) en ${record.course} le ${record.date}${record.notes ? ` - ${record.notes}` : ''}`,
                        userId: parent.id,
                        actionUrl: `/parent/children`,
                    });
                }
            }
        }
    }
}

export async function getAttendanceForStudent(studentId: string): Promise<AttendanceRecord[]> {
    await delay(200);
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    const allAttendance: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
    return allAttendance.filter(record => record.student_id === studentId).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAttendanceStats(studentId: string): Promise<AttendanceStats> {
    await delay(200);
    const records = await getAttendanceForStudent(studentId);
    const stats = {
        present_days: records.filter(r => r.status === 'PRESENT').length,
        absent_days: records.filter(r => r.status === 'ABSENT').length,
        late_days: records.filter(r => r.status === 'LATE').length,
        excused_days: records.filter(r => r.status === 'EXCUSED').length,
    };
    const total_days = records.length;
    const attendance_rate = total_days > 0 ? (stats.present_days / total_days) * 100 : 100;
    return {
        student_id: studentId,
        total_days,
        ...stats,
        attendance_rate: Math.round(attendance_rate * 10) / 10,
    };
}

// ============ COCKPIT DIRECTION API ============

/**
 * KPIs globaux pour le pilotage direction
 */
export async function getAdminPilotageStats(period: 'today' | '7days' | 'month' | 'trimester' = 'today'): Promise<{
    totalStudents: number;
    newEnrollments: number;
    paidPercentage: number;
    unpaidCount: number;
    attendanceRate: number;
    absentToday: number;
    lateToday: number;
    unreadMessages: number;
    classesByLevel: { level: string; count: number }[];
}> {
    await delay(300);

    const totalStudents = mockStudents.length;
    const paidCount = mockStudents.filter(s => s.tuition_status === 'PAID').length;
    const paidPercentage = Math.round((paidCount / totalStudents) * 100);
    const unpaidCount = totalStudents - paidCount;

    // Read attendance from localStorage
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    const allAttendance: AttendanceRecord[] = stored ? JSON.parse(stored) : [];
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = allAttendance.filter(r => r.date === today);
    const absentToday = todayRecords.filter(r => r.status === 'ABSENT').length;
    const lateToday = todayRecords.filter(r => r.status === 'LATE').length;

    // Attendance rate based on last 30 days
    const recentRecords = allAttendance.slice(-100);
    const presentCount = recentRecords.filter(r => r.status === 'PRESENT').length;
    const attendanceRate = recentRecords.length > 0
        ? Math.round((presentCount / recentRecords.length) * 100)
        : 92; // Default mock value

    // Unread messages from localStorage
    const messagesStored = localStorage.getItem('faso_ent_messages');
    const messages = messagesStored ? JSON.parse(messagesStored) : [];
    const unreadMessages = messages.filter((m: any) => !m.read && m.recipient_role === 'ADMIN').length;

    // Classes by level
    const levelMap = new Map<string, number>();
    mockStudents.forEach(s => {
        const cls = mockClasses.find(c => c.id === s.class_id);
        if (cls) {
            levelMap.set(cls.level, (levelMap.get(cls.level) || 0) + 1);
        }
    });
    const classesByLevel = Array.from(levelMap.entries()).map(([level, count]) => ({ level, count }));

    return {
        totalStudents,
        newEnrollments: period === 'today' ? 0 : period === '7days' ? 1 : 2,
        paidPercentage,
        unpaidCount,
        attendanceRate,
        absentToday,
        lateToday,
        unreadMessages: unreadMessages || Math.floor(Math.random() * 5), // fallback mock
        classesByLevel,
    };
}

/**
 * Alertes prioritaires pour le direction
 */
export async function getDirectionAlerts(): Promise<{
    id: string;
    type: 'FINANCE' | 'ABSENCE' | 'PEDAGOGY' | 'RH';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    count?: number;
    actionUrl?: string;
}[]> {
    await delay(200);

    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    const allAttendance: AttendanceRecord[] = stored ? JSON.parse(stored) : [];

    // Count repeat absences (student with 2+ absences)
    const absentMap = new Map<string, number>();
    allAttendance.filter(r => r.status === 'ABSENT').forEach(r => {
        absentMap.set(r.student_id, (absentMap.get(r.student_id) || 0) + 1);
    });
    const repeatAbsences = Array.from(absentMap.values()).filter(v => v >= 2).length;

    const unpaidStudents = mockStudents.filter(s => s.tuition_status === 'UNPAID');

    const alerts = [];

    if (unpaidStudents.length > 0) {
        alerts.push({
            id: 'alert-finance-1',
            type: 'FINANCE' as const,
            severity: unpaidStudents.length > 3 ? 'HIGH' as const : 'MEDIUM' as const,
            title: 'Impayés scolarité',
            description: `${unpaidStudents.length} élève(s) ont des frais de scolarité en attente`,
            count: unpaidStudents.length,
            actionUrl: '/admin/finances',
        });
    }

    if (repeatAbsences > 0) {
        alerts.push({
            id: 'alert-absence-1',
            type: 'ABSENCE' as const,
            severity: 'MEDIUM' as const,
            title: 'Absences répétées',
            description: `${repeatAbsences} élève(s) cumulent 2+ absences sans justification`,
            count: repeatAbsences,
            actionUrl: '/admin/students',
        });
    }

    // Static mock alerts for pedagogy and RH
    alerts.push({
        id: 'alert-pedagogy-1',
        type: 'PEDAGOGY' as const,
        severity: 'LOW' as const,
        title: 'Évaluations en attente',
        description: '3 compositions du T1 non encore saisies dans le système',
        count: 3,
        actionUrl: '/admin/students',
    });

    return alerts;
}

/**
 * Agenda direction (7 prochains jours)
 */
export async function getDirectionAgenda(): Promise<{
    id: string;
    date: string;
    title: string;
    type: 'MEETING' | 'DEADLINE' | 'EVENT';
    description?: string;
}[]> {
    await delay(200);

    const today = new Date();
    const agenda = [];

    const addDays = (d: Date, n: number) => {
        const result = new Date(d);
        result.setDate(result.getDate() + n);
        return result.toISOString().split('T')[0];
    };

    agenda.push(
        { id: 'ag1', date: addDays(today, 1), title: 'Conseil de classe 6ème A', type: 'MEETING' as const, description: 'Salle de réunion - 14h00' },
        { id: 'ag2', date: addDays(today, 2), title: 'Clôture inscriptions T2', type: 'DEADLINE' as const, description: 'Date limite paiement tranche 2' },
        { id: 'ag3', date: addDays(today, 4), title: 'Réunion parents d\'élèves', type: 'MEETING' as const, description: 'Amphi - 18h00' },
        { id: 'ag4', date: addDays(today, 5), title: 'Publication bulletins T1', type: 'DEADLINE' as const, description: 'Bulletins disponibles sur ENT' },
        { id: 'ag5', date: addDays(today, 7), title: 'Journée portes ouvertes', type: 'EVENT' as const, description: 'Accueil familles 8h-13h' },
    );

    return agenda;
}

/**
 * Finance drill-down : recouvrement par classe
 */
export async function getFinanceDrilldown(): Promise<{
    className: string;
    total: number;
    paid: number;
    unpaid: number;
    paidPct: number;
}[]> {
    await delay(200);

    return mockClasses.map(cls => {
        const classStudents = mockStudents.filter(s => s.class_id === cls.id);
        const paid = classStudents.filter(s => s.tuition_status === 'PAID').length;
        const total = classStudents.length;
        return {
            className: cls.name,
            total,
            paid,
            unpaid: total - paid,
            paidPct: total > 0 ? Math.round((paid / total) * 100) : 0,
        };
    });
}

/**
 * Pédagogie drill-down : moyenne par classe
 */
export async function getPedagogyDrilldown(): Promise<{
    className: string;
    average: number;
    studentsCount: number;
    evalCount: number;
}[]> {
    await delay(300);

    return Promise.all(mockClasses.map(async cls => {
        const classStudents = mockStudents.filter(s => s.class_id === cls.id);
        const allGrades = mockGrades.filter(g => classStudents.some(s => s.id === g.student_id));

        let weightedSum = 0;
        let totalCoef = 0;
        allGrades.forEach(g => {
            weightedSum += g.score * g.coefficient;
            totalCoef += g.coefficient;
        });

        return {
            className: cls.name,
            average: totalCoef > 0 ? parseFloat((weightedSum / totalCoef).toFixed(1)) : 0,
            studentsCount: classStudents.length,
            evalCount: allGrades.length,
        };
    }));
}

// ============ ANALYTICS AVANCÉES DIRECTION ============

/**
 * Taux de réussite par classe, par matière et par trimestre
 * Seuil de réussite = note >= 10/20
 */
export async function getSuccessRateByClassAndSubject(): Promise<{
    className: string;
    bySubject: {
        subject: string;
        byTrimester: {
            trimester: number;
            average: number;
            successRate: number; // % d'élèves >= 10
            studentCount: number;
        }[];
        annualAverage: number;
        annualSuccessRate: number;
    }[];
}[]> {
    await delay(300);

    return mockClasses.map(cls => {
        const classStudents = mockStudents.filter(s => s.class_id === cls.id);
        const classGrades = mockGrades.filter(g => classStudents.some(s => s.id === g.student_id));

        // Get unique subjects for this class
        const subjects = [...new Set(classGrades.map(g => g.subject))];

        const bySubject = subjects.map(subject => {
            const subjectGrades = classGrades.filter(g => g.subject === subject);
            const trimesters = [1, 2, 3];

            const byTrimester = trimesters.map(t => {
                const tGrades = subjectGrades.filter(g => g.trimester === t);

                // Group by student for this trimester/subject
                const studentMap = new Map<string, { total: number; coef: number }>();
                tGrades.forEach(g => {
                    const prev = studentMap.get(g.student_id) || { total: 0, coef: 0 };
                    studentMap.set(g.student_id, {
                        total: prev.total + g.score * g.coefficient,
                        coef: prev.coef + g.coefficient,
                    });
                });

                const studentAverages = Array.from(studentMap.values())
                    .filter(v => v.coef > 0)
                    .map(v => v.total / v.coef);

                const average = studentAverages.length > 0
                    ? parseFloat((studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length).toFixed(1))
                    : 0;

                const successRate = studentAverages.length > 0
                    ? Math.round((studentAverages.filter(a => a >= 10).length / studentAverages.length) * 100)
                    : 0;

                return { trimester: t, average, successRate, studentCount: studentAverages.length };
            }).filter(t => t.studentCount > 0);

            // Annual averages
            const allStudentMaps = new Map<string, { total: number; coef: number }>();
            subjectGrades.forEach(g => {
                const prev = allStudentMaps.get(g.student_id) || { total: 0, coef: 0 };
                allStudentMaps.set(g.student_id, {
                    total: prev.total + g.score * g.coefficient,
                    coef: prev.coef + g.coefficient,
                });
            });
            const annualAverages = Array.from(allStudentMaps.values())
                .filter(v => v.coef > 0)
                .map(v => v.total / v.coef);

            const annualAverage = annualAverages.length > 0
                ? parseFloat((annualAverages.reduce((a, b) => a + b, 0) / annualAverages.length).toFixed(1))
                : 0;
            const annualSuccessRate = annualAverages.length > 0
                ? Math.round((annualAverages.filter(a => a >= 10).length / annualAverages.length) * 100)
                : 0;

            return { subject, byTrimester, annualAverage, annualSuccessRate };
        });

        return { className: cls.name, bySubject };
    });
}

/**
 * Taux de réussite aux examens nationaux (Brevet / BAC)
 * Données mock simulées
 */
export async function getNationalExamResults(): Promise<{
    exam: 'BEPC' | 'BAC';
    label: string;
    year: string;
    passedCount: number;
    totalCount: number;
    successRate: number;
    mention: {
        label: string;
        count: number;
        pct: number;
        color: string;
    }[];
    nationalAverage: number; // taux national pour comparaison
}[]> {
    await delay(200);

    return [
        {
            exam: 'BEPC',
            label: 'Brevet (BEPC)',
            year: '2023/2024',
            passedCount: 18,
            totalCount: 22,
            successRate: 82,
            mention: [
                { label: 'Très Bien', count: 4, pct: 22, color: 'text-emerald-400' },
                { label: 'Bien', count: 6, pct: 33, color: 'text-sky-400' },
                { label: 'Assez Bien', count: 5, pct: 28, color: 'text-blue-400' },
                { label: 'Passable', count: 3, pct: 17, color: 'text-amber-400' },
            ],
            nationalAverage: 68,
        },
        {
            exam: 'BAC',
            label: 'Baccalauréat',
            year: '2023/2024',
            passedCount: 14,
            totalCount: 17,
            successRate: 82,
            mention: [
                { label: 'Très Bien', count: 2, pct: 14, color: 'text-emerald-400' },
                { label: 'Bien', count: 5, pct: 36, color: 'text-sky-400' },
                { label: 'Assez Bien', count: 4, pct: 29, color: 'text-blue-400' },
                { label: 'Passable', count: 3, pct: 21, color: 'text-amber-400' },
            ],
            nationalAverage: 55,
        },
    ];
}

/**
 * Taux d'absence par classe (depuis localStorage + mock)
 */
export async function getAbsenceRateByClass(): Promise<{
    className: string;
    classId: string;
    totalSessions: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    absenceRate: number;
    studentsWithRepeatAbsences: { name: string; absences: number }[];
}[]> {
    await delay(200);

    const stored = localStorage.getItem('faso_ent_attendance');
    const allAttendance: AttendanceRecord[] = stored ? JSON.parse(stored) : [];

    return mockClasses.map(cls => {
        const classStudents = mockStudents.filter(s => s.class_id === cls.id);
        const classRecords = allAttendance.filter(r =>
            classStudents.some(s => s.id === r.student_id)
        );

        const absentCount = classRecords.filter(r => r.status === 'ABSENT').length;
        const lateCount = classRecords.filter(r => r.status === 'LATE').length;
        const excusedCount = classRecords.filter(r => r.status === 'EXCUSED').length;
        const totalSessions = classRecords.length || (classStudents.length * 10); // fallback mock
        const absenceRate = totalSessions > 0
            ? Math.round((absentCount / totalSessions) * 100)
            : Math.floor(Math.random() * 12) + 2; // mock fallback 2-14%

        // Count absences per student
        const absenceMap = new Map<string, number>();
        classRecords.filter(r => r.status === 'ABSENT').forEach(r => {
            absenceMap.set(r.student_id, (absenceMap.get(r.student_id) || 0) + 1);
        });

        const studentsWithRepeatAbsences = Array.from(absenceMap.entries())
            .filter(([, count]) => count >= 2)
            .map(([studentId, absences]) => {
                const student = mockStudents.find(s => s.id === studentId);
                return { name: student ? `${student.first_name} ${student.name}` : studentId, absences };
            })
            .sort((a, b) => b.absences - a.absences);

        return {
            className: cls.name,
            classId: cls.id,
            totalSessions: classRecords.length || classStudents.length * 10,
            absentCount,
            lateCount,
            excusedCount,
            absenceRate,
            studentsWithRepeatAbsences,
        };
    });
}

/**
 * Top 5 et Bottom 5 élèves par classe (basé sur la moyenne pondérée globale)
 */
export async function getTopBottomStudentsByClass(): Promise<{
    className: string;
    classId: string;
    top5: { rank: number; name: string; average: number; trend: 'up' | 'down' | 'stable' }[];
    bottom5: { rank: number; name: string; average: number; trend: 'up' | 'down' | 'stable' }[];
}[]> {
    await delay(300);

    const results = [];

    for (const cls of mockClasses) {
        const classStudents = mockStudents.filter(s => s.class_id === cls.id);

        // Calculate average for each student
        const studentAverages = classStudents.map(student => {
            const grades = mockGrades.filter(g => g.student_id === student.id);
            let weightedSum = 0;
            let totalCoef = 0;
            grades.forEach(g => {
                weightedSum += g.score * g.coefficient;
                totalCoef += g.coefficient;
            });
            const average = totalCoef > 0 ? parseFloat((weightedSum / totalCoef).toFixed(1)) : 0;

            // Trend: compare T1 vs T3
            const t1Grades = grades.filter(g => g.trimester === 1);
            const t3Grades = grades.filter(g => g.trimester === 3);
            let t1Avg = 0, t3Avg = 0;
            if (t1Grades.length > 0) {
                const t1W = t1Grades.reduce((a, g) => a + g.score * g.coefficient, 0);
                const t1C = t1Grades.reduce((a, g) => a + g.coefficient, 0);
                t1Avg = t1C > 0 ? t1W / t1C : 0;
            }
            if (t3Grades.length > 0) {
                const t3W = t3Grades.reduce((a, g) => a + g.score * g.coefficient, 0);
                const t3C = t3Grades.reduce((a, g) => a + g.coefficient, 0);
                t3Avg = t3C > 0 ? t3W / t3C : 0;
            }
            const trend: 'up' | 'down' | 'stable' = t3Avg > t1Avg + 0.5 ? 'up' : t3Avg < t1Avg - 0.5 ? 'down' : 'stable';

            return {
                name: `${student.first_name} ${student.name}`,
                average,
                trend,
            };
        }).sort((a, b) => b.average - a.average);

        const ranked = studentAverages.map((s, i) => ({ rank: i + 1, ...s }));

        results.push({
            className: cls.name,
            classId: cls.id,
            top5: ranked.slice(0, 5),
            bottom5: ranked.slice(-5).reverse().map((s, i) => ({ ...s, rank: ranked.length - i })),
        });
    }

    return results;
}

