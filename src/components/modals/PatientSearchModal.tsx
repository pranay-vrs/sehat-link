import React, { useState } from 'react';
import { X, Search, User, ArrowRight, Activity, Calendar } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Patient } from '../../types';
import { translations } from '../../data/translations';

interface PatientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export const PatientSearchModal: React.FC<PatientSearchModalProps> = ({ isOpen, onClose, onSelectPatient }) => {
  const { patients, referrals, selectReferral, language } = useReferralStore();
  const t = translations[language];
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = patients.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.phone.includes(query) ||
    (p.abhaId && p.abhaId.includes(query)) ||
    p.village.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">{t.fastPatientSearch}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.searchPatientInput}
            className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600"
            autoFocus
          />
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {results.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">{t.noMatchingPatients}</p>
          ) : (
            results.map(patient => {
              const activeRef = referrals.find(r => r.patientId === patient.id && r.status !== 'completed');
              return (
                <div 
                  key={patient.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/70 transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {patient.age}{language === 'mr' ? ' वर्षे' : language === 'hi' ? ' वर्ष' : 'y'} · {patient.gender === 'Female' ? (language === 'mr' ? 'स्त्री' : language === 'hi' ? 'महिला' : 'Female') : (language === 'mr' ? 'पुरुष' : language === 'hi' ? 'पुरुष' : 'Male')}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      📍 {patient.village}, {patient.block} · {t.mobilePhone}: {patient.phone}
                    </p>
                    {patient.abhaId && (
                      <p className="text-[10px] font-mono text-teal-800 mt-0.5">ABHA: {patient.abhaId}</p>
                    )}

                    {activeRef ? (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Activity className="w-3 h-3 text-amber-600" />
                        {t.activeReferralTag} #{activeRef.id} ({t[('status' + activeRef.status.charAt(0).toUpperCase() + activeRef.status.slice(1)) as keyof typeof t] || activeRef.status})
                      </div>
                    ) : (
                      <span className="mt-1.5 inline-block text-[10px] text-slate-400">
                        {t.noActiveReferral}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {activeRef && (
                      <button
                        onClick={() => {
                          selectReferral(activeRef.id);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold hover:bg-teal-100"
                      >
                        {t.viewJourneyBtn}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onSelectPatient(patient);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-[11px] font-bold hover:bg-teal-800"
                    >
                      {t.newReferralBtn}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
