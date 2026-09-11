import React from 'react';
import { X, User, LogOut, Globe, ShieldCheck, MapPin, Phone, Building2, Mail, Key } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Language } from '../../types';
import { translations } from '../../data/translations';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout, language, setLanguage } = useReferralStore();
  const t = translations[language];

  if (!isOpen || !currentUser) return null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full text-slate-900 shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold text-base flex items-center justify-center shadow-inner">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{currentUser.name}</h3>
              <p className="text-xs text-teal-300 font-medium">{currentUser.roleTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Details */}
        <div className="p-5 space-y-4 text-xs">
          {/* Location & Contact Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Email: <strong className="font-mono text-slate-900">{currentUser.email}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                {currentUser.village ? `${currentUser.village}, ` : ''}
                {currentUser.facility ? `${currentUser.facility}, ` : ''}
                {currentUser.block ? `${currentUser.block} Block, ` : ''}
                {currentUser.district}
              </span>
            </div>
            {currentUser.phone && (
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="font-mono">{currentUser.phone}</span>
              </div>
            )}
            {currentUser.abhaId && (
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>ABHA ID: <strong className="font-mono">{currentUser.abhaId}</strong></span>
              </div>
            )}
          </div>

          {/* Role Permissions */}
          {currentUser.permissions && currentUser.permissions.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                <Key className="w-4 h-4 text-teal-700" />
                <span>Authorized Role Permissions:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.permissions.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200/80 text-[10px] text-teal-800 font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Language Preference Settings */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
              <Globe className="w-4 h-4 text-teal-700" />
              <span>Preferred Language (भाषा प्राधान्य):</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'en', label: 'English' },
                { id: 'mr', label: 'मराठी' },
                { id: 'hi', label: 'हिंदी' }
              ].map(l => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id as Language)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    language === l.id
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl text-[11px] text-teal-900 leading-relaxed">
            <p>
              🔒 <strong>Fixed Account Session</strong>: To test a different healthcare worker or administrator persona for the Smart India Hackathon demo, please sign out and pick the corresponding demo account on the login page.
            </p>
          </div>

          {/* Logout Action Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
