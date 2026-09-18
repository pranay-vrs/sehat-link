import React from 'react';
import { 
  Home, 
  Users, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  Network, 
  UserPlus,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  Stethoscope,
  HelpCircle,
  LogOut,
  FolderHeart
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewCase?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onNewCase 
}) => {
  const { currentUser, language, getScopedReferrals, logout } = useReferralStore();
  const t = translations[language];

  if (!currentUser) return null;

  const scopedReferrals = getScopedReferrals();
  const atRiskCount = scopedReferrals.filter(r => r.isAtRisk).length;
  const followUpCount = scopedReferrals.filter(r => r.status === 'followup' && !r.isFollowUpCompleted).length;
  const pendingCount = scopedReferrals.filter(r => r.status === 'created').length;
  const arrivedCount = scopedReferrals.filter(r => r.status === 'arrived').length;

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)] p-4 justify-between">
      <div className="space-y-5">
        {/* User Mini Profile Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </h4>
              <p className="text-[11px] text-teal-700 font-semibold truncate">
                {currentUser.roleTitle.split('(')[0]}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser.facility || currentUser.village || currentUser.district}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button for ASHA */}
        {currentUser.userType === 'health_worker' && currentUser.subRole !== 'medical_officer' && onNewCase && (
          <button
            onClick={onNewCase}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ {t.registerPatient}</span>
          </button>
        )}

        {/* NAVIGATION LINKS PER ROLE */}
        <nav className="space-y-1">
          {/* 1. PATIENT NAVIGATION */}
          {currentUser.userType === 'patient' && (
            <>
              <button
                onClick={() => onTabChange('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Home className="w-4 h-4 text-teal-700" />
                <span>{t.navHome}</span>
              </button>

              <button
                onClick={() => onTabChange('my_care')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'my_care'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Activity className="w-4 h-4 text-teal-700" />
                <span>{t.navMyCare}</span>
              </button>

              <button
                onClick={() => onTabChange('appointments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'appointments'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>{t.navAppointments}</span>
              </button>

              <button
                onClick={() => onTabChange('health_records')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'health_records'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <FolderHeart className="w-4 h-4 text-teal-700" />
                <span>{t.navHealthRecords}</span>
              </button>

              <button
                onClick={() => onTabChange('account')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'account' || activeTab === 'profile'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navProfile}</span>
              </button>
            </>
          )}

          {/* 2. HEALTHCARE WORKER — ASHA / ANM */}
          {currentUser.userType === 'health_worker' && currentUser.subRole !== 'medical_officer' && (
            <>
              <button
                onClick={() => onTabChange('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'home' || activeTab === 'dashboard'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Home className="w-4 h-4 text-teal-700" />
                <span>{t.todaysWork}</span>
              </button>

              <button
                onClick={() => onTabChange('patients')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'patients'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navPatients}</span>
              </button>

              <button
                onClick={() => onTabChange('referrals')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'referrals'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>{t.navReferrals}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {scopedReferrals.length}
                </span>
              </button>

              <button
                onClick={() => onTabChange('at_risk')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'at_risk'
                    ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.navAtRisk}</span>
                </div>
                {atRiskCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                    {atRiskCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('followups')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'followups'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <span>{t.navFollowups}</span>
                </div>
                {followUpCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {followUpCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('facilities')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'facilities'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>{t.navFacilities}</span>
              </button>

              <button
                onClick={() => onTabChange('account')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navAccount}</span>
              </button>
            </>
          )}

          {/* 3. HEALTHCARE WORKER — DOCTOR / MEDICAL OFFICER */}
          {currentUser.userType === 'health_worker' && currentUser.subRole === 'medical_officer' && (
            <>
              <button
                onClick={() => onTabChange('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'home' || activeTab === 'overview'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Home className="w-4 h-4 text-teal-700" />
                <span>{t.clinicOverview}</span>
              </button>

              <button
                onClick={() => onTabChange('patients')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'patients'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navPatients}</span>
              </button>

              <button
                onClick={() => onTabChange('pending_referrals')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'pending_referrals'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>{t.navPendingReferrals}</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('appointments')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'appointments'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <span>{t.arrivedPatients}</span>
                </div>
                {arrivedCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                    {arrivedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('consultations')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'consultations'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <span>{t.navConsultations}</span>
              </button>

              <button
                onClick={() => onTabChange('followups')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'followups'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>{t.navFollowups}</span>
                </div>
                {followUpCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {followUpCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('facilities')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'facilities'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>{t.navFacilities}</span>
              </button>

              <button
                onClick={() => onTabChange('account')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navAccount}</span>
              </button>
            </>
          )}

          {/* 4. ADMINISTRATOR */}
          {currentUser.userType === 'admin' && (
            <>
              <button
                onClick={() => onTabChange('home')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'home' || activeTab === 'overview'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Home className="w-4 h-4 text-teal-700" />
                <span>{t.districtOverview}</span>
              </button>

              <button
                onClick={() => onTabChange('referrals')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'referrals'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>{t.navReferrals}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {scopedReferrals.length}
                </span>
              </button>

              <button
                onClick={() => onTabChange('at_risk')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'at_risk'
                    ? 'bg-rose-50 text-rose-950 font-bold border border-rose-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t.navAtRisk}</span>
                </div>
                {atRiskCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    {atRiskCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onTabChange('facilities')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'facilities'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>{t.navFacilities}</span>
              </button>

              <button
                onClick={() => onTabChange('workers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'workers'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navWorkers}</span>
              </button>

              <button
                onClick={() => onTabChange('reports')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-teal-700" />
                <span>{t.navReports}</span>
              </button>

              <button
                onClick={() => onTabChange('interop')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'interop'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Network className="w-4 h-4 text-teal-700" />
                <span>{t.navInterop}</span>
              </button>

              <button
                onClick={() => onTabChange('account')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'account'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/60 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Users className="w-4 h-4 text-teal-700" />
                <span>{t.navAccount}</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer: Guarantee & Sign Out */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <div className="bg-teal-50 border border-teal-200/60 p-2.5 rounded-xl text-[11px] text-teal-900">
          <span className="font-bold block">{t.careGuaranteeTitle}</span>
          <span className="text-teal-700 text-[10px]">{t.careGuaranteeDesc}</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs text-rose-600 hover:bg-rose-50 border border-rose-200/60 font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};
