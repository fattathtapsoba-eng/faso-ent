// ============ USER & AUTH ============

export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
export type TuitionStatus = 'PAID' | 'UNPAID';
export type EvaluationType = 'Devoir' | 'Compo';
export type SyncStatus = 'synced' | 'pending' | 'error';
export type DayOfWeek = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi';

// ============ SCHOOL YEAR (ANNÉE SCOLAIRE) ============

export interface SchoolYear {
    id: string;           // ex: "2024-2025"
    label: string;        // ex: "Année scolaire 2024-2025"
    start_date: string;   // ex: "2024-10-01"
    end_date: string;     // ex: "2025-07-31"
    is_active: boolean;   // Une seule active à la fois
    is_closed: boolean;   // Lecture seule après clôture de fin d'année
}


// Base User entity
export interface User {
    id: string;
    role: UserRole;
    name: string;
    phone: string;
    created_at?: string;

    // TEACHER-specific fields for personalization
    assigned_classes?: string[];      // IDs des classes assignées (ex: ['c1', 'c2'])
    subjects?: string[];              // Matières enseignées
    is_main_teacher?: boolean;        // Est professeur principal?
    main_class_id?: string;          // Classe principale si prof principal
}

// Parent user type
export interface Parent extends User {
    role: 'PARENT';
    children: string[]; // IDs des élèves
}

// Student user type (compte de connexion pour l'élève)
export interface StudentUser extends User {
    role: 'STUDENT';
    student_id: string; // Lien vers Student entity
}

// ============ PAYMENTS ============

export type PaymentCategory =
    | 'TUITION'           // Scolarité
    | 'CANTEEN'           // Cantine
    | 'TRANSPORT'         // Transport
    | 'ACTIVITIES'        // Activités culturelles
    | 'LIBRARY'           // Bibliothèque
    | 'TRIPS'             // Sorties scolaires
    | 'PARKING'           // Parking
    | 'SNACK'             // Goûter
    | 'UNIFORM'           // Uniforme
    | 'BOOKS';            // Manuels scolaires

export type PaymentMethod = 'MOBILE_MONEY' | 'CASH' | 'BANK';
export type MobileMoneyProvider = 'ORANGE_MONEY' | 'MOOV_MONEY' | 'CORIS_MONEY';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface Payment {
    id: string;
    student_id: string;
    student_name?: string;
    category: PaymentCategory;
    amount: number;
    status: PaymentStatus;
    payment_method?: PaymentMethod;
    provider?: MobileMoneyProvider;
    transaction_id?: string;
    due_date?: string;
    paid_date?: string;
    created_at: string;
    updated_at?: string;
}

// ============ STUDENTS ============

export interface Student {
    id: string;
    name: string;
    first_name: string;
    class_id: string;
    class_name?: string; // Populated from join
    parent_phone: string;
    tuition_status: TuitionStatus;
    created_at?: string;
}

// ============ CLASSES ============

export interface Class {
    id: string;
    name: string; // e.g., "6ème A", "CM2 B"
    level: string; // e.g., "Collège", "Primaire"
}

// ============ GRADES ============

export interface Grade {
    id: string;
    student_id: string;
    student_name?: string; // Populated from join
    subject: string;
    score: number;
    coefficient: number;
    evaluation_id?: string;
    evaluation_type: 'devoir' | 'composition';
    trimester: 1 | 2 | 3;
    date: string;
    synced: boolean; // Offline tracking
    sync_status: SyncStatus;
    created_at?: string;
    updated_at?: string;
}

// ============ EVALUATIONS ============

export interface Evaluation {
    id: string;
    class_id: string;
    subject: string;
    type: EvaluationType;
    date: string;
    max_score: number;
    trimester: 1 | 2 | 3;
    created_at?: string;
}

// ============ SCHEDULE (EMPLOI DU TEMPS) ============

export interface Schedule {
    id: string;
    class_id: string;
    day: DayOfWeek;
    start_time: string; // "08:00"
    end_time: string;   // "10:00"
    subject: string;
    teacher_id: string;
    teacher_name?: string; // Populated from join
    room?: string;
}

// ============ SUBJECTS ============

export interface Subject {
    name: string;
    coefficient: number;
}

// ============ REPORT CARD / BULLETIN ============

export interface ReportCard {
    student_id: string;
    student_name: string;
    class_name: string;
    period: string;
    grades: Array<{
        subject: string;
        score: number;
        coefficient: number;
        weighted_score: number;
    }>;
    total_score: number;
    total_coefficient: number;
    average: number;
    rank?: number;
    total_students?: number;
    can_access: boolean; // Based on tuition_status
}

// ============ AUTH ============

export interface LoginCredentials {
    phone: string;
    password: string;
}

export interface AuthResponse {
    user: User | Parent | StudentUser;
    token: string;
}

// ============ BULLETINS ============

export interface BulletinData {
    student: Student;
    trimester: number;
    schoolYear: string;
    grades: Grade[];
    stats: {
        overall_average: number;
        subject_averages: { subject: string; average: number; coefficient: number }[];
        rank?: number;
        total_students?: number;
    };
    observations?: string;
}

export interface SchoolInfo {
    name: string;
    address?: string;
    phone?: string;
    logoUrl?: string;
}

// ============ NOTIFICATIONS & MESSAGING ============

export type NotificationType = 'NEW_GRADE' | 'PAYMENT_REMINDER' | 'ANNOUNCEMENT' | 'MESSAGE';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    userId: string; // Who should receive this
    actionUrl?: string; // Optional link to relevant page
    metadata?: any; // Additional data (grade_id, student_id, etc.)
}

export interface Message {
    id: string;
    from_user_id: string;
    from_user_name: string;
    to_user_id: string;
    to_user_name: string;
    subject: string;
    content: string;
    timestamp: number;
    read: boolean;
    parent_message_id?: string; // For replies
    audio_base64?: string; // Voice message (optional)
    audio_duration?: number; // Duration in seconds
}

export interface ConversationThread {
    id: string;
    participants: string[];
    participantNames: string[];
    last_message: Message;
    unread_count: number;
}

// ============ ATTENDANCE ============

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
    id: string;
    student_id: string;
    student_name: string;
    class_id: string;
    date: string; // YYYY-MM-DD
    course: string; // Subject name
    status: AttendanceStatus;
    notes?: string; // Optional comment
    marked_by: string; // Teacher ID
    timestamp: number;
}

export interface AttendanceStats {
    student_id: string;
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    excused_days: number;
    attendance_rate: number; // Percentage
}

// ============ API WRAPPER ============

export interface ApiResponse<T> {
    data: T;
    error?: string;
    success: boolean;
}

// ============ SYNC ============

export interface SyncQueueItem {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: 'grade' | 'student' | 'evaluation';
    data: any;
    timestamp: number;
    retries: number;
}
