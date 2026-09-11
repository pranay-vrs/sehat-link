import React, { useState } from 'react';
import { 
  HeartPulse, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  User, 
  AlertCircle,
  Building2,
  CheckCircle2,
  FileText,
  HelpCircle,
  Info,
  Check,
  ArrowRight,
  FolderHeart,
  Stethoscope,
  ExternalLink,
  LogOut,
  Navigation
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { StatusBadge } from '../common/StatusBadge';
import { translations } from '../../data/translations';

interface PatientDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  activeTab = 'home',
  onTabChange 
}) => {
  const { currentUser, referrals, language, logout } = useReferralStore();
  const t = translations[language];

  // Scoped to Rahul Kumar or current logged in patient
  const patientReferrals = referrals.filter(r => 
    r.patient.name.toLowerCase() === (currentUser?.name || 'rahul kumar').toLowerCase() ||
    r.patient.abhaId === currentUser?.abhaId ||
    r.patientId === 'P-100'
  );

  const activeReferral = patientReferrals[0] || referrals[0];

  // Care Journey stages definition
  const journeyStages = [
    { key: 'created', label: t.statusCreated, done: true },
    { key: 'accepted', label: t.statusAccepted, done: ['accepted', 'scheduled', 'arrived', 'consulted', 'followup', 'completed'].includes(activeReferral.status) },
    { key: 'scheduled', label: t.statusScheduled, done: ['scheduled', 'arrived', 'consulted', 'followup', 'completed'].includes(activeReferral.status), current: activeReferral.status === 'scheduled' },
    { key: 'arrived', label: t.statusArrived, done: ['arrived', 'consulted', 'followup', 'completed'].includes(activeReferral.status), current: activeReferral.status === 'arrived' },
    { key: 'consulted', label: t.statusConsulted, done: ['consulted', 'followup', 'completed'].includes(activeReferral.status), current: activeReferral.status === 'consulted' },
    { key: 'followup', label: t.statusFollowup, done: activeReferral.status === 'completed', current: activeReferral.status === 'followup' },
    { key: 'completed', label: t.statusCompleted, done: activeReferral.status === 'completed', current: activeReferral.status === 'completed' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20 md:pb-8">
      {/* 1. PERSONAL HEALTH ACCOUNT GREETING BANNER */}
      <div className="bg-gradient-to-br from-teal-800 to-teal-950 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-teal-700">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
            {t.personalHealthAccount}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-900 border border-teal-700 font-mono text-teal-200">
            Care Thread #{activeReferral.careThreadId}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mt-1.5 flex items-center gap-2">
          <span>{t.patientGreeting}, {currentUser?.name || 'Rahul'} 👋</span>
        </h2>
        
        <p className="text-xs text-teal-100/90 mt-1">
          {currentUser?.village || 'Kashele Village'} · {currentUser?.district || 'Raigad'} · ABHA: <span className="font-mono text-teal-200 font-bold">{currentUser?.abhaId || '91-4829-1029-4820'}</span>
        </p>

        {/* In-page tab shortcuts */}
        {onTabChange && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-teal-800/80 overflow-x-auto pb-1">
            {[
              { id: 'home', label: t.navHome },
              { id: 'my_care', label: t.navMyCare },
              { id: 'appointments', label: t.navAppointments },
              { id: 'health_records', label: t.navHealthRecords },
              { id: 'account', label: t.navProfile }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-teal-200 hover:text-white hover:bg-teal-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: HOME VIEW ("What do I need to know right now?") */}
      {/* ============================================================ */}
      {(activeTab === 'home' || !activeTab) && (
        <div className="space-y-5">
          {/* "What do I need to know right now?" Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                {t.whatNeedToKnow}
              </h3>
            </div>

            {/* Current Care Highlight Box */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      🏥 {activeReferral.destinationFacility}
                    </h4>
                    <p className="text-xs text-teal-800 font-medium">
                      Consultation with <strong>{activeReferral.assignedDoctor || 'Dr. Sharma'}</strong>
                    </p>
                  </div>
                </div>
                <StatusBadge status={activeReferral.status} />
              </div>

              <div className="bg-white p-3 rounded-xl border border-teal-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Scheduled Time: <strong>{activeReferral.scheduledTime || 'Tomorrow · 10:30 AM'}</strong></span>
                </div>
                {onTabChange && (
                  <button
                    onClick={() => onTabChange('my_care')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.viewCareJourney}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Health Worker Contact Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  SD
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">{t.yourHealthWorker}</span>
                  <strong className="text-xs text-slate-900 block">ASHA Sunita Devi</strong>
                  <span className="text-[10px] text-slate-500">Sub-Centre Kashele</span>
                </div>
              </div>

              <a
                href="tel:+919822100000"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.contactHealthWorker}</span>
              </a>
            </div>
          </div>

          {/* YOUR CARE JOURNEY Progress Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <span>{t.yourCareJourney}</span>
            </h3>

            <div className="space-y-2">
              {journeyStages.map((stage, idx) => {
                const isCurrent = stage.current;
                const isDone = stage.done && !isCurrent;
                return (
                  <div
                    key={stage.key}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-teal-50 border-teal-400 font-bold shadow-xs'
                        : isDone
                        ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                        : 'bg-white border-dashed border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        isCurrent
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100 animate-pulse'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-xs ${isCurrent ? 'text-teal-900 font-bold' : ''}`}>
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">
                          Current Step
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheme Match Card with Required Facility Disclaimer */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                {t.schemeBenefits}: MJPJAY (₹5,00,000 Cashless)
              </h4>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              {t.schemeDisclaimer}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MY CARE (Detailed Care Thread #CT-1042) */}
      {/* ============================================================ */}
      {activeTab === 'my_care' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  Care Thread #{activeReferral.careThreadId}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Referral #{activeReferral.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Created by {activeReferral.createdBy} on {activeReferral.createdAt}
                </p>
              </div>
              <StatusBadge status={activeReferral.status} />
            </div>

            {/* Diagnostic Clinical Summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Reason for Referral:</h4>
              <p className="text-xs text-slate-700">{activeReferral.referralReason}</p>
              <p className="text-xs text-slate-500 italic">Clinical triage: {activeReferral.priorityReason}</p>

              {activeReferral.vitals && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Temp</span>
                    <strong className="text-slate-800">{activeReferral.vitals.temperature || '98.6 °F'}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">BP</span>
                    <strong className="text-slate-800">{activeReferral.vitals.bp || '120/80'}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">SpO2</span>
                    <strong className="text-slate-800">{activeReferral.vitals.spo2 || '98%'}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Pulse</span>
                    <strong className="text-slate-800">{activeReferral.vitals.pulse || '78 bpm'}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Referral Event Trajectory */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Event Timeline
              </h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {activeReferral.events.map((evt) => (
                  <div key={evt.id} className="relative flex items-start gap-3 pl-1">
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 ring-4 ring-white z-10">
                      ✓
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex-1 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{evt.title}</strong>
                        <span className="text-[10px] text-slate-400">{evt.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{evt.description}</p>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {evt.actor} ({evt.actorRole}) · {evt.facility}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: APPOINTMENTS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{t.upcomingVisit}</span>
            </h3>

            <div className="border border-teal-200 bg-teal-50/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {activeReferral.destinationFacility}
                  </h4>
                  <p className="text-xs text-teal-800">
                    Attending Physician: <strong>{activeReferral.assignedDoctor || 'Dr. Sharma'}</strong>
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-600 text-white">
                  Confirmed
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-700 bg-white p-3 rounded-xl border border-teal-200/80">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Time: <strong>{activeReferral.scheduledTime || 'Tomorrow · 10:30 AM'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Distance: <strong>3.2 km from village</strong></span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.directions}</span>
                </a>
                <a
                  href="tel:+919822455667"
                  className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Hospital</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: HEALTH RECORDS VIEW */}
      {/* ============================================================ */}
      {activeTab === 'health_records' && (
        <div className="space-y-4">
          {/* ABHA Digital Card */}
          <div className="bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 text-white p-5 rounded-3xl border border-teal-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                Ayushman Bharat Health Account (ABHA)
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{currentUser?.name || 'Rahul Kumar'}</h4>
              <p className="font-mono text-xs text-teal-300 tracking-wider mt-0.5">
                {currentUser?.abhaId || '91-4829-1029-4820'}
              </p>
            </div>
            <div className="pt-2 border-t border-teal-900/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>DOB: 12 Apr 1992 · Male</span>
              <span className="text-teal-400">Linked to Sehat-Link</span>
            </div>
          </div>

          {/* Past Consultations */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Diagnostic & Clinical History
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-slate-900">Acute Bronchial Congestion</strong>
                <span className="text-slate-400 text-[10px]">10 Sep 2026</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Primary assessment conducted by ASHA Sunita Devi. Referred to PHC Kashele for chest auscultation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: PROFILE & ACCOUNT VIEW */}
      {/* ============================================================ */}
      {(activeTab === 'account' || activeTab === 'profile') && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>{t.personalHealthAccount} Details</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Full Name</span>
              <p className="font-bold text-slate-900">{currentUser?.name}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Mobile & ABHA</span>
              <p className="font-bold text-slate-900">{currentUser?.phone} · ABHA {currentUser?.abhaId}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Village Jurisdiction</span>
              <p className="text-slate-700">{currentUser?.village}, {currentUser?.district}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Frontline Worker</span>
              <p className="font-bold text-teal-800">ASHA Sunita Devi (+91 98221 00000)</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>{t.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
};
