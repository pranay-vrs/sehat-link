import React, { useState } from 'react';
import { X, Building2, ArrowRight, CornerDownRight } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Referral, Priority } from '../../types';
import { translations } from '../../data/translations';

interface ReReferralModalProps {
  referral: Referral | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReReferralModal: React.FC<ReReferralModalProps> = ({ referral, isOpen, onClose }) => {
  const { facilities, reReferPatient, language } = useReferralStore();
  const t = translations[language];

  const [destinationId, setDestinationId] = useState<string>('FAC-05');
  const [reason, setReason] = useState(
    language === 'mr' 
      ? 'प्राथमिक आरोग्य केंद्रात उपलब्ध नसलेल्या विशेष तज्ज्ञ शस्त्रक्रिया उपचारांची आवश्यकता आहे.' 
      : language === 'hi' 
        ? 'प्राथमिक स्वास्थ्य केंद्र पर अनुपलब्ध विशेषज्ञ तृतीयक सर्जिकल मूल्यांकन की आवश्यकता है।' 
        : 'Requires specialized tertiary surgical assessment not available at primary health centre.'
  );
  const [priority, setPriority] = useState<Priority>('urgent');

  if (!isOpen || !referral) return null;

  const handleConfirm = () => {
    reReferPatient(referral.id, destinationId, reason, priority);
    onClose();
  };

  const higherFacilities = facilities.filter(f => f.type === 'CHC' || f.type === 'Sub-District Hospital' || f.type === 'District Hospital');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-indigo-900 text-white flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-2">
            <CornerDownRight className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold">{t.reReferTitle}</h3>
              <p className="text-[11px] text-indigo-200">
                {t.preservingHistory} #{referral.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
            <p className="font-bold text-indigo-950">{t.thPatient}: {referral.patient.name} ({referral.patient.age}y · {referral.patient.gender})</p>
            <p className="text-slate-600">{t.currentFacilityLabel} <strong>{referral.destinationFacility}</strong></p>
            <p className="text-[11px] text-indigo-800 font-mono">{t.linkedChildReferral} #{referral.id}-R1</p>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">{t.selectHigherFacility}</label>
            <div className="space-y-2">
              {higherFacilities.map(f => (
                <label
                  key={f.id}
                  className={`block p-2.5 rounded-xl border cursor-pointer ${
                    destinationId === f.id ? 'bg-indigo-50 border-indigo-600 font-bold text-indigo-950' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="nextFacility"
                        checked={destinationId === f.id}
                        onChange={() => setDestinationId(f.id)}
                        className="text-indigo-600"
                      />
                      <span>{f.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{f.distanceKm} km</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">{t.escalationPriority}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPriority('urgent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  priority === 'urgent' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {t.priorityUrgentBadge}
              </button>
              <button
                type="button"
                onClick={() => setPriority('routine')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  priority === 'routine' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {t.priorityRoutineBadge}
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">{t.escalationReason}</label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 shadow-md"
          >
            {t.confirmReReferral}
          </button>
        </div>
      </div>
    </div>
  );
};
