import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Building2,
  Phone,
  CornerDownRight,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { Referral, ReferralStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

interface ReferralTimelineProps {
  referral: Referral;
  onRecordFailure?: () => void;
  onResolveFailure?: () => void;
  onDoctorAction?: () => void;
  onFollowUpAction?: () => void;
  isCompact?: boolean;
}

interface StageConfig {
  key: ReferralStatus;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const STAGES: StageConfig[] = [
  { key: 'created', label: 'Created', sublabel: 'ASHA Initiated', icon: Clock },
  { key: 'accepted', label: 'Accepted', sublabel: 'Facility Slot', icon: Building2 },
  { key: 'arrived', label: 'Arrived', sublabel: 'Patient Checked In', icon: UserCheck },
  { key: 'consulted', label: 'Consulted', sublabel: 'Doctor Review', icon: Stethoscope },
  { key: 'followup', label: 'Follow-up', sublabel: 'ASHA Verification', icon: Calendar },
  { key: 'completed', label: 'Care Completed', sublabel: 'Loop Closed', icon: ShieldCheck }
];

export const ReferralTimeline: React.FC<ReferralTimelineProps> = ({
  referral,
  onRecordFailure,
  onResolveFailure,
  onDoctorAction,
  onFollowUpAction,
  isCompact = false
}) => {
  const { language } = useReferralStore();
  const t = translations[language];

  const stageOrder: ReferralStatus[] = ['created', 'accepted', 'arrived', 'consulted', 'followup', 'completed'];
  const currentIndex = stageOrder.indexOf(referral.status);

  const getEventForStage = (stage: ReferralStatus) => {
    return referral.events.find(e => e.stage === stage);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header Info with Care Thread Identification */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-900 text-white shadow-2xs">
              Care Thread #{referral.careThreadId || 'CT-1042'}
            </span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Ref: #{referral.id}
            </span>
            {referral.parentReferralId && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                <CornerDownRight className="w-3 h-3 text-slate-400" />
                Linked from #{referral.parentReferralId}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            <strong className="text-slate-900">{referral.patient.name}</strong> ({referral.patient.age}y, {referral.patient.gender}) · {referral.sourceFacility} ➔ <strong className="text-teal-900">{referral.destinationFacility}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge priority={referral.priority} size="sm" />
          <StatusBadge status={referral.status} isAtRisk={referral.isAtRisk} size="sm" />
        </div>
      </div>

      {/* AT-RISK ACTIONABLE EXCEPTION BANNER */}
      {referral.isAtRisk && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50/80 p-4 sm:p-5 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-xs shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-900">
                    Referral At Risk — Operational Bottleneck
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-900 text-[10px] font-bold">
                    {referral.delayDuration || '2 days delayed'}
                  </span>
                </div>
                <p className="text-xs text-red-800 font-semibold mt-1">
                  {referral.atRiskReason || 'Referral stalled between facility transition.'}
                </p>
              </div>
            </div>
          </div>

          {/* Structured Resolution Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/90 p-3 rounded-xl border border-red-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Who Needs To Act:</span>
              <span className="font-bold text-slate-900">{referral.responsiblePerson || 'ASHA Anita Malik'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Suggested Action:</span>
              <span className="font-semibold text-teal-900">{referral.suggestedAction || 'Contact patient to coordinate transport.'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={`tel:${referral.patient.phone}`}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Patient ({referral.patient.phone})</span>
            </a>
            {onRecordFailure && (
              <button
                onClick={onRecordFailure}
                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-800 border border-red-300 rounded-xl text-xs font-bold transition-colors"
              >
                Update Delay Cause
              </button>
            )}
            {onResolveFailure && (
              <button
                onClick={onResolveFailure}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Resolve & Resume Care</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6-STAGE TIMELINE HORIZONTAL / VERTICAL RESPONSIVE TRACK */}
      <div className="pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentIndex || (referral.status === 'completed');
            const isCurrent = idx === currentIndex && referral.status !== 'completed';
            const matchedEvent = getEventForStage(stage.key);

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between min-h-[96px] ${
                  isCurrent
                    ? referral.isAtRisk
                      ? 'bg-red-50/80 border-red-400 ring-2 ring-red-200'
                      : 'bg-teal-50 border-teal-500 ring-2 ring-teal-200 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? referral.isAtRisk ? 'bg-red-600 text-white' : 'bg-teal-700 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <Icon className={`w-4 h-4 ${
                    isCompleted ? 'text-emerald-700' : isCurrent ? 'text-teal-700' : 'text-slate-400'
                  }`} />
                </div>

                <div className="mt-2">
                  <h4 className={`text-xs font-bold leading-tight ${
                    isCompleted ? 'text-emerald-950' : isCurrent ? 'text-teal-950' : 'text-slate-500'
                  }`}>
                    {stage.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {matchedEvent ? matchedEvent.timestamp.split('·')[0] : stage.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUDIT LOG TRAIL */}
      {!isCompact && referral.events && referral.events.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Verified Care Thread Audit Trail</span>
            <span className="text-[11px] font-normal text-slate-400 font-mono">
              {referral.events.length} Events Logged
            </span>
          </h4>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {referral.events.map((evt) => (
              <div 
                key={evt.id} 
                className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                  evt.stage === 'at_risk' 
                    ? 'bg-red-50/50 border-red-200' 
                    : evt.stage === 'completed'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-200/70 px-1.5 py-0.2 rounded">
                      {evt.actor} ({evt.actorRole})
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{evt.description}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {evt.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
