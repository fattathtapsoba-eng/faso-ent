import { CloudOff, Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { syncService } from '../../services/sync/syncService';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export function SyncIndicator() {
    const isOnline = useNetworkStatus();
    const [syncStatus, setSyncStatus] = useState<{
        hasUnsyncedData: boolean;
        unsyncedCount: number;
    }>({ hasUnsyncedData: false, unsyncedCount: 0 });
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        void loadSyncStatus();

        // Listen for sync events
        const unsubscribe = syncService.onSync(() => {
            void loadSyncStatus();
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Auto-sync when coming back online
        if (isOnline && syncStatus.hasUnsyncedData && !isSyncing) {
            void handleSync();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline]);

    async function loadSyncStatus() {
        const status = await syncService.getSyncStatus();
        setSyncStatus(status);
    }

    async function handleSync() {
        setIsSyncing(true);
        await syncService.syncAll();
        await loadSyncStatus();
        setIsSyncing(false);
    }

    if (isSyncing) {
        return (
            <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synchronisation...</span>
            </div>
        );
    }

    if (!isOnline || syncStatus.hasUnsyncedData) {
        return (
            <div className="flex items-center gap-2 text-sm text-orange-600">
                <CloudOff className="h-4 w-4" />
                <span>
                    {!isOnline ? 'Hors ligne' : `${syncStatus.unsyncedCount} non synchronisé(s)`}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            <span>Synchronisé</span>
        </div>
    );
}
