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

let mockClasses: Class[] = [
    { id: 'c1', name: '6ème A', level: 'Collège' },
    { id: 'c2', name: '5ème B', level: 'Collège' },
    { id: 'c3', name: 'CM2 A', level: 'Primaire' },
];

let mockStudents: Student[] = [
    {
        id: 's1',
        name: 'Ouédraogo',
        first_name: 'Aminata',
        class_id: 'c1',
        class_name: '6ème A',
        parent_phone: '+22678901234',
        tuition_status: 'PAID',
    },
    {
        id: 's2',
        name: 'Ouédraogo',
        first_name: 'Ibrahim',
        class_id: 'c2',
        class_name: '5ème B',
        parent_phone: '+22678901234', // Same parent as s1
        tuition_status: 'UNPAID',
    },
    {
        id: 's3',
        name: 'Sawadogo',
        first_name: 'Fatoumata',
        class_id: 'c2',
        class_name: '5ème B',
        parent_phone: '+22678901235',
        tuition_status: 'PAID',
    },
    {
        id: 's4',
        name: 'Traoré',
        first_name: 'Moussa',
        class_id: 'c1',
        class_name: '6ème A',
        parent_phone: '+22670444444',
        tuition_status: 'UNPAID',
    },
    {
        id: 's5',
        name: 'Zerbo',
        first_name: 'Aïcha',
        class_id: 'c3',
        class_name: 'CM2 A',
        parent_phone: '+22670555555',
        tuition_status: 'PAID',
    },
];

let mockSchedules: Schedule[] = [
    // Prof. Kaboré (id: 2) - SEULEMENT Mathématiques & Physique - 6ème A
    { id: 'sch1', class_id: 'c1', day: 'lundi', start_time: '08:00', end_time: '10:00', subject: 'Mathématiques', teacher_id: '2', teacher_name: 'Prof. Kaboré', room: 'Salle 101' },
    { id: 'sch6', class_id: 'c1', day: 'mercredi', start_time: '08:00', end_time: '10:00', subject: 'Mathématiques', teacher_id: '2', teacher_name: 'Prof. Kaboré', room: 'Salle 101' },
    { id: 'sch10', class_id: 'c1', day: 'jeudi', start_time: '14:00', end_time: '16:00', subject: 'Physique', teacher_id: '2', teacher_name: 'Prof. Kaboré', room: 'Labo' },

    // Prof. Sawadogo (id: 3) - Français, Anglais, Histoire-Géo - 5ème B
    { id: 'sch8', class_id: 'c2', day: 'lundi', start_time: '08:00', end_time: '10:00', subject: 'Français', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 201' },
    { id: 'sch3', class_id: 'c2', day: 'lundi', start_time: '14:00', end_time: '16:00', subject: 'Anglais', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 202' },
    { id: 'sch4', class_id: 'c2', day: 'mardi', start_time: '08:00', end_time: '10:00', subject: 'Histoire-Géographie', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 201' },
    { id: 'sch11', class_id: 'c2', day: 'mercredi', start_time: '14:00', end_time: '16:00', subject: 'Français', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 201' },
    { id: 'sch12', class_id: 'c2', day: 'jeudi', start_time: '08:00', end_time: '10:00', subject: 'Anglais', teacher_id: '3', teacher_name: 'Prof. Sawadogo', room: 'Salle 202' },

    // Autres profs pour remplir emploi du temps (optionnel)
    { id: 'sch2', class_id: 'c1', day: 'lundi', start_time: '10:00', end_time: '12:00', subject: 'Français', teacher_id: '99', teacher_name: 'Prof. Diallo', room: 'Salle 101' },
    { id: 'sch5', class_id: 'c1', day: 'mardi', start_time: '10:00', end_time: '12:00', subject: 'SVT', teacher_id: '99', teacher_name: 'Prof. Diallo', room: 'Labo' },
    { id: 'sch7', class_id: 'c1', day: 'mercredi', start_time: '10:00', end_time: '12:00', subject: 'EPS', teacher_id: '99', teacher_name: 'Prof. Diallo', room: 'Terrain' },
    { id: 'sch9', class_id: 'c2', day: 'lundi', start_time: '10:00', end_time: '12:00', subject: 'Mathématiques', teacher_id: '99', teacher_name: 'Prof. Diallo', room: 'Salle 201' },
];

let mockGrades: Grade[] = [
    // Aminata (s1) - 6ème A - Good student
    { id: 'g1', student_id: 's1', subject: 'Mathématiques', score: 16, coefficient: 3, evaluation_type: 'devoir', trimester: 1, date: '2024-10-15', synced: true, sync_status: 'synced' },
    { id: 'g2', student_id: 's1', subject: 'Mathématiques', score: 18, coefficient: 4, evaluation_type: 'composition', trimester: 1, date: '2024-11-20', synced: true, sync_status: 'synced' },
    { id: 'g3', student_id: 's1', subject: 'Français', score: 15, coefficient: 3, evaluation_type: 'devoir', trimester: 1, date: '2024-10-18', synced: true, sync_status: 'synced' },
    { id: 'g4', student_id: 's1', subject: 'Français', score: 17, coefficient: 4, evaluation_type: 'composition', trimester: 1, date: '2024-11-22', synced: true, sync_status: 'synced' },
    { id: 'g5', student_id: 's1', subject: 'Anglais', score: 14, coefficient: 2, evaluation_type: 'devoir', trimester: 1, date: '2024-10-20', synced: true, sync_status: 'synced' },

    // Ibrahim (s2) - 5ème B - Average student
    { id: 'g6', student_id: 's2', subject: 'Mathématiques', score: 12, coefficient: 3, evaluation_type: 'devoir', trimester: 1, date: '2024-10-15', synced: true, sync_status: 'synced' },
    { id: 'g7', student_id: 's2', subject: 'Français', score: 11, coefficient: 3, evaluation_type: 'devoir', trimester: 1, date: '2024-10-18', synced: true, sync_status: 'synced' },
    { id: 'g8', student_id: 's2', subject: 'Anglais', score: 13, coefficient: 2, evaluation_type: 'devoir', trimester: 1, date: '2024-10-20', synced: true, sync_status: 'synced' },

    // Fatoumata (s3) - 5ème B - Excellent student
    { id: 'g9', student_id: 's3', subject: 'Mathématiques', score: 19, coefficient: 3, evaluation_type: 'devoir', trimester: 1, date: '2024-10-15', synced: true, sync_status: 'synced' },
    { id: 'g10', student_id: 's3', subject: 'Français', score: 18, coefficient: 3, evaluation_type: 'devoir', trimester: 1, date: '2024-10-18', synced: true, sync_status: 'synced' },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
