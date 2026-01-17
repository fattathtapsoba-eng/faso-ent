import { openDB, type IDBPDatabase } from 'idb';
import type { Grade, Student, SyncQueueItem } from '../../types';

// Simple interface without extending DBSchema to avoid type issues
interface FasoENTDB {
    grades: {
        key: string;
        value: Grade;
    };
    students: {
        key: string;
        value: Student;
    };
    syncQueue: {
        key: string;
        value: SyncQueueItem;
    };
}

const DB_NAME = 'faso-ent-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<FasoENTDB> | null = null;

/**
 * Initialize and get database instance
 */
export async function getDB(): Promise<IDBPDatabase<FasoENTDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<FasoENTDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Grades store
            if (!db.objectStoreNames.contains('grades')) {
                const gradeStore = db.createObjectStore('grades', { keyPath: 'id' });
                gradeStore.createIndex('by-student', 'student_id');
                gradeStore.createIndex('by-sync', 'synced');
            }

            // Students store
            if (!db.objectStoreNames.contains('students')) {
                db.createObjectStore('students', { keyPath: 'id' });
            }

            // Sync queue store
            if (!db.objectStoreNames.contains('syncQueue')) {
                const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
                syncStore.createIndex('by-timestamp', 'timestamp');
            }
        },
    });

    return dbInstance;
}

// ============ GRADES ============

/**
 * Save grade to IndexedDB (offline-first)
 */
export async function saveGrade(grade: Grade): Promise<void> {
    const db = await getDB();
    await db.put('grades', grade);
}

/**
 * Get all grades for a student
 */
export async function getGradesByStudent(studentId: string): Promise<Grade[]> {
    const db = await getDB();
    return db.getAllFromIndex('grades', 'by-student', studentId);
}

/**
 * Get all unsynced grades
 */
export async function getUnsyncedGrades(): Promise<Grade[]> {
    const db = await getDB();
    const allGrades = await db.getAll('grades');
    return allGrades.filter(grade => !grade.synced);
}

/**
 * Mark grade as synced
 */
export async function markGradeSynced(gradeId: string): Promise<void> {
    const db = await getDB();
    const grade = await db.get('grades', gradeId);
    if (grade) {
        grade.synced = true;
        grade.sync_status = 'synced';
        await db.put('grades', grade);
    }
}

/**
 * Delete grade
 */
export async function deleteGrade(gradeId: string): Promise<void> {
    const db = await getDB();
    await db.delete('grades', gradeId);
}

// ============ STUDENTS ============

/**
 * Save multiple students (for caching)
 */
export async function saveStudents(students: Student[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('students', 'readwrite');
    await Promise.all(students.map(student => tx.store.put(student)));
    await tx.done;
}

/**
 * Get all students from cache
 */
export async function getAllStudents(): Promise<Student[]> {
    const db = await getDB();
    return db.getAll('students');
}

/**
 * Get single student
 */
export async function getStudent(studentId: string): Promise<Student | undefined> {
    const db = await getDB();
    return db.get('students', studentId);
}

// ============ SYNC QUEUE ============

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(item: SyncQueueItem): Promise<void> {
    const db = await getDB();
    await db.put('syncQueue', item);
}

/**
 * Get all pending sync items
 */
export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
    const db = await getDB();
    return db.getAll('syncQueue');
}

/**
 * Remove item from sync queue
 */
export async function removeSyncQueueItem(itemId: string): Promise<void> {
    const db = await getDB();
    await db.delete('syncQueue', itemId);
}

/**
 * Clear all data (for logout)
 */
export async function clearAllData(): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(['grades', 'students', 'syncQueue'], 'readwrite');
    await Promise.all([
        tx.objectStore('grades').clear(),
        tx.objectStore('students').clear(),
        tx.objectStore('syncQueue').clear(),
    ]);
    await tx.done;
}
