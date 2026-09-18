import React, { useState } from 'react';
import { X, Network, FileCode, CheckCircle2, ShieldAlert, Copy, Check } from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { translations } from '../../data/translations';

interface InteroperabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteroperabilityModal: React.FC<InteroperabilityModalProps> = ({ isOpen, onClose }) => {
  const { mockFHIRResources, language } = useReferralStore();
  const t = translations[language];

  const [selectedResourceType, setSelectedResourceType] = useState<string>('CarePlan');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentResource = mockFHIRResources.find(r => r.resourceType === selectedResourceType) || mockFHIRResources[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(currentResource, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-500/40 text-teal-400 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'mr' ? 'FHIR / ABDM आंतरकार्यक्षमता वास्तुकला' : language === 'hi' ? 'FHIR / ABDM इंटरऑपरेबिलिटी आर्किटेक्चर' : 'FHIR / ABDM Interoperability Architecture'}
              </h3>
              <p className="text-xs text-teal-400 font-medium">
                {language === 'mr' ? 'प्रोटोटाइप मॉक एकत्रीकरण स्तर (SIH २०२६ PS-26133)' : language === 'hi' ? 'प्रोटोटाइप मॉक इंटीग्रेशन लेयर (SIH 2026 PS-26133)' : 'Prototype Mock Integration Layer (SIH 2026 PS-26133)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Alert */}
        <div className="p-4 bg-amber-950/40 border-b border-amber-900/50 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <span className="font-bold text-amber-300">{language === 'mr' ? 'प्रोटोटाइप अस्वीकरण: ' : language === 'hi' ? 'प्रोटोटाइप अस्वीकरण: ' : 'Prototype Disclaimer: '}</span>
            {language === 'mr' 
              ? 'हा डेटा स्तर HL7 FHIR R4 मानकांचे पालन करतो. पुढील टप्प्यांत राष्ट्रीय आरोग्य प्राधिकरणाच्या (NHA) ABDM M1, M2, M3 API आणि ई-संजीवनीशी थेट जोडले जाऊ शकते.' 
              : language === 'hi' 
                ? 'यह डेटा लेयर HL7 FHIR R4 विनिर्देशों का पालन करता है। भविष्य के चरणों में राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) ABDM M1, M2, और M3 एपीआई से सीधा जोड़ा जा सकता है।' 
                : 'This data layer is engineered to follow HL7 FHIR (Fast Healthcare Interoperability Resources) R4 specifications. Future phases can connect directly to National Health Authority (NHA) ABDM M1, M2, and M3 APIs and eSanjeevani gateways.'}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          {/* Architecture Mapping Diagram */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[11px] text-teal-400 font-bold uppercase tracking-wider mb-1">
              {language === 'mr' ? 'डेटा प्रवाह वास्तुकला:' : language === 'hi' ? 'डेटा प्रवाह आर्किटेक्चर:' : 'Data Flow Architecture:'}
            </div>
            <div className="text-slate-400">
              [SEHAT-LINK Continuum Layer] ➔ [FHIR Resource Transformer] ➔ [Future ABDM Gateway]
            </div>
          </div>

          {/* Resource Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {mockFHIRResources.map(r => (
              <button
                key={r.resourceType}
                onClick={() => setSelectedResourceType(r.resourceType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedResourceType === r.resourceType
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                FHIR {r.resourceType}
              </button>
            ))}
          </div>

          {/* Code Viewer Box */}
          <div className="relative rounded-2xl bg-black/80 border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-72">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans flex items-center gap-1 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'mr' ? 'कॉपी केले' : language === 'hi' ? 'कॉपी हो गया' : 'Copied') : (language === 'mr' ? 'JSON कॉपी करा' : language === 'hi' ? 'JSON कॉपी करें' : 'Copy JSON')}</span>
            </button>
            <pre className="pr-16">
              {JSON.stringify(currentResource, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {language === 'mr' ? 'मानक: HL7 FHIR रिलीज ४' : language === 'hi' ? 'मानक: HL7 FHIR रिलीज 4' : 'Standard: HL7 FHIR Release 4'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
