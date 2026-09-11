import React, { useState } from 'react';
import { 
  HeartPulse, 
  User, 
  Stethoscope, 
  Building2, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Info,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { HealthWorkerSubRole, UserSession } from '../../types';
import { translations } from '../../data/translations';

export const LoginScreen: React.FC = () => {
  const { demoUsers, login, language, setLanguage } = useReferralStore();
  const t = translations[language];

  // Form State
  const [identifier, setIdentifier] = useState('asha@example.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedHwSubRole, setSelectedHwSubRole] = useState<HealthWorkerSubRole>('asha');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Demo accounts
  const patientUser = demoUsers.find(u => u.userType === 'patient') || demoUsers[0];
  const ashaUser = demoUsers.find(u => u.userType === 'health_worker' && u.subRole === 'asha') || demoUsers[1];
  const anmUser = demoUsers.find(u => u.userType === 'health_worker' && u.subRole === 'anm') || demoUsers[2];
  const doctorUser = demoUsers.find(u => u.userType === 'health_worker' && u.subRole === 'medical_officer') || demoUsers[3];
  const adminUser = demoUsers.find(u => u.userType === 'admin') || demoUsers[4];

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idLower = identifier.trim().toLowerCase();
    if (idLower.includes('patient') || idLower.includes('rahul')) {
      login(patientUser);
    } else if (idLower.includes('doctor') || idLower.includes('sharma')) {
      login(doctorUser);
    } else if (idLower.includes('admin') || idLower.includes('dho')) {
      login(adminUser);
    } else if (idLower.includes('anm') || idLower.includes('pooja')) {
      login(anmUser);
    } else {
      // Default to ASHA
      login(ashaUser);
    }
  };

  const handleQuickPatient = () => {
    login(patientUser);
  };

  const handleQuickHealthWorker = () => {
    if (selectedHwSubRole === 'medical_officer') {
      login(doctorUser);
    } else if (selectedHwSubRole === 'anm') {
      login(anmUser);
    } else {
      login(ashaUser);
    }
  };

  const handleQuickAdmin = () => {
    login(adminUser);
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
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
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

        {/* Two-Column Grid on Desktop: Left = Standard Login Form, Right = Clean Hackathon Demo Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Column 1: Real Healthcare Application Login Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>{t.signIn}</span>
                </h3>
                <span className="text-[11px] text-slate-400">ABDM / State Portal</span>
              </div>

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
                      placeholder="e.g. asha@example.com or +91 98221..."
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
                      onClick={() => setShowNotification('Demo accounts require no password reset.')}
                      className="text-[11px] text-teal-400 hover:underline"
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
                    <button onClick={() => setShowNotification(null)} className="text-teal-400 font-bold ml-2">×</button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98"
                >
                  <span>{t.signIn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={() => setShowNotification('Demo account registration is simulated.')}
                className="text-xs text-slate-400 hover:text-teal-300 transition-colors"
              >
                {t.createAccount}
              </button>
            </div>
          </div>

          {/* Column 2: Hackathon Demo Accounts (Strictly Role Scoped) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.demoLoginArea}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {t.demoLoginDesc}
              </p>

              <div className="space-y-3">
                {/* 1. Patient Demo */}
                <button
                  onClick={handleQuickPatient}
                  className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-teal-300 transition-colors">
                        {t.patientDemo}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {patientUser.name} · {patientUser.email}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* 2. Healthcare Worker Demo */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {t.healthWorkerDemo}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {selectedHwSubRole === 'medical_officer' ? doctorUser.name : (selectedHwSubRole === 'anm' ? anmUser.name : ashaUser.name)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleQuickHealthWorker}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Sub-role selector pills */}
                  <div className="pt-2 border-t border-slate-700/60">
                    <p className="text-[10px] text-slate-400 font-medium mb-1.5">
                      {t.subRoleSelect}
                    </p>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setSelectedHwSubRole('asha')}
                        className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all ${
                          selectedHwSubRole === 'asha'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ASHA
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedHwSubRole('anm')}
                        className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all ${
                          selectedHwSubRole === 'anm'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ANM
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedHwSubRole('medical_officer')}
                        className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all ${
                          selectedHwSubRole === 'medical_officer'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Doctor
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Administrator Demo */}
                <button
                  onClick={handleQuickAdmin}
                  className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block group-hover:text-teal-300 transition-colors">
                        {t.adminDemo}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {adminUser.name} · {adminUser.email}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-2 text-[11px] text-slate-400">
              <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p>
                {t.syntheticDisclaimer}
              </p>
            </div>
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
