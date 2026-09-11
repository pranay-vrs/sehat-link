import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { FailureReason, Referral } from '../../types';

interface RecordFailureModalProps {
  referral: Referral | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecordFailureModal: React.FC<RecordFailureModalProps> = ({ referral, isOpen, onClose }) => {
  const { recordFailureReason, resolveFailure } = useReferralStore();
  const [selectedReason, setSelectedReason] = useState<FailureReason>('transport');
  const [notes, setNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  if (!isOpen || !referral) return null;

  const failureOptions: { key: FailureReason; label: string; desc: string }[] = [
    { key: 'transport', label: 'Transport Unavailable / Road Obstacle', desc: 'No ambulance/ST bus, flooding, high cost.' },
    { key: 'capacity', label: 'Facility Capacity / Bed Shortage', desc: 'No vacant beds in ICU/ward at destination.' },
    { key: 'appointment', label: 'Specialist Unavailable / Slot Full', desc: 'Required doctor on leave or OPD quota exceeded.' },
    { key: 'unreachable', label: 'Patient Unreachable / Family Barrier', desc: 'Phone switched off, daily wage loss fear.' },
    { key: 'service_unavailable', label: 'Diagnostic / Drug Unavailable', desc: 'Ultrasound/X-ray or specialized drug not in stock.' },
    { key: 'waiting_time', label: 'Extreme Waiting Time / Overcrowded', desc: 'Patient left due to > 4 hour waiting delay.' },
    { key: 'other', label: 'Other Logistical Barrier', desc: 'Documented field impediment.' }
  ];

  const handleSave = () => {
    if (isResolving) {
      resolveFailure(referral.id, notes || 'Intervention conducted. Barrier resolved.');
    } else {
      recordFailureReason(referral.id, selectedReason, notes || 'Operational delay noted.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div className={`px-5 py-3.5 text-white flex items-center justify-between ${
          isResolving ? 'bg-emerald-800' : 'bg-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-bold">
                {isResolving ? 'Resolve At-Risk Stalled Referral' : 'Log Operational Failure Reason (At Risk)'}
              </h3>
              <p className="text-[11px] text-red-200">
                Referral #{referral.id} · {referral.patient.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {referral.isAtRisk && (
            <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl">
              <span className="text-slate-600 font-semibold">Action Mode:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setIsResolving(false)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${!isResolving ? 'bg-red-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Update Failure
                </button>
                <button
                  type="button"
                  onClick={() => setIsResolving(true)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${isResolving ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'}`}
                >
                  Mark Resolved ✓
                </button>
              </div>
            </div>
          )}

          {!isResolving ? (
            <div>
              <label className="font-bold text-slate-800 block mb-2">
                Why is this referral stalled? (Select operational root cause):
              </label>
              <div className="space-y-2">
                {failureOptions.map(opt => (
                  <label
                    key={opt.key}
                    className={`block p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedReason === opt.key 
                        ? 'bg-red-50 border-red-500 font-semibold text-red-950' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="failureReason"
                        value={opt.key}
                        checked={selectedReason === opt.key}
                        onChange={() => setSelectedReason(opt.key)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{opt.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 ml-5 mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
              <p className="font-bold">Resolving At-Risk Exception</p>
              <p className="text-[11px] mt-0.5">This will clear the active warning and resume care coordination tracking.</p>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Field Action Notes / Resolution Details:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={isResolving ? "Describe how issue was solved (e.g., ASHA arranged 108 ambulance, patient reached facility)..." : "Add operational context (e.g. Bus strike on Karjat route, patient promised to visit tomorrow)..."}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-red-500 text-xs"
            />
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm ${
              isResolving ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-700 hover:bg-red-800'
            }`}
          >
            {isResolving ? 'Confirm Resolved ✓' : 'Save At-Risk Exception'}
          </button>
        </div>
      </div>
    </div>
  );
};
