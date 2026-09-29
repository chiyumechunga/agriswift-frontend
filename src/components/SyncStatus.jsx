import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useOnline } from '../hooks/useOnline';

export const SyncStatus = () => {
    const isOnline = useOnline();
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const isSyncing = isFetching > 0 || isMutating > 0;

    if (!isOnline) {
        return (
            <div className="sync-banner offline">
                <span className="material-symbols-outlined">cloud_off</span>
                <span>Offline — Changes queued</span>
            </div>
        );
    }

    if (isSyncing) {
        return (
            <div className="sync-banner syncing">
                <div className="pulse-dot"></div>
                <span>Syncing...</span>
            </div>
        );
    }

    return null; // Hide when online and idle to save screen space
};