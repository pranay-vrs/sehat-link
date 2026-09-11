import React, { useState } from 'react';
import { X, Stethoscope, CheckCircle2, UserCheck, Calendar, ArrowRight } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Referral } from '../../types';

interface DoctorActionModalProps {
  referral: Referral | null;
  isOpen: boolean;
  onClose: () => void;
  onReRefer: () => void;
}

export const DoctorActionModal: React.FC<DoctorActionModalProps> = ({ 
  referral, 
  isOpen, 
  onClose,
  onReRefer
}) => {
  const { acceptReferral, markPatientArrived, recordConsultation } = useReferralStore();

  const [outcome, setOutcome] = useState<'managed_here' | 'followup_required' | 'referred_onward'>('followup_required');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('19 Sep');

  if (!isOpen || !referral) return null;

  const handleAccept = () => {
    acceptReferral(referral.id, notes || 'Referral accepted by Medical Officer.');
    onClose();
  };

  const handleMarkArrived = () => {
    markPatientArrived(referral.id);
    onClose();
  };

  const handleConsultation = () => {
    if (outcome === 'referred_onward') {
      onClose();
      onReRefer();
    } else {
      recordConsultation(referral.id, outcome, notes || 'Clinical examination concluded.', followUpDate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-sm font-bold">Doctor Action Drawer</h3>
              <p className="text-[11px] text-slate-400">
                #{referral.id} · {referral.patient.name} ({referral.patient.age}y · {referral.patient.gender})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Patient Quick Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Referral Reason:</span>
              <span className="font-bold text-slate-800">{referral.referralReason}</span>
            </div>
            {referral.vitals && (
              <div className="flex justify-between font-mono text-[11px] text-teal-900">
                <span>Vitals Recorded:</span>
                <span>BP: {referral.vitals.bp} | SpO₂: {referral.vitals.spo2} | Temp: {referral.vitals.temperature}</span>
              </div>
            )}
          </div>

          {/* Action 1: If Created -> Accept */}
          {referral.status === 'created' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-900">1. Acknowledge & Accept Referral</h4>
              <p className="text-slate-600">Reserve OPD/Doctor slot and notify frontline ASHA worker.</p>
              <button
                onClick={handleAccept}
                className="w-full py-2 bg-amber-700 text-white rounded-lg font-bold text-xs hover:bg-amber-800 shadow-sm"
              >
                Accept Incoming Referral ✓
              </button>
            </div>
          )}

          {/* Action 2: If Accepted -> Mark Arrived */}
          {referral.status === 'accepted' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <h4 className="font-bold text-blue-900">2. Verify Patient Arrival</h4>
              <p className="text-slate-600">Patient has reached the facility registration desk.</p>
              <button
                onClick={handleMarkArrived}
                className="w-full py-2 bg-blue-700 text-white rounded-lg font-bold text-xs hover:bg-blue-800 shadow-sm flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                Mark Patient Arrived at Facility
              </button>
            </div>
          )}

          {/* Action 3: If Arrived -> Record Consultation Outcome */}
          {referral.status === 'arrived' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">3. Record Consultation Assessment & Outcome</h4>
              
              <div className="space-y-2">
                <label className={`block p-2.5 rounded-xl border cursor-pointer ${
                  outcome === 'managed_here' ? 'bg-teal-50 border-teal-600 font-bold text-teal-900' : 'bg-white border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={outcome === 'managed_here'}
                    onChange={() => setOutcome('managed_here')}
                    className="mr-2 text-teal-600"
                  />
                  <span>Managed Here (Care Completed at this facility)</span>
                </label>

                <label className={`block p-2.5 rounded-xl border cursor-pointer ${
                  outcome === 'followup_required' ? 'bg-teal-50 border-teal-600 font-bold text-teal-900' : 'bg-white border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={outcome === 'followup_required'}
                    onChange={() => setOutcome('followup_required')}
                    className="mr-2 text-teal-600"
                  />
                  <span>Follow-up Required (Schedule ASHA / Clinic check)</span>
                </label>

                <label className={`block p-2.5 rounded-xl border cursor-pointer ${
                  outcome === 'referred_onward' ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-900' : 'bg-white border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={outcome === 'referred_onward'}
                    onChange={() => setOutcome('referred_onward')}
                    className="mr-2 text-indigo-600"
                  />
                  <span>Referred Onward (Escalate to District Hospital)</span>
                </label>
              </div>

              {outcome === 'followup_required' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Follow-up Due Date:</label>
                  <input
                    type="text"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    placeholder="e.g. 19 Sep"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Consultation Notes:</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter medical findings, treatment instructions, and medication compliance guidelines..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                onClick={handleConsultation}
                className="w-full py-2 bg-teal-800 text-white rounded-lg font-bold text-xs hover:bg-teal-900 shadow-md"
              >
                Submit Consultation Record ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
