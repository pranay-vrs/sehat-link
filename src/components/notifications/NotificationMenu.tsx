import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Bell, X } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

interface NotificationMenuProps {
  onClose: () => void;
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({ onClose }) => {
  const { getScopedNotifications, markNotificationRead, selectReferral, language } = useReferralStore();
  const t = translations[language];
  const notifications = getScopedNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{t.notificationsFeed}</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-500 p-4 text-center">{t.noNotifications}</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.referralId) selectReferral(notif.referralId);
                onClose();
              }}
              className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                notif.isRead ? 'opacity-70' : 'bg-teal-50/30'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {notif.type === 'at_risk' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : notif.type === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{notif.title}</p>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{notif.message}</p>
                  {notif.referralId && (
                    <span className="inline-block mt-1 font-mono text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded font-bold">
                      #{notif.referralId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
