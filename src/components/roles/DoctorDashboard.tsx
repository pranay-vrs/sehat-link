import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Building2, 
  Filter, 
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Phone,
  FileText,
  Activity,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Referral } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { translations } from '../../data/translations';

interface DoctorDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onDoctorAction: (referral: Referral) => void;
  onRecordFailure: (referral: Referral) => void;
  onResolveFailure: (referral: Referral) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  activeTab = 'home',
  onTabChange,
  onDoctorAction,
  onRecordFailure,
  onResolveFailure
}) => {
  const { 
    currentUser, 
    referrals, 
    facilities,
    language, 
    acceptReferral, 
    markPatientArrived,
    logout 
  } = useReferralStore();

  const t = translations[language];

  // Scoped referrals for PHC Kashele / Dr. Sharma
  const doctorReferrals = referrals.filter(r => 
    r.destinationFacility.toLowerCase().includes('phc') ||
    r.destinationFacility.toLowerCase().includes('kashele') ||
    r.assignedDoctor?.toLowerCase() === currentUser?.name.toLowerCase()
  );

  const pendingAcceptance = doctorReferrals.filter(r => r.status === 'created');
  const scheduledAppointments = doctorReferrals.filter(r => r.status === 'scheduled');
  const arrivedPatients = doctorReferrals.filter(r => r.status === 'arrived');
  const activeConsultations = doctorReferrals.filter(r => r.status === 'arrived' || r.status === 'scheduled');
  const completedConsultations = doctorReferrals.filter(r => r.status === 'consulted' || r.status === 'followup' || r.status === 'completed');
  const followupsDue = doctorReferrals.filter(r => r.status === 'followup' && !r.isFollowUpCompleted);

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* Clinic Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-teal-800 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
            {currentUser?.facility || 'PHC Kashele'} · {t.receivingFacilityTag}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-900 border border-teal-700 text-teal-200">
            {t.medCouncilReg}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black mt-1">
          {currentUser?.name || 'Dr. Sharma'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
          {t.doctorHeadline}
        </p>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CLINIC OVERVIEW / HOME */}
      {/* ============================================================ */}
      {(activeTab === 'home' || activeTab === 'overview' || !activeTab) && (
        <div className="space-y-5">
          {/* Clinic Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              onClick={() => onTabChange && onTabChange('pending_referrals')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.navPendingReferrals}</span>
                <Activity className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {pendingAcceptance.length}
              </div>
              <span className="text-[10px] text-amber-600 font-bold">{t.awaitingIntake}</span>
            </div>

            <div 
              onClick={() => onTabChange && onTabChange('appointments')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.arrivedPatients}</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">
                {arrivedPatients.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">{t.checkedInOP}</span>
            </div>

            <div 
              onClick={() => onTabChange && onTabChange('appointments')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.scheduledVisits}</span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {scheduledAppointments.length}
              </div>
              <span className="text-[10px] text-slate-500">{t.bookedTodayTomorrow}</span>
            </div>

            <div 
              onClick={() => onTabChange && onTabChange('followups')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">{t.navFollowups}</span>
                <Clock className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {followupsDue.length}
              </div>
              <span className="text-[10px] text-slate-500">{t.postConsultReviews}</span>
            </div>
          </div>

          {/* Arrived Patients — Ready for Consultation (Primary Clinic Action) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>{t.readyForConsultation}</span>
              </h3>
              <span className="text-xs text-slate-500">{arrivedPatients.length} {t.casesLabel}</span>
            </div>

            {arrivedPatients.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">{t.noPatientsWaiting}</p>
            ) : (
              <div className="space-y-2.5">
                {arrivedPatients.map(ref => (
                  <div 
                    key={ref.id}
                    className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900">{ref.patient.name}</strong>
                        <span className="text-xs text-slate-500">({ref.patient.age}y / {ref.patient.gender})</span>
                        <span className="text-xs font-mono font-bold text-teal-700">#{ref.careThreadId}</span>
                      </div>
                      <p className="text-xs text-slate-700">
                        {t.reasonLabel} {ref.referralReason} · {t.priorityLabel} <span className="font-bold text-teal-800">{ref.priority === 'emergency' ? (t.emergency || 'Emergency') : ref.priority === 'urgent' ? t.urgent : t.routine}</span>
                      </p>
                      {ref.vitals && (
                        <p className="text-[11px] text-slate-500">
                          {t.vitalsLabel} Temp {ref.vitals.temperature || '98.6°F'} · BP {ref.vitals.bp || '120/80'} · SpO2 {ref.vitals.spo2 || '98%'}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onDoctorAction(ref)}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>{t.startConsultation}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Referrals Awaiting Facility Intake Review */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                <span>{t.incomingAwaitingAcceptance}</span>
              </h3>
              {onTabChange && (
                <button
                  onClick={() => onTabChange('pending_referrals')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  {t.viewQueue} ({pendingAcceptance.length})
                </button>
              )}
            </div>

            {pendingAcceptance.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">{t.allReferralsAccepted}</p>
            ) : (
              <div className="space-y-2.5">
                {pendingAcceptance.map(ref => (
                  <div 
                    key={ref.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900">{ref.patient.name}</strong>
                        <span className="text-xs text-slate-500">({ref.patient.age}y / {ref.patient.gender})</span>
                        <span className="text-xs font-mono font-bold text-teal-700">#{ref.careThreadId}</span>
                      </div>
                      <p className="text-xs text-slate-700">
                        {t.fromOrigin} <strong>{ref.sourceFacility}</strong> ({ref.createdBy})
                      </p>
                      <p className="text-xs text-slate-500 italic">
                        {ref.priorityReason}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptReferral(ref.id)}
                        className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.acceptReferral}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: FACILITY PATIENTS QUEUE */}
      {/* ============================================================ */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">{t.phcPatientRoster}</h3>
            <p className="text-xs text-slate-500">{t.phcPatientRosterDesc}</p>
          </div>

          <div className="space-y-3">
            {doctorReferrals.map(ref => (
              <div key={ref.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{ref.patient.name}</h4>
                    <p className="text-xs text-slate-500">{ref.patient.age}y · {ref.patient.gender} · {ref.patient.village}</p>
                    <p className="text-xs text-teal-800 font-medium mt-0.5">{t.conditionLabel} {ref.referralReason}</p>
                  </div>
                  <StatusBadge status={ref.status} isAtRisk={ref.isAtRisk} />
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t.careThreadPrefix}{ref.careThreadId}</span>
                  <button
                    onClick={() => onDoctorAction(ref)}
                    className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg border border-teal-200/80 text-[11px] cursor-pointer"
                  >
                    {t.clinicalReview}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: PENDING REFERRALS FULL QUEUE */}
      {/* ============================================================ */}
      {activeTab === 'pending_referrals' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">{t.navPendingReferrals} ({pendingAcceptance.length})</h3>
            <p className="text-xs text-slate-500">{t.pendingReferralsDesc}</p>
          </div>

          <div className="space-y-3">
            {pendingAcceptance.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{ref.patient.name}</h4>
                    <p className="text-xs text-slate-500">{t.initiatedBy} {ref.createdBy} · {ref.sourceFacility}</p>
                  </div>
                  <StatusBadge status={ref.status} />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <strong className="text-slate-800">{t.referralIndication}</strong>
                  <p className="text-slate-700">{ref.referralReason}</p>
                  <p className="text-slate-500 italic">{t.vitalsLabel} {ref.vitals?.temperature || 'Normal'} · SpO2: {ref.vitals?.spo2 || '98%'}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => acceptReferral(ref.id)}
                    className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.acceptReferral}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: TODAY'S APPOINTMENTS & ARRIVALS */}
      {/* ============================================================ */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">{t.todayAppointmentsArrivals}</h3>
            <p className="text-xs text-slate-500">{t.todayAppointmentsDesc}</p>
          </div>

          <div className="space-y-3">
            {activeConsultations.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{ref.patient.name}</h4>
                    <p className="text-xs text-slate-500">
                      {t.scheduledTimeLabel} <strong>{ref.scheduledTime || t.today}</strong>
                    </p>
                  </div>
                  <StatusBadge status={ref.status} />
                </div>

                <div className="flex gap-2">
                  {ref.status !== 'arrived' && (
                    <button
                      onClick={() => markPatientArrived(ref.id)}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t.markArrived}</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDoctorAction(ref)}
                    className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{t.startConsultation}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: CONSULTATIONS QUEUE */}
      {/* ============================================================ */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">{t.navConsultations} {t.queueLabel}</h3>
            <p className="text-xs text-slate-500">{t.consultationsQueueDesc}</p>
          </div>

          <div className="space-y-3">
            {doctorReferrals.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{ref.patient.name}</h4>
                    <p className="text-xs text-slate-500">{t.careThreadPrefix}{ref.careThreadId}</p>
                  </div>
                  <StatusBadge status={ref.status} />
                </div>

                {ref.consultationNotes && (
                  <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl text-xs space-y-1">
                    <strong className="text-teal-900">{t.clinicalOutcomeNote}</strong>
                    <p className="text-slate-800">{ref.consultationNotes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onDoctorAction(ref)}
                    className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>{t.openClinicalActionDrawer}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: FOLLOW-UPS */}
      {/* ============================================================ */}
      {activeTab === 'followups' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-base font-bold text-slate-900">{t.navFollowups} ({followupsDue.length})</h3>
            <p className="text-xs text-slate-500">{t.doctorFollowupsDesc}</p>
          </div>

          <div className="space-y-3">
            {followupsDue.map(ref => (
              <div key={ref.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{ref.patient.name}</h4>
                  <span className="text-xs text-amber-700 font-bold">{t.dueLabel} {ref.followUpDate || t.pendingLabel}</span>
                </div>
                <p className="text-xs text-slate-600">{ref.followUpNotes || ref.consultationNotes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: ACCOUNT */}
      {/* ============================================================ */}
      {activeTab === 'account' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">{t.doctorAccount}</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.nameDesignation}</span>
              <p className="font-bold text-slate-900">{currentUser?.name} · {t.medicalOfficerMBBS}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t.assignedFacility}</span>
              <p className="font-bold text-slate-900">{currentUser?.facility}, Karjat Block</p>
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
