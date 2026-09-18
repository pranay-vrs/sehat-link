import React, { useState } from 'react';
import { 
  X, 
  User, 
  FileText, 
  Activity, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Info,
  Check,
  HeartPulse,
  Flame,
  Baby,
  ActivitySquare,
  Bandage,
  Stethoscope
} from 'lucide-react';
import { useReferralStore } from '../../store/referralStore';
import { Patient, Priority, Facility, GovtScheme, Language } from '../../types';
import { translations } from '../../data/translations';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatient?: Patient | null;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, preselectedPatient }) => {
  const { patients, facilities, schemes, createReferral, isOffline, language } = useReferralStore();
  const t = translations[language];

  const [step, setStep] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preselectedPatient || null);

  // New Patient Registration
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newPhone, setNewPhone] = useState('');
  const [newVillage, setNewVillage] = useState('Kashele');
  const [newAbha, setNewAbha] = useState('');
  const [newCategory, setNewCategory] = useState<'BPL' | 'APL' | 'Tribal / ST' | 'SC' | 'General'>('BPL');

  // Step 3: What is the Problem?
  const [selectedProblem, setSelectedProblem] = useState<string>('Fever');
  const [otherProblemDescription, setOtherProblemDescription] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>(['Fever > 3 days']);
  const [symptomDuration, setSymptomDuration] = useState('3 days');

  // Step 4: Vitals if available
  const [temp, setTemp] = useState('101.2°F');
  const [bp, setBp] = useState('136/84');
  const [spo2, setSpo2] = useState('95%');
  const [pulse, setPulse] = useState('88');

  // Step 5: Scheme match
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('SCHEME-MJPJAY');

  // Step 6: Care Choice & Facility
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('FAC-PHC-01');

  // Result
  const [createdReferralResult, setCreatedReferralResult] = useState<{ id: string; careThreadId: string } | null>(null);

  if (!isOpen) return null;

  // Rule-based triage evaluation (transparent rationale, zero autonomous AI)
  const isUrgent = 
    selectedProblem === 'Breathing' ||
    symptoms.some(s => s.includes('Chest') || s.includes('Breath') || s.includes('High BP')) ||
    parseInt(spo2) < 94 ||
    (selectedProblem === 'Pregnancy' && bp.includes('15') || bp.includes('16'));

  const priority: Priority = isUrgent ? 'urgent' : 'routine';
  const priorityReason = isUrgent
    ? 'Urgent priority flagged: Elevated vitals or acute distress indicators present requiring timely Medical Officer evaluation.'
    : 'Routine priority: Standard primary health center clinical consultation.';

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    (p.abhaId && p.abhaId.includes(searchQuery))
  );

  const problemOptions = [
    { key: 'Breathing', label: t.problemBreathing, icon: Activity, tone: 'text-red-700 bg-red-50 border-red-200' },
    { key: 'Fever', label: t.problemFever, icon: Flame, tone: 'text-orange-700 bg-orange-50 border-orange-200' },
    { key: 'Pregnancy', label: t.problemPregnancy, icon: Baby, tone: 'text-pink-700 bg-pink-50 border-pink-200' },
    { key: 'Diabetes', label: t.problemDiabetes, icon: ActivitySquare, tone: 'text-blue-700 bg-blue-50 border-blue-200' },
    { key: 'Injury', label: t.problemInjury, icon: Bandage, tone: 'text-amber-700 bg-amber-50 border-amber-200' },
    { key: 'Other', label: t.problemOther, icon: Stethoscope, tone: 'text-teal-700 bg-teal-50 border-teal-200' }
  ];

  const handleRegisterAndNext = () => {
    if (isRegisteringNew) {
      const newP: Patient = {
        id: `P-${Date.now()}`,
        name: newName || 'New Patient',
        age: parseInt(newAge) || 30,
        gender: newGender,
        phone: newPhone || '+91 98000 00000',
        village: newVillage,
        block: 'Karjat',
        district: 'Raigad',
        socioeconomicCategory: newCategory,
        abhaId: newAbha || '91-0000-0000-0000',
        eligibleSchemes: ['SCHEME-MJPJAY']
      };
      setSelectedPatient(newP);
    }
    setStep(3); // Go to Problem selection
  };

  const handleCreateReferral = () => {
    if (!selectedPatient) return;

    const chosenFacility = facilities.find(f => f.id === selectedFacilityId) || facilities[1];
    const chosenScheme = schemes.find(s => s.id === selectedSchemeId);

    const problemDisplay = selectedProblem === 'Other' && otherProblemDescription.trim()
      ? `Other (${otherProblemDescription.trim()})`
      : selectedProblem;

    const ref = createReferral({
      patientId: selectedPatient.id,
      patient: selectedPatient,
      sourceFacility: 'Sub-Centre Kashele',
      destinationFacility: chosenFacility.name,
      priority: priority,
      priorityReason: priorityReason,
      referralReason: `${problemDisplay}: Persistent clinical signs. Duration: ${symptomDuration}.`,
      schemeId: selectedSchemeId,
      schemeName: chosenScheme?.name,
      vitals: {
        temperature: temp,
        bp: bp,
        spo2: spo2,
        pulse: pulse
      },
      symptoms: [problemDisplay, ...symptoms],
      symptomDuration: symptomDuration
    });

    setCreatedReferralResult({ id: ref.id, careThreadId: ref.careThreadId });
    setStep(7); // Show Confirmation
  };

  const resetForm = () => {
    setStep(1);
    setSelectedPatient(null);
    setIsRegisteringNew(false);
    setSelectedProblem('Fever');
    setOtherProblemDescription('');
    setCreatedReferralResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full text-slate-900 shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              SL
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {step === 7 ? t.createdSuccess : t.newCase}
              </h3>
              <p className="text-[11px] text-teal-300">
                {language === 'mr' ? 'संदर्भ सातत्य प्रक्रिया • उपकेंद्र काशेल' : language === 'hi' ? 'रेफरल निरंतरता प्रक्रिया • उप-केंद्र काशेल' : 'Care Continuity Initiation • Sub-Centre Kashele'}
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        {step < 7 && (
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>{language === 'mr' ? `टप्पा ${step} / ६: ` : language === 'hi' ? `चरण ${step} / ६: ` : `Step ${step} of 6: `}{
              step === 1 ? t.step1FindPatient :
              step === 2 ? t.step2BasicDetails :
              step === 3 ? t.step3Problem :
              step === 4 ? t.step4Vitals :
              step === 5 ? t.step5Triage :
              t.step6CareChoice
            }</span>
            <span className="font-mono text-teal-800">{Math.round((step / 6) * 100)}%</span>
          </div>
        )}

        {/* WIZARD STEPS */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* STEP 1: FIND OR REGISTER PATIENT */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.searchVillageRegistry}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegisteringNew(!isRegisteringNew)}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  {isRegisteringNew ? t.backToSearch : t.quickRegisterNew}
                </button>
              </div>

              {!isRegisteringNew ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {filteredPatients.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPatient(p);
                          setStep(3); // Proceed to problem
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedPatient?.id === p.id
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{p.name}</span>
                            <span className="text-[11px] text-slate-500">({p.age}{language === 'mr' ? ' वर्षे' : language === 'hi' ? ' वर्ष' : 'y'}, {p.gender === 'Female' ? (language === 'mr' ? 'स्त्री' : language === 'hi' ? 'महिला' : 'Female') : (language === 'mr' ? 'पुरुष' : language === 'hi' ? 'पुरुष' : 'Male')})</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                              {p.village}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {p.phone} · ABHA: {p.abhaId}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-teal-700">{t.selectBtn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* QUICK REGISTER FORM */
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-900">{t.newCitizenDetails}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.fullName}</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g., Savita Patil"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.age}</label>
                        <input
                          type="number"
                          value={newAge}
                          onChange={(e) => setNewAge(e.target.value)}
                          placeholder="26"
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.gender}</label>
                        <select
                          value={newGender}
                          onChange={(e) => setNewGender(e.target.value as any)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                        >
                          <option value="Female">{language === 'mr' ? 'स्त्री' : language === 'hi' ? 'महिला' : 'Female'}</option>
                          <option value="Male">{language === 'mr' ? 'पुरुष' : language === 'hi' ? 'पुरुष' : 'Male'}</option>
                          <option value="Other">{language === 'mr' ? 'इतर' : language === 'hi' ? 'अन्य' : 'Other'}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.mobilePhone}</label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+91 98234 11223"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.village}</label>
                      <input
                        type="text"
                        value={newVillage}
                        onChange={(e) => setNewVillage(e.target.value)}
                        placeholder="Kashele"
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegisterAndNext}
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs mt-2"
                  >
                    {t.saveAndContinueAssessment}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: WHAT IS THE PROBLEM? */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t.thPatient}: <strong className="text-slate-900">{selectedPatient?.name}</strong>
                  </h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {t.primaryHealthProblemQ}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {problemOptions.map(p => {
                  const Icon = p.icon;
                  const isSelected = selectedProblem === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelectedProblem(p.key)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[90px] ${
                        isSelected 
                          ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-200' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-teal-700' : 'text-slate-500'}`} />
                      <span className={`text-xs font-bold mt-2 ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedProblem === 'Other' && (
                <div className="space-y-1.5 p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                      <span>{t.describeHealthIssue}</span>
                    </label>
                    <span className="text-[10px] font-medium text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                      {t.ashaFieldNotes}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={otherProblemDescription}
                    onChange={(e) => setOtherProblemDescription(e.target.value)}
                    placeholder={t.describeProblemPlaceholder}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-200 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 resize-none transition-all outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t.howLongExperienced}
                </label>
                <input
                  type="text"
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  placeholder="e.g. 3 days"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <span>{t.nextVitals}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VITALS IF AVAILABLE */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.vitalsTitle}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.vitalsDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">{t.bpLabel}</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">{t.spo2Label}</label>
                  <input
                    type="text"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="98%"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">{t.tempLabel}</label>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="98.6°F"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">{t.pulseLabel}</label>
                  <input
                    type="text"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="78"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-5 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <span>{t.nextTriage}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RULE-BASED TRIAGE & SCHEME CHECK */}
          {step === 5 && (
            <div className="space-y-4 text-xs">
              {/* Triage Rationale Box */}
              <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                priority === 'urgent' ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase tracking-wider text-xs ${
                    priority === 'urgent' ? 'text-red-900' : 'text-emerald-900'
                  }`}>
                    {priority === 'urgent' ? t.urgentPriorityBadge : t.routinePriorityBadge}
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold border">
                    {t.ruleBasedClinicalSupport}
                  </span>
                </div>
                <p className="font-semibold text-slate-900">
                  {priority === 'urgent' 
                    ? (language === 'mr' ? 'तातडीचे प्राधान्य: शरीराची लक्षणे चिंताजनक आहेत, तात्काळ वैद्यकीय अधिकाऱ्यांची तपासणी आवश्यक आहे.' : language === 'hi' ? 'तत्काल प्राथमिकता: शारीरिक लक्षण चिंताजनक हैं, तत्काल चिकित्सा अधिकारी द्वारा जांच आवश्यक है।' : priorityReason)
                    : (language === 'mr' ? 'सामान्य प्राधान्य: प्राथमिक आरोग्य केंद्रातील नियमित तपासणी.' : language === 'hi' ? 'सामान्य प्राथमिकता: प्राथमिक स्वास्थ्य केंद्र में नियमित जांच।' : priorityReason)}
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  <Info className="w-3 h-3 inline mr-1" />
                  {t.triageDisclaimer}
                </p>
              </div>

              {/* Scheme Potential Match Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>{t.schemePotentialMatch}</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded font-bold">
                    MJPJAY
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  {language === 'mr' 
                    ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना: रुग्णालय व शस्त्रक्रियेसाठी ₹५,००,००० पर्यंत कॅशलेस उपचार.' 
                    : language === 'hi' 
                      ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना: अस्पताल और सर्जरी के लिए ₹5,00,000 तक कैशलेस सुविधा।' 
                      : 'Mahatma Jyotirao Phule Jan Arogya Yojana: Potential cashless coverage up to ₹5,00,000 for hospital bed & surgery.'}
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  {t.schemeDisclaimer}
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="px-5 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <span>{t.nextSelectFacility}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: FACILITY MATCHING WITH "WHY THIS FACILITY?" */}
          {step === 6 && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.destinationFacilityMatching}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.facilityMatchingDesc}
                </p>
              </div>

              <div className="space-y-2.5">
                {facilities.filter(f => f.type !== 'Sub-Centre').map(f => {
                  const isSelected = selectedFacilityId === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFacilityId(f.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                          <h5 className="font-bold text-slate-900 text-xs">{f.name}</h5>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {f.type}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-teal-800">
                          {f.distanceKm} km
                        </span>
                      </div>

                      {f.recommendationReason && (
                        <div className="mt-2 p-2 bg-teal-100/50 rounded-xl text-[11px] text-teal-900 font-medium">
                          <strong>{t.whyRecommended} </strong> {f.recommendationReason}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={handleCreateReferral}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {t.createReferral} ➔
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: SUCCESS CONFIRMATION SCREEN */}
          {step === 7 && createdReferralResult && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {t.createdSuccess}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {t.referralLiveNotice}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.thPatient}:</span>
                  <span className="font-bold text-slate-900">{selectedPatient?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.referralIdLabel}</span>
                  <span className="font-mono font-bold text-teal-900">#{createdReferralResult.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.careThreadIdLabel}</span>
                  <span className="font-mono font-bold text-teal-900">#{createdReferralResult.careThreadId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.thPriority}:</span>
                  <span className={`font-bold ${priority === 'urgent' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {priority === 'urgent' ? t.urgent : t.routine}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                {t.viewInReferralJourney}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
