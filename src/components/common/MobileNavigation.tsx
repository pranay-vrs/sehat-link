import React from 'react';
import { 
  Home, 
  Users, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Building2, 
  UserPlus, 
  Stethoscope, 
  FolderHeart,
  BarChart3,
  Network,
  UserCheck
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewCase?: () => void;
  onSearch?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  onNewCase 
}) => {
  const { currentUser, language, getScopedReferrals } = useReferralStore();
  const t = translations[language];

  if (!currentUser) return null;

  const scopedReferrals = getScopedReferrals();
  const atRiskCount = scopedReferrals.filter(r => r.isAtRisk).length;
  const pendingCount = scopedReferrals.filter(r => r.status === 'created').length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. PATIENT MOBILE NAV */}
        {currentUser.userType === 'patient' && (
          <>
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'home' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navHome}</span>
            </button>

            <button
              onClick={() => onTabChange('my_care')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'my_care' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navMyCare}</span>
            </button>

            <button
              onClick={() => onTabChange('appointments')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'appointments' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navAppointments}</span>
            </button>

            <button
              onClick={() => onTabChange('health_records')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'health_records' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderHeart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navHealthRecords}</span>
            </button>

            <button
              onClick={() => onTabChange('account')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'account' || activeTab === 'profile' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navProfile}</span>
            </button>
          </>
        )}

        {/* 2. ASHA / ANM MOBILE NAV */}
        {currentUser.userType === 'health_worker' && currentUser.subRole !== 'medical_officer' && (
          <>
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'home' || activeTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navHome}</span>
            </button>

            <button
              onClick={() => onTabChange('patients')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'patients' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navPatients}</span>
            </button>

            {/* Primary Center Action */}
            {onNewCase && (
              <button
                onClick={onNewCase}
                className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full w-12 h-12 shadow-lg shadow-emerald-900/30 border-2 border-white cursor-pointer active:scale-95"
                title="Register New Patient"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onTabChange('at_risk')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative cursor-pointer ${
                activeTab === 'at_risk' ? 'text-amber-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navAtRisk}</span>
              {atRiskCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {atRiskCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('referrals')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'referrals' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navReferrals}</span>
            </button>
          </>
        )}

        {/* 3. DOCTOR / MEDICAL OFFICER MOBILE NAV */}
        {currentUser.userType === 'health_worker' && currentUser.subRole === 'medical_officer' && (
          <>
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'home' || activeTab === 'overview' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navOverview}</span>
            </button>

            <button
              onClick={() => onTabChange('pending_referrals')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative cursor-pointer ${
                activeTab === 'pending_referrals' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navPendingReferrals}</span>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onTabChange('consultations')}
              className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-teal-600 to-emerald-500 text-white rounded-full w-12 h-12 shadow-lg shadow-teal-900/30 border-2 border-white cursor-pointer active:scale-95"
              title="Consultations"
            >
              <Stethoscope className="w-5 h-5" />
            </button>

            <button
              onClick={() => onTabChange('appointments')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'appointments' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.arrivedPatients}</span>
            </button>

            <button
              onClick={() => onTabChange('account')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'account' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navAccount}</span>
            </button>
          </>
        )}

        {/* 4. ADMINISTRATOR MOBILE NAV */}
        {currentUser.userType === 'admin' && (
          <>
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'home' || activeTab === 'overview' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navOverview}</span>
            </button>

            <button
              onClick={() => onTabChange('referrals')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'referrals' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navReferrals}</span>
            </button>

            <button
              onClick={() => onTabChange('at_risk')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative cursor-pointer ${
                activeTab === 'at_risk' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navAtRisk}</span>
              {atRiskCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {atRiskCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('facilities')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'facilities' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navFacilities}</span>
            </button>

            <button
              onClick={() => onTabChange('account')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'account' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t.navAccount}</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
