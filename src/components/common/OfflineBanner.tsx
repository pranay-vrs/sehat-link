import React, { useState } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

export const OfflineBanner: React.FC = () => {
  const { isOffline, syncQueue, toggleOffline, syncPendingActions, language } = useReferralStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const t = translations[language];

  if (!isOffline && syncQueue.length === 0) return null;

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      syncPendingActions();
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className={`w-full px-4 py-2.5 text-xs transition-colors ${
      isOffline ? 'bg-amber-600 text-white' : 'bg-teal-700 text-white'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 animate-pulse text-amber-200" />
              <span>{t.offline}: {t.offlineNotice}</span>
              {syncQueue.length > 0 && (
                <span className="bg-amber-800 text-amber-100 px-2 py-0.5 rounded-full font-bold ml-1">
                  {syncQueue.length} {t.waitingToSync}
                </span>
              )}
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-teal-200" />
              <span>Reconnected online. {syncQueue.length} local actions ready for reconciliation.</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOffline ? (
            <button
              onClick={toggleOffline}
              className="px-2.5 py-1 bg-white text-amber-900 rounded font-semibold hover:bg-amber-50 active:scale-95 transition-transform"
            >
              Simulate Network Reconnect
            </button>
          ) : (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-teal-900 rounded font-semibold hover:bg-teal-50 active:scale-95 transition-transform disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
