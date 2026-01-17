import {
    getUnsyncedGrades,
    markGradeSynced,
    getPendingSyncItems,
    removeSyncQueueItem,
    addToSyncQueue,
} from '../db/indexedDB';
import type { Grade, SyncQueueItem } from '../../types';
import { generateId } from '../../utils';

/**
 * Sync service for handling offline-to-online data synchronization
 * This will use the mock API for now, can be switched to Supabase later
 */

class SyncService {
    private isSyncing = false;
    private syncListeners: Set<() => void> = new Set();

    /**
     * Add listener for sync events
     */
    onSync(callback: () => void) {
        this.syncListeners.add(callback);
        return () => {
            this.syncListeners.delete(callback);
        };
    }

    /**
     * Notify all listeners
     */
    private notifyListeners() {
        this.syncListeners.forEach(cb => cb());
    }

    /**
     * Main sync function - uploads all pending data to server
     */
    async syncAll(): Promise<{ success: boolean; errors: string[] }> {
        if (this.isSyncing) {
            return { success: false, errors: ['Sync already in progress'] };
        }

        if (!navigator.onLine) {
            return { success: false, errors: ['Device is offline'] };
        }

        this.isSyncing = true;
        const errors: string[] = [];

        try {
            // Sync unsynced grades
            await this.syncGrades();

            // Sync queue items
            await this.syncQueueItems();

            this.notifyListeners();
            return { success: true, errors };
        } catch (error) {
            errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return { success: false, errors };
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Sync all unsynced grades
     */
    private async syncGrades(): Promise<void> {
        const unsyncedGrades = await getUnsyncedGrades();

        for (const grade of unsyncedGrades) {
            try {
                // TODO: Replace with actual API call
                // For now, we'll simulate a successful sync
                await this.uploadGrade(grade);
                await markGradeSynced(grade.id);
            } catch (error) {
                console.error(`Failed to sync grade ${grade.id}:`, error);
                // Keep it in the queue for next sync attempt
            }
        }
    }

    /**
     * Upload a single grade to server
     * TODO: Implement actual API call to Supabase or backend
     */
    private async uploadGrade(grade: Grade): Promise<void> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mock successful upload
        console.log('Uploading grade to server:', grade);

        // In real implementation:
        // const response = await supabase.from('grades').upsert(grade);
        // if (response.error) throw response.error;
    }

    /**
     * Process sync queue items
     */
    private async syncQueueItems(): Promise<void> {
        const items = await getPendingSyncItems();

        for (const item of items) {
            try {
                await this.processSyncItem(item);
                await removeSyncQueueItem(item.id);
            } catch (error) {
                console.error(`Failed to process sync item ${item.id}:`, error);
                // Increment retry count
                item.retries++;
                if (item.retries > 3) {
                    console.error(`Max retries exceeded for sync item ${item.id}, removing from queue`);
                    await removeSyncQueueItem(item.id);
                }
            }
        }
    }

    /**
     * Process individual sync queue item
     */
    private async processSyncItem(item: SyncQueueItem): Promise<void> {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Processing sync item:', item);
        // TODO: Implement actual API calls based on item type
    }

    /**
     * Queue an operation for later sync
     */
    async queueOperation(
        type: 'CREATE' | 'UPDATE' | 'DELETE',
        entity: 'grade' | 'student' | 'evaluation',
        data: any
    ): Promise<void> {
        const item: SyncQueueItem = {
            id: generateId(),
            type,
            entity,
            data,
            timestamp: Date.now(),
            retries: 0,
        };

        await addToSyncQueue(item);
    }

    /**
     * Get sync status
     */
    async getSyncStatus(): Promise<{
        hasUnsyncedData: boolean;
        unsyncedCount: number;
    }> {
        const unsyncedGrades = await getUnsyncedGrades();
        const queueItems = await getPendingSyncItems();

        return {
            hasUnsyncedData: unsyncedGrades.length > 0 || queueItems.length > 0,
            unsyncedCount: unsyncedGrades.length + queueItems.length,
        };
    }
}

// Export singleton instance
export const syncService = new SyncService();
