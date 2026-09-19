import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  UserPlus, 
  Search, 
  Phone, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Building2,
  HelpCircle,
  Filter,
  Check,
  Stethoscope,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Referral, Patient, ReferralStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { translations } from '../../data/translations';

interface AshaDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNewCase: () => void;
  onSearch: () => void;
  onRecordFailure: (referral: Referral) => void;
  onResolveFailure: (referral: Referral) => void;
  onDoctorAction: (referral: Referral) => void;
}

export const AshaDashboard: React.FC<AshaDashboardProps> = ({
  activeTab = 'home',
  onTabChange,
  onNewCase,
  onSearch,
  onRecordFailure,
  onResolveFailure,
  onDoctorAction
}) => {
  const { 
    currentUser, 
    referrals, 
    patients, 
    facilities,
    language, 
    selectReferral,
    completeFollowUp,
    logout 
  } = useReferralStore();

  const t = translations[language];

  // Scoped referrals for ASHA Sunita Devi
  const ashaReferrals = referrals.filter(r => 
    r.createdBy.toLowerCase().includes('sunita') ||
    r.sourceFacility.toLowerCase().includes('sub-centre') ||
    r.patient.village.toLowerCase().includes('kashele')
  );

  const atRiskReferrals = ashaReferrals.filter(r => r.isAtRisk);
  const pendingReferrals = ashaReferrals.filter(r => r.status === 'created' || r.status === 'accepted' || r.status === 'scheduled');
  const followUpReferrals = ashaReferrals.filter(r => r.status === 'followup' && !r.isFollowUpCompleted);

  // Priority case highlight (Savita Patil or any at-risk case)
  const priorityAtRiskCase = atRiskReferrals[0] || ashaReferrals.find(r => r.priority === 'emergency' || r.priority === 'urgent');

  // Filter state for referrals tab
  const [referralStatusFilter, setReferralStatusFilter] = useState<string>('all');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  const filteredReferrals = ashaReferrals.filter(r => {
    if (referralStatusFilter === 'all') return true;
    return r.status === referralStatusFilter;
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
    p.phone.includes(patientSearchQuery) ||
    p.village.toLowerCase().includes(patientSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* ============================================================ */}
      {/* TAB 1: TODAY'S WORK / HOME VIEW */}
      {/* ============================================================ */}
      {(activeTab === 'home' || activeTab === 'dashboard' || !activeTab) && (
        <div className="space-y-5">
          {/* Header Greeting & Core Question */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white p-5 sm:p-6 rounded-3xl border border-teal-700 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                {currentUser?.roleTitle || 'ASHA Worker'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-900 border border-teal-700 text-teal-200">
                {currentUser?.village || 'Kashele Village'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {t.todaysWork}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 font-medium mt-0.5">
              “{t.ashaQuestion}”
            </p>
          </div>

          {/* Quick Metrics: "What needs my attention?" */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              onClick={() => onTabChange && onTabChange('patients')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.patientsNeedingAttention}</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {ashaReferrals.length}
              </div>
              <span className="text-[10px] text-teal-700 font-medium">{t.assignedCohort}</span>
            </div>

            <div 
              onClick={() => onTabChange && onTabChange('referrals')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.pendingReferralsCount}</span>
                <Activity className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {pendingReferrals.length}
              </div>
              <span className="text-[10px] text-slate-500">{t.inFacilityPipeline}</span>
            </div>

            <div 
              onClick={() => onTabChange && onTabChange('followups')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.followupsDue}</span>
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {followUpReferrals.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">{t.homeVisitsDue}</span>
            </div>

            <div 
              onClick={() => onTabChange && onTabChange('at_risk')}
              className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300 shadow-xs cursor-pointer hover:border-amber-500 transition-colors"
            >
              <div className="flex items-center justify-between text-amber-800 mb-1">
                <span className="text-xs font-bold">{t.atRiskCases}</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-900">
                {atRiskReferrals.length}
              </div>
              <span className="text-[10px] text-amber-700 font-bold animate-pulse">{t.actionRequired}</span>
            </div>
          </div>

          {/* Priority At-Risk Case Highlight Alert */}
          {priorityAtRiskCase && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-500 text-white rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      {t.priorityCase} · {priorityAtRiskCase.delayDuration || 'Action Overdue'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {priorityAtRiskCase.patient.name} ({priorityAtRiskCase.patient.age}y / {priorityAtRiskCase.patient.gender})
                    </h3>
                  </div>
                </div>
                <StatusBadge status={priorityAtRiskCase.status} isAtRisk={priorityAtRiskCase.isAtRisk} />
              </div>

              {/* Operational Delay Detail */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-300/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-900">
                    ⚠️ {priorityAtRiskCase.failureReason ? t[('reason' + priorityAtRiskCase.failureReason.charAt(0).toUpperCase() + priorityAtRiskCase.failureReason.slice(1)) as keyof typeof t] || priorityAtRiskCase.failureReason : t.transitDelayed}
                  </strong>
                  <span className="text-slate-500 text-[11px]">{t.destination}: {priorityAtRiskCase.destinationFacility}</span>
                </div>
                <p className="text-slate-700">
                  {priorityAtRiskCase.failureNotes || priorityAtRiskCase.atRiskReason || t.transitDelayed}
                </p>
                {priorityAtRiskCase.suggestedAction && (
                  <div className="p-2 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-[11px]">
                    💡 <strong>{t.suggestedIntervention}</strong> {priorityAtRiskCase.suggestedAction}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`tel:${priorityAtRiskCase.patient.phone}`}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.callPatient}</span>
                </a>

                <button
                  onClick={() => onRecordFailure(priorityAtRiskCase)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.updateDelayCause}
                </button>

                {priorityAtRiskCase.isAtRisk && (
                  <button
                    onClick={() => onResolveFailure(priorityAtRiskCase)}
                    className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.resolveIssue}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Primary Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={onNewCase}
              className="p-4 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5" />
                <div className="text-left">
                  <span className="block">{t.registerPatient}</span>
                  <span className="text-[10px] text-teal-200 font-normal">{t.addCitizenCohort}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-300" />
            </button>

            <button
              onClick={onSearch}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-teal-700" />
                <div className="text-left">
                  <span className="block">{t.startAssessment}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{t.protocolTriage}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onTabChange && onTabChange('referrals')}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-teal-700" />
                <div className="text-left">
                  <span className="block">{t.navReferrals}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{t.inspectCareThreads}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Referral Risk Intelligence Card (Explainable decision support) */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {t.explainableRisk}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.explainableRiskDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
                <span className="text-amber-400 font-bold block">Transit Delay Factor</span>
                <span className="text-slate-400 text-[11px]">River overflow reported on Kashele-Karjat road. Flagged 2 cases for 108 ambulance dispatch.</span>
              </div>
              <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold block">Facility Confirmation</span>
                <span className="text-slate-400 text-[11px]">PHC Kashele MBBS Doctor available today. Average triage wait time: 25 mins.</span>
              </div>
            </div>
          </div>

          {/* Recent Referrals Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {t.recentPatientReferrals}
              </h3>
              {onTabChange && (
                <button
                  onClick={() => onTabChange('referrals')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  {t.viewAll} ({ashaReferrals.length})
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {ashaReferrals.slice(0, 3).map(ref => (
                <div
                  key={ref.id}
                  onClick={() => {
                    selectReferral(ref.id);
                    if (onTabChange) onTabChange('referrals');
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-teal-50/40 border border-slate-200 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-slate-900">{ref.patient.name}</strong>
                      <span className="text-[10px] text-slate-400">({ref.patient.age}y/{ref.patient.gender})</span>
                      <span className="text-[10px] font-mono text-teal-700 font-bold">#{ref.careThreadId}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate max-w-xs sm:max-w-md">
                      {t.destination}: {ref.destinationFacility} · {ref.referralReason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ref.status} isAtRisk={ref.isAtRisk} />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MY PATIENTS DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.navPatients}</h3>
              <p className="text-xs text-slate-500">{t.assignedPatients}</p>
            </div>
            <button
              onClick={onNewCase}
              className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.registerPatient}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={patientSearchQuery}
              onChange={e => setPatientSearchQuery(e.target.value)}
              placeholder={t.searchPatientPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:border-teal-500 shadow-xs"
            />
          </div>

          {/* Patient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPatients.map(patient => (
              <div key={patient.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{patient.name}</h4>
                    <p className="text-xs text-slate-500">{patient.age} yrs · {patient.gender} · {patient.village}</p>
                    <p className="text-[11px] font-mono text-teal-700 mt-0.5">ABHA: {patient.abhaId}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {patient.socioeconomicCategory}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">{patient.phone}</span>
                  <button
                    onClick={onNewCase}
                    className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200/80 text-[11px] cursor-pointer"
                  >
                    + {t.createReferral}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: REFERRALS MANAGEMENT VIEW */}
      {/* ============================================================ */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {t.navReferrals} ({ashaReferrals.length})
              </h3>
              <span className="text-xs text-slate-500">{currentUser?.facility || 'Sub-Centre Kashele'}</span>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: t.allCases },
                { id: 'created', label: t.statusCreated },
                { id: 'accepted', label: t.statusAccepted },
                { id: 'scheduled', label: t.statusScheduled },
                { id: 'arrived', label: t.statusArrived },
                { id: 'consulted', label: t.statusConsulted },
                { id: 'followup', label: t.statusFollowup },
                { id: 'completed', label: t.statusCompleted }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setReferralStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    referralStatusFilter === f.id
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Referral Cards */}
          <div className="space-y-3">
            {filteredReferrals.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{ref.patient.name}</h4>
                      <span className="text-xs text-slate-400">({ref.patient.age}y/{ref.patient.gender})</span>
                      <span className="text-xs font-mono font-bold text-teal-700">#{ref.careThreadId}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t.destination}: <strong>{ref.destinationFacility}</strong> · {ref.referralReason}
                    </p>
                  </div>
                  <StatusBadge status={ref.status} isAtRisk={ref.isAtRisk} />
                </div>

                {/* Event Tracker Snippet */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{t.stageCreated}: {ref.createdAt}</span>
                    <span className="font-bold text-teal-800">{t.priority}: {ref.priority === 'emergency' ? (t.emergency || 'Emergency') : ref.priority === 'urgent' ? t.urgent : t.routine}</span>
                  </div>
                  {ref.isAtRisk && (
                    <p className="text-amber-800 font-semibold text-[11px]">
                      ⚠️ Stalled: {ref.failureNotes || ref.atRiskReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onRecordFailure(ref)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.recordDelayReason}
                  </button>
                  {ref.isAtRisk && (
                    <button
                      onClick={() => onResolveFailure(ref)}
                      className="py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t.resolveIssue}
                    </button>
                  )}
                  <a
                    href={`tel:${ref.patient.phone}`}
                    className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ml-auto"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.call}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: AT-RISK CASES VIEW */}
      {/* ============================================================ */}
      {activeTab === 'at_risk' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-300 p-5 rounded-3xl space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-amber-950">
                {t.navAtRisk} ({atRiskReferrals.length})
              </h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Referrals currently blocked by operational bottlenecks (transport disruption, patient unreachable, or facility unavailability). Immediate frontline action required.
            </p>
          </div>

          <div className="space-y-3">
            {atRiskReferrals.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border-2 border-amber-400 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                      {ref.delayDuration || 'Delayed 2 days'} · Responsible: {ref.responsiblePerson || 'ASHA Sunita Devi'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {ref.patient.name} · #{ref.careThreadId}
                    </h4>
                    <p className="text-xs text-slate-500">{t.destination}: {ref.destinationFacility}</p>
                  </div>
                  <StatusBadge status={ref.status} isAtRisk={true} />
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-950">
                      Reason: {ref.failureReason?.toUpperCase() || 'TRANSPORT'}
                    </strong>
                    <span className="text-[10px] text-slate-500">{ref.failureTimestamp || '10 Sep'}</span>
                  </div>
                  <p className="text-slate-800">{ref.failureNotes || ref.atRiskReason}</p>
                  {ref.suggestedAction && (
                    <p className="text-teal-900 text-[11px] font-medium pt-1 border-t border-amber-200">
                      {t.suggestedActionLabel} {ref.suggestedAction}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={`tel:${ref.patient.phone}`}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.callPatient}</span>
                  </a>
                  <button
                    onClick={() => onRecordFailure(ref)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.updateDelayCause}
                  </button>
                  <button
                    onClick={() => onResolveFailure(ref)}
                    className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t.resolveIssue}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: HOME FOLLOW-UPS DUE */}
      {/* ============================================================ */}
      {activeTab === 'followups' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{t.navFollowups} ({followUpReferrals.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Patients discharged from medical consultation requiring home verification and medication compliance review.
            </p>
          </div>

          <div className="space-y-3">
            {followUpReferrals.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{ref.patient.name}</h4>
                    <p className="text-xs text-slate-500">
                      Follow-up Due Date: <strong>{ref.followUpDate || 'Today'}</strong> · {ref.patient.village}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {t.visitDue}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <strong className="text-slate-800">{t.doctorInstructions}</strong>
                  <p className="text-slate-700">{ref.followUpNotes || ref.consultationNotes || 'Verify symptom resolution.'}</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => completeFollowUp(ref.id, 'ASHA verified patient full recovery.')}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t.closeCareLoop}</span>
                  </button>
                  <a
                    href={`tel:${ref.patient.phone}`}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.call}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: FACILITIES DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>{t.navFacilities} {t.directory}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Nearby referral health facilities in Karjat Block / Raigad District
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facilities.map(fac => (
              <div key={fac.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{fac.type} · {fac.distanceKm} km</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    fac.currentLoad === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {fac.currentLoad === 'Normal' ? t.normalLoad : t.highLoad}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p>Wait: ~{fac.estimatedWaitMinutes} mins · {fac.recommendationReason}</p>
                  <p className="text-slate-400">Services: {fac.availableServices.slice(0, 3).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: ACCOUNT / PROFILE VIEW */}
      {/* ============================================================ */}
      {activeTab === 'account' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">{t.healthWorkerAccount}</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.nameDesignation}</span>
              <p className="font-bold text-slate-900">{currentUser?.name} · {t.roleAsha}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.assignedVillageFacility}</span>
              <p className="font-bold text-slate-900">{currentUser?.village} · {currentUser?.facility}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.contactEmail}</span>
              <p className="font-bold text-slate-900">{currentUser?.phone} · {currentUser?.email}</p>
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
