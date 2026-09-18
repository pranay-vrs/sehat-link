import React, { useState } from 'react';
import { 
  HeartPulse, 
  User, 
  Stethoscope, 
  Building2, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

export type RoleTab = 'doctor' | 'asha' | 'patient' | 'admin';

export const LoginScreen: React.FC = () => {
  const { demoUsers, login, language, setLanguage } = useReferralStore();
  const t = translations[language];

  // Demo accounts
  const patientUser = demoUsers.find(u => u.userType === 'patient') || demoUsers[0];
  const ashaUser = demoUsers.find(u => u.userType === 'health_worker' && u.subRole === 'asha') || demoUsers[1];
  const anmUser = demoUsers.find(u => u.userType === 'health_worker' && u.subRole === 'anm') || demoUsers[2];
  const doctorUser = demoUsers.find(u => u.userType === 'health_worker' && u.subRole === 'medical_officer') || demoUsers[3];
  const adminUser = demoUsers.find(u => u.userType === 'admin') || demoUsers[4];

  // Role Tab Configuration
  const roleTabs: {
    id: RoleTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roleTitle: string;
    personaName: string;
    description: string;
    defaultEmail: string;
    placeholder: string;
  }[] = [
    {
      id: 'doctor',
      label: 'Doctor',
      icon: Stethoscope,
      roleTitle: 'Medical Officer',
      personaName: doctorUser.name,
      description: 'PHC Receiving Facility & Clinical Consultation',
      defaultEmail: doctorUser.email,
      placeholder: 'e.g. doctor@example.com or Dr. Sharma',
    },
    {
      id: 'asha',
      label: 'ASHA worker',
      icon: UserCheck,
      roleTitle: 'Field Care Coordinator',
      personaName: ashaUser.name,
      description: 'Community Health Triage & Field Referrals',
      defaultEmail: ashaUser.email,
      placeholder: 'e.g. asha@example.com or Sunita Devi',
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: User,
      roleTitle: 'Citizen / Beneficiary',
      personaName: patientUser.name,
      description: 'Personal ABHA Health Records & QR Pass',
      defaultEmail: patientUser.email,
      placeholder: 'e.g. patient@example.com or ABHA ID',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Building2,
      roleTitle: 'District Health Command',
      personaName: adminUser.name,
      description: 'District Health Directorate & Surveillance',
      defaultEmail: adminUser.email,
      placeholder: 'e.g. admin@example.com or DHO Raigad',
    },
  ];

  // Form State
  const [activeTab, setActiveTab] = useState<RoleTab>('doctor');
  const [identifier, setIdentifier] = useState(doctorUser.email);
  const [password, setPassword] = useState('••••••••');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const currentTab = roleTabs.find(tab => tab.id === activeTab) || roleTabs[0];

  const handleTabChange = (tabId: RoleTab) => {
    setActiveTab(tabId);
    setShowNotification(null);
    const target = roleTabs.find(t => t.id === tabId);
    if (target) {
      setIdentifier(target.defaultEmail);
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idLower = identifier.trim().toLowerCase();

    // Check if the identifier explicitly matches a specific persona
    if (idLower.includes('patient') || idLower.includes('rahul')) {
      login(patientUser);
    } else if (idLower.includes('doctor') || idLower.includes('sharma')) {
      login(doctorUser);
    } else if (idLower.includes('admin') || idLower.includes('dho')) {
      login(adminUser);
    } else if (idLower.includes('anm') || idLower.includes('pooja')) {
      login(anmUser);
    } else if (idLower.includes('asha') || idLower.includes('sunita')) {
      login(ashaUser);
    } else {
      // Otherwise log in as the active tab role
      switch (activeTab) {
        case 'doctor':
          login(doctorUser);
          break;
        case 'asha':
          login(ashaUser);
          break;
        case 'patient':
          login(patientUser);
          break;
        case 'admin':
          login(adminUser);
          break;
        default:
          login(doctorUser);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-700 selection:text-white">
      {/* Micro Government & Language Bar */}
      <div className="border-b border-slate-800 bg-black/40 px-4 py-2 text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-300">
              {t.govtAffiliation}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden sm:inline">{t.sihTag}</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg">
              <Globe className="w-3 h-3 text-teal-400" />
              <button 
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'text-teal-300 font-bold bg-slate-800' : 'hover:text-slate-200'}`}
              >
                EN
              </button>
              <span className="text-slate-600">·</span>
              <button 
                onClick={() => setLanguage('mr')}
                className={`px-1.5 py-0.5 rounded ${language === 'mr' ? 'text-teal-300 font-bold bg-slate-800' : 'hover:text-slate-200'}`}
              >
                मराठी
              </button>
              <span className="text-slate-600">·</span>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded ${language === 'hi' ? 'text-teal-300 font-bold bg-slate-800' : 'hover:text-slate-200'}`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Area */}
      <div className="flex-1 max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-xl shadow-teal-950/60 mb-2 border border-teal-300/30">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{t.loginTitle}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-900/80 text-teal-300 border border-teal-700">
              {t.demoModeBadge}
            </span>
          </h1>
          <p className="text-base sm:text-lg font-semibold text-teal-400">
            “{t.loginSubtitle}”
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {t.loginDescription}
          </p>
        </div>

        {/* Centered Login Card with Role Tabs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col">
          {/* Header with Title & State Portal Tag */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-400" />
              <span>{t.signIn}</span>
            </h3>
            <span className="text-[11px] text-teal-300/90 font-medium px-2.5 py-1 bg-teal-950/60 border border-teal-800/80 rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>ABDM / State Portal</span>
            </span>
          </div>

          {/* Role Tabs */}
          <div className="mb-5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Login As
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {roleTabs.map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-950/60 border border-teal-500/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Role Persona Banner */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white truncate flex items-center gap-2">
                  <span>{currentTab.personaName}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                    {currentTab.roleTitle}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {currentTab.description}
                </div>
              </div>
            </div>
          </div>

          {/* Login Credentials Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.emailOrPhone}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentTab.placeholder}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setShowNotification('Demo credentials pre-filled. No password reset required.')}
                  className="text-[11px] text-teal-400 hover:underline cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            {showNotification && (
              <div className="p-2.5 bg-teal-950/80 border border-teal-800 rounded-xl text-xs text-teal-300 flex items-center justify-between">
                <span>{showNotification}</span>
                <button 
                  type="button"
                  onClick={() => setShowNotification(null)} 
                  className="text-teal-400 font-bold ml-2 hover:text-teal-200"
                >
                  ×
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98"
            >
              <span>{t.signIn} as {currentTab.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-5 mt-5 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => setShowNotification('Demo account registration is simulated. Select a role tab above.')}
              className="text-xs text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
            >
              {t.createAccount}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-900 bg-black/60 px-4 py-3 text-center text-xs text-slate-500">
        <p>
          SEHAT-LINK — Rural Healthcare Referral Continuity Prototype · Smart India Hackathon 2026
        </p>
      </div>
    </div>
  );
};
