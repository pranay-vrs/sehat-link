import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Filter, 
  Download, 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Car,
  Phone,
  BarChart3,
  Network,
  LogOut,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Referral, FailureReason } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { translations } from '../../data/translations';

interface AdminDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onRecordFailure: (referral: Referral) => void;
  onResolveFailure: (referral: Referral) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab = 'home',
  onTabChange,
  onRecordFailure,
  onResolveFailure
}) => {
  const { 
    currentUser, 
    referrals, 
    facilities, 
    language,
    selectedBottleneckReason,
    setSelectedBottleneckReason,
    selectReferral,
    fhirResources,
    logout 
  } = useReferralStore();

  const t = translations[language];

  // District statistics
  const totalReferrals = referrals.length;
  const atRiskCount = referrals.filter(r => r.isAtRisk).length;
  const completedCount = referrals.filter(r => r.status === 'completed').length;
  const atRiskPercent = Math.round((atRiskCount / (totalReferrals || 1)) * 100);

  // Pipeline funnel counts
  const createdCount = referrals.length;
  const acceptedCount = referrals.filter(r => ['accepted', 'scheduled', 'arrived', 'consulted', 'followup', 'completed'].includes(r.status)).length;
  const scheduledCount = referrals.filter(r => ['scheduled', 'arrived', 'consulted', 'followup', 'completed'].includes(r.status)).length;
  const arrivedCount = referrals.filter(r => ['arrived', 'consulted', 'followup', 'completed'].includes(r.status)).length;
  const consultedCount = referrals.filter(r => ['consulted', 'followup', 'completed'].includes(r.status)).length;
  const followupCount = referrals.filter(r => ['followup', 'completed'].includes(r.status)).length;
  const closedCount = completedCount;

  // Root cause bottleneck distribution
  const bottlenecks: { reason: FailureReason; label: string; count: number; pct: number; color: string; icon: string }[] = [
    { reason: 'transport', label: t.reasonTransport, count: 18, pct: 38, color: 'bg-rose-500', icon: '🚗' },
    { reason: 'capacity', label: t.reasonCapacity, count: 11, pct: 22, color: 'bg-amber-500', icon: '🏥' },
    { reason: 'appointment', label: t.reasonAppointment, count: 8, pct: 16, color: 'bg-orange-500', icon: '📅' },
    { reason: 'unreachable', label: t.reasonUnreachable, count: 6, pct: 13, color: 'bg-blue-500', icon: '📞' },
    { reason: 'service_unavailable', label: t.reasonServiceUnavailable, count: 5, pct: 10, color: 'bg-purple-500', icon: '🧪' }
  ];

  // Filtered referrals for drilldown
  const activeDrilldownReferrals = selectedBottleneckReason 
    ? referrals.filter(r => r.failureReason === selectedBottleneckReason || (r.isAtRisk && selectedBottleneckReason === 'transport'))
    : referrals.filter(r => r.isAtRisk);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ============================================================ */}
      {/* HEADER BANNER */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-teal-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
            {t.districtOverview} · Directorate of Health Services
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-900 border border-teal-700 text-teal-200">
            Raigad District / Karjat Block
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black mt-1">
          {currentUser?.name || 'District Health Officer'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
          “{t.adminQuestion}”
        </p>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW / SURVEILLANCE DASHBOARD */}
      {/* ============================================================ */}
      {(activeTab === 'home' || activeTab === 'overview' || !activeTab) && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">{t.patientsServed}</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">1,248</div>
              <span className="text-[10px] text-teal-700 font-medium">Assigned rural citizens</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">{t.activeReferrals}</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalReferrals}</div>
              <span className="text-[10px] text-slate-500 font-medium">{t.medianClosureTime}</span>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">{t.completedReferrals}</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">{completedCount}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Care loop closed successfully</span>
            </div>

            <div className="bg-rose-50/70 p-4 sm:p-5 rounded-2xl border border-rose-300 shadow-xs space-y-1">
              <span className="text-xs font-bold text-rose-800 block">{t.atRiskPercentage}</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-900">
                {atRiskCount} <span className="text-sm font-semibold text-rose-700">({atRiskPercent}%)</span>
              </div>
              <span className="text-[10px] text-rose-700 font-bold">Stalled operational cases</span>
            </div>
          </div>

          {/* REFERRAL PIPELINE & COMPLETION FUNNEL */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-700" />
                  <span>{t.referralPipeline}</span>
                </h3>
                <p className="text-xs text-slate-500">Tracking referral progression through each care milestone</p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Total Pipeline: {createdCount} Referrals
              </span>
            </div>

            {/* Funnel Pipeline Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              {[
                { stage: 'Created', count: createdCount, pct: 100, color: 'border-teal-500 text-teal-900 bg-teal-50/70' },
                { stage: 'Accepted', count: acceptedCount, pct: Math.round((acceptedCount / (createdCount || 1)) * 100), color: 'border-teal-400 text-teal-900 bg-teal-50/50' },
                { stage: 'Scheduled', count: scheduledCount, pct: Math.round((scheduledCount / (createdCount || 1)) * 100), color: 'border-teal-400 text-teal-900 bg-teal-50/50' },
                { stage: 'Arrived', count: arrivedCount, pct: Math.round((arrivedCount / (createdCount || 1)) * 100), color: 'border-emerald-400 text-emerald-900 bg-emerald-50/50' },
                { stage: 'Consulted', count: consultedCount, pct: Math.round((consultedCount / (createdCount || 1)) * 100), color: 'border-emerald-500 text-emerald-900 bg-emerald-50/70' },
                { stage: 'Follow-up', count: followupCount, pct: Math.round((followupCount / (createdCount || 1)) * 100), color: 'border-amber-400 text-amber-900 bg-amber-50/60' },
                { stage: 'Completed', count: closedCount, pct: Math.round((closedCount / (createdCount || 1)) * 100), color: 'border-emerald-600 text-emerald-950 bg-emerald-100/70' }
              ].map((step, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border-2 ${step.color} flex flex-col justify-between space-y-1`}>
                  <span className="text-[11px] font-bold text-slate-700">{step.stage}</span>
                  <div className="text-lg sm:text-xl font-black">{step.count}</div>
                  <span className="text-[10px] font-semibold text-slate-500">{step.pct}% pass-through</span>
                </div>
              ))}
            </div>
          </div>

          {/* WHERE IS CARE GETTING STUCK? INTERACTIVE BOTTLENECK DRILL-DOWN */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>{t.whereCareGetsStuck}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {t.drillDownHint}
                </p>
              </div>
              {selectedBottleneckReason && (
                <button
                  onClick={() => setSelectedBottleneckReason(null)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 self-start sm:self-auto cursor-pointer"
                >
                  ✕ {t.clearFilter}
                </button>
              )}
            </div>

            {/* Clickable Horizontal Distribution Bars */}
            <div className="space-y-2.5">
              {bottlenecks.map(b => {
                const isSelected = selectedBottleneckReason === b.reason;
                return (
                  <div
                    key={b.reason}
                    onClick={() => setSelectedBottleneckReason(isSelected ? null : b.reason)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-200 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>{b.icon}</span>
                        <span>{b.label}</span>
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-700 text-white">
                            Selected
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">
                        {b.count} cases ({b.pct}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${b.color} transition-all duration-500`}
                        style={{ width: `${b.pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Drill-Down Result: Affected Facilities & Stalled Referrals */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {selectedBottleneckReason 
                    ? `Drill-Down: Stalled Cases (${selectedBottleneckReason.toUpperCase()})` 
                    : `${t.stalledReferrals} Across District`}
                </h4>
                <span className="text-xs text-slate-500">{activeDrilldownReferrals.length} Cases</span>
              </div>

              <div className="space-y-2.5">
                {activeDrilldownReferrals.map(ref => (
                  <div 
                    key={ref.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{ref.patient.name}</strong>
                        <span className="text-slate-500 font-mono text-[11px]">#{ref.careThreadId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                          {ref.failureReason?.toUpperCase() || 'DELAYED'}
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Facility: <strong>{ref.destinationFacility}</strong> · Origin: {ref.sourceFacility} ({ref.createdBy})
                      </p>
                      <p className="text-slate-500 text-[11px] italic">
                        {ref.failureNotes || ref.atRiskReason || 'Transit delay recorded.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={ref.status} isAtRisk={true} />
                      <button
                        onClick={() => selectReferral(ref.id)}
                        className="py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect Thread
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: REFERRAL MONITORING */}
      {/* ============================================================ */}
      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">District Referral Surveillance</h3>
            <p className="text-xs text-slate-500">Live monitoring of all referrals across PHCs, CHCs, and Sub-District Hospitals</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Care Thread / ID</th>
                    <th className="p-3.5">Patient</th>
                    <th className="p-3.5">Origin ➔ Destination</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {referrals.map(ref => (
                    <tr key={ref.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-teal-800">
                        #{ref.careThreadId}
                        <span className="block text-[10px] text-slate-400 font-normal">{ref.id}</span>
                      </td>
                      <td className="p-3.5">
                        <strong className="text-slate-900 block">{ref.patient.name}</strong>
                        <span className="text-slate-500 text-[11px]">{ref.patient.village}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-600 block">{ref.sourceFacility}</span>
                        <span className="text-slate-900 font-bold block">➔ {ref.destinationFacility}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ref.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {ref.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={ref.status} isAtRisk={ref.isAtRisk} />
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => selectReferral(ref.id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200 text-[11px] cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: AT-RISK REFERRALS */}
      {/* ============================================================ */}
      {activeTab === 'at_risk' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-300 p-5 rounded-3xl space-y-2">
            <h3 className="text-base font-bold text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
              <span>District Bottlenecks & At-Risk Referrals ({atRiskCount})</span>
            </h3>
            <p className="text-xs text-rose-900">
              Patients currently delayed between facilities. Immediate intervention needed from block coordinators.
            </p>
          </div>

          <div className="space-y-3">
            {referrals.filter(r => r.isAtRisk).map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border-2 border-rose-400 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{ref.patient.name} · #{ref.careThreadId}</h4>
                    <p className="text-xs text-slate-500">Route: {ref.sourceFacility} ➔ {ref.destinationFacility}</p>
                  </div>
                  <StatusBadge status={ref.status} isAtRisk={true} />
                </div>
                <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs space-y-1">
                  <strong className="text-rose-900">Failure Cause: {ref.failureReason?.toUpperCase() || 'TRANSIT'}</strong>
                  <p className="text-slate-800">{ref.failureNotes || ref.atRiskReason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: FACILITIES CAPACITY & LOAD */}
      {/* ============================================================ */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">District Healthcare Facility Network</h3>
            <p className="text-xs text-slate-500">Facility tiering, inpatient bed load, and queue status across Raigad</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facilities.map(fac => (
              <div key={fac.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{fac.type} · {fac.block} Block</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    fac.currentLoad === 'Normal' ? 'bg-emerald-100 text-emerald-800' : (fac.currentLoad === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')
                  }`}>
                    {fac.currentLoad} Load
                  </span>
                </div>
                <p className="text-xs text-slate-600">Distance: {fac.distanceKm} km · Wait: ~{fac.estimatedWaitMinutes} mins</p>
                <p className="text-[11px] text-slate-400">Available: {fac.availableServices.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: HEALTHCARE WORKERS ROSTER */}
      {/* ============================================================ */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">{t.navWorkers} Roster</h3>
            <p className="text-xs text-slate-500">Active frontline ASHAs, ANMs, and Medical Officers across Karjat Block</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm text-slate-900">Sunita Devi</strong>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">ASHA</span>
              </div>
              <p className="text-slate-600">Sub-Centre Kashele · Kashele Village</p>
              <p className="text-slate-500">Active Care Threads: 6 · Closure Rate: 94%</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-sm text-slate-900">Dr. Sharma</strong>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Medical Officer</span>
              </div>
              <p className="text-slate-600">PHC Kashele · Receiving Facility</p>
              <p className="text-slate-500">Incoming Queue: 4 · Consultations Done: 18</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: REPORTS */}
      {/* ============================================================ */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">District Referral Continuity Reports</h3>
            <p className="text-xs text-slate-500">Automated performance and drop-off summaries (Synthetic Data for SIH 2026)</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl space-y-2">
              <strong className="text-teal-900 text-sm block">Key Performance Indicators:</strong>
              <ul className="space-y-1.5 text-slate-700">
                <li>• <strong>Median Referral Closure Time:</strong> 3.2 Days (Target: &lt; 4.0 Days)</li>
                <li>• <strong>Referral Completion Rate:</strong> 86.2% across Karjat block</li>
                <li>• <strong>Primary Drop-off Cause:</strong> Rural transit barriers (38% of delayed cases)</li>
              </ul>
            </div>

            <button
              onClick={() => alert('Synthetic report summary generated.')}
              className="py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Synthetic District Report (PDF/CSV)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: ABDM / FHIR PROTOTYPE INTEROPERABILITY LAYER */}
      {/* ============================================================ */}
      {activeTab === 'interop' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center gap-2 text-teal-400">
              <Network className="w-5 h-5" />
              <h3 className="text-base font-bold">HL7 FHIR R4 / ABDM Prototype Architecture</h3>
            </div>
            <p className="text-xs text-slate-300">
              Simulated interoperability layer designed for future ABDM Milestone 1/2/3 and eSanjeevani integration.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Standard FHIR R4 Resources Generated:</h4>
            <div className="space-y-2 font-mono text-[11px]">
              {fhirResources.map((res, i) => (
                <div key={i} className="p-3 bg-slate-900 text-teal-300 rounded-xl overflow-x-auto">
                  <div className="text-white font-bold mb-1">
                    Resource: {res.resourceType} (#{res.id}) · Status: {res.status}
                  </div>
                  <pre>{JSON.stringify(res.details, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 8: ACCOUNT */}
      {/* ============================================================ */}
      {activeTab === 'account' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">District Administrator Account</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Name & Designation</span>
              <p className="font-bold text-slate-900">{currentUser?.name} · District Health Command</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Department & Jurisdiction</span>
              <p className="font-bold text-slate-900">Public Health Department · Raigad District</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Contact & Email</span>
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
