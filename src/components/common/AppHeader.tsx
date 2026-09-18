import React, { useState } from 'react';
import { 
  HeartPulse, 
  Wifi, 
  WifiOff, 
  Globe, 
  Bell, 
  LogOut, 
  User, 
  ChevronDown,
  Activity
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';
import { NotificationMenu } from '../notifications/NotificationMenu';
import { UserProfileModal } from './UserProfileModal';

interface AppHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNewCase?: () => void;
  onSearch?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ activeTab = 'home' }) => {
  const { 
    currentUser, 
    logout,
    language, 
    setLanguage, 
    isOffline, 
    toggleOffline, 
    syncQueue,
    getScopedNotifications
  } = useReferralStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const t = translations[language];
  const scopedNotifs = getScopedNotifications();
  const unreadCount = scopedNotifs.filter(n => !n.isRead).length;

  if (!currentUser) return null;

  // Derive current page title from activeTab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
      case 'overview':
        if (currentUser.userType === 'patient') return t.personalHealthAccount;
        if (currentUser.userType === 'admin') return t.districtOverview;
        if (currentUser.subRole === 'medical_officer') return t.clinicOverview;
        return t.todaysWork;
      case 'patients':
        return t.navPatients;
      case 'referrals':
        return t.navReferrals;
      case 'pending_referrals':
        return t.navPendingReferrals;
      case 'appointments':
        return t.navAppointments;
      case 'consultations':
        return t.navConsultations;
      case 'followups':
        return t.navFollowups;
      case 'at_risk':
        return t.navAtRisk;
      case 'facilities':
        return t.navFacilities;
      case 'workers':
        return t.navWorkers;
      case 'reports':
        return t.navReports;
      case 'my_care':
        return t.navMyCare;
      case 'health_records':
        return t.navHealthRecords;
      case 'profile':
        return t.navProfile;
      case 'account':
        return t.navAccount;
      case 'interop':
        return t.navInterop;
      default:
        return t.appTitle;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top micro-bar: Official affiliation and current view indicator */}
      <div className="bg-slate-950 px-3 sm:px-4 py-1 text-[11px] text-slate-400 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-300 truncate">
              {t.govtAffiliation}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-400">
            <span className="text-teal-400 font-medium hidden sm:inline">
              SIH 2026 · PS SIH26133
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="text-slate-300 truncate">
              {currentUser.facility || currentUser.village || currentUser.district}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & Current Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-inner font-black text-lg sm:text-xl tracking-wider border border-teal-400/30">
            SL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline text-slate-600">/</span>
              <span className="text-xs sm:text-sm font-semibold text-teal-300">
                {getPageTitle()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right: Functional Controls (Language, Offline, Notifications, Profile, Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Trilingual Language Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/90 border border-slate-700/80 p-1 rounded-xl text-[11px]">
            <Globe className="w-3.5 h-3.5 text-teal-400 ml-1 mr-0.5 hidden sm:inline" />
            <button 
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded font-medium transition-all ${language === 'en' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="English"
            >
              EN
            </button>
            <span className="text-slate-600 text-[10px]">·</span>
            <button 
              onClick={() => setLanguage('mr')}
              className={`px-1.5 py-0.5 rounded font-medium transition-all ${language === 'mr' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="मराठी"
            >
              मराठी
            </button>
            <span className="text-slate-600 text-[10px]">·</span>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded font-medium transition-all ${language === 'hi' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="हिंदी"
            >
              हिंदी
            </button>
          </div>

          {/* Offline / Online Simulator Pill */}
          <button
            onClick={toggleOffline}
            title={isOffline ? 'Offline Mode (Local Storage Active)' : 'Online Mode (Real-Time)'}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isOffline
                ? 'bg-amber-950/80 text-amber-300 border-amber-700 animate-pulse'
                : 'bg-slate-800/80 text-emerald-400 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{t.offline}</span>
                {syncQueue.length > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] px-1 rounded-full font-bold">
                    {syncQueue.length}
                  </span>
                )}
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">{t.online}</span>
              </>
            )}
          </button>

          {/* Role-Specific Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotifOpen && (
              <NotificationMenu 
                onClose={() => setIsNotifOpen(false)} 
              />
            )}
          </div>

          {/* Fixed User Profile Badge (Click opens account details) */}
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700/80 cursor-pointer transition-all"
            title="Click to view profile / account settings"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-teal-300 block leading-none font-medium truncate max-w-[120px]">
                {currentUser.roleTitle.split('(')[0]}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </div>

          {/* Explicit Logout Button (Required to switch accounts in demo!) */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition-colors text-xs font-medium cursor-pointer"
            title="Sign out and return to Login Screen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  );
};
