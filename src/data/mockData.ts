import { GovtScheme, Patient, Facility, Referral, AppNotification, UserSession, FHIRMockResource } from '../types';

export const demoUsers: UserSession[] = [
  {
    id: 'USR-PAT-01',
    name: 'Rahul Kumar',
    email: 'patient@example.com',
    phone: '+91 98234 11223',
    userType: 'patient',
    roleTitle: 'Patient / Citizen',
    village: 'Kashele Village',
    block: 'Karjat',
    district: 'Raigad',
    preferredLanguage: 'en',
    abhaId: '91-4829-1029-4820',
    avatar: 'RK',
    permissions: ['view_own_care', 'view_own_records', 'contact_asha']
  },
  {
    id: 'USR-HW-01',
    name: 'Sunita Devi',
    email: 'asha@example.com',
    phone: '+91 98221 00000',
    userType: 'health_worker',
    subRole: 'asha',
    roleTitle: 'ASHA Worker (Field Care Coordinator)',
    village: 'Kashele / Sehore',
    facility: 'Sub-Centre Kashele',
    block: 'Karjat',
    district: 'Raigad',
    preferredLanguage: 'mr',
    avatar: 'SD',
    assignedPatientsCount: 38,
    permissions: ['register_patient', 'triage_patient', 'create_referral', 'record_delay', 'home_followup']
  },
  {
    id: 'USR-HW-03',
    name: 'Pooja Verma',
    email: 'anm@example.com',
    phone: '+91 98221 11222',
    userType: 'health_worker',
    subRole: 'anm',
    roleTitle: 'ANM (Auxiliary Nurse Midwife)',
    village: 'Kashele Cluster',
    facility: 'Sub-Centre Kashele',
    block: 'Karjat',
    district: 'Raigad',
    preferredLanguage: 'hi',
    avatar: 'PV',
    assignedPatientsCount: 65,
    permissions: ['register_patient', 'triage_patient', 'create_referral', 'antenatal_care', 'immunization']
  },
  {
    id: 'USR-HW-02',
    name: 'Dr. Sharma',
    email: 'doctor@example.com',
    phone: '+91 98224 55667',
    userType: 'health_worker',
    subRole: 'medical_officer',
    roleTitle: 'Medical Officer (PHC Receiving Facility)',
    facility: 'PHC Kashele',
    block: 'Karjat',
    district: 'Raigad',
    preferredLanguage: 'en',
    avatar: 'DS',
    permissions: ['accept_referral', 'mark_arrived', 'conduct_consultation', 'prescribe_meds', 'refer_onward']
  },
  {
    id: 'USR-ADM-01',
    name: 'District Health Officer',
    email: 'admin@example.com',
    phone: '+91 98220 99999',
    userType: 'admin',
    roleTitle: 'District Health Officer (Raigad / Sehore)',
    facility: 'District Health Directorate',
    district: 'Raigad',
    preferredLanguage: 'en',
    avatar: 'DH',
    permissions: ['district_surveillance', 'bottleneck_analysis', 'facility_capacity', 'export_reports', 'manage_workers']
  }
];

export const mockSchemes: GovtScheme[] = [
  {
    id: 'SCHEME-MJPJAY',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
    shortName: 'MJPJAY',
    coverageAmount: '₹5,00,000 / family / year',
    description: 'Flagship health assurance scheme of Government of Maharashtra providing comprehensive cashless secondary and tertiary hospitalization care.',
    eligibleCriteria: 'Yellow / Orange ration card holders, Antyodaya Anna Yojana, Annapurna card holders, and farmers in distressed districts.',
    benefits: [
      'Cashless hospitalisation up to ₹5 Lakhs per family per year',
      '1,356 medical & surgical procedures covered in 34 identified categories',
      'Pre-existing disease coverage from day one without waiting period',
      'Post-discharge medications included for up to 10 days'
    ],
    documentsRequired: ['Ration Card (Yellow/Orange)', 'Aadhaar Card', 'Medical Referral Slip'],
    isDemoEstimate: true
  },
  {
    id: 'SCHEME-PMJAY',
    name: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana',
    shortName: 'AB-PMJAY',
    coverageAmount: '₹5,00,000 / family / year',
    description: 'National health protection scheme providing cashless hospitalization cover for secondary and tertiary care to vulnerable bottom 40% population.',
    eligibleCriteria: 'Deprivation and occupational criteria under SECC 2011 database in rural and urban areas.',
    benefits: [
      'Cashless access to empanelled public & private hospitals nationwide',
      'Covers 3 days pre-hospitalization and 15 days post-hospitalization expenses',
      'No cap on family size, age, or gender'
    ],
    documentsRequired: ['PMJAY Golden Card / Letter', 'Aadhaar Card'],
    isDemoEstimate: true
  },
  {
    id: 'SCHEME-JSSK',
    name: 'Janani Shishu Suraksha Karyakaram',
    shortName: 'JSSK',
    coverageAmount: '100% Free Antenatal & Delivery Care',
    description: 'Entitles all pregnant women delivering in public health institutions to absolutely free and no-expense delivery including caesarean section.',
    eligibleCriteria: 'All pregnant women and sick neonates accessing public health facilities.',
    benefits: [
      'Free zero-expense institutional delivery',
      'Free drugs, consumables, and diagnostic tests',
      'Free diet during hospital stay',
      'Free transport from home to health facility and drop-back'
    ],
    documentsRequired: ['MCP Card (Mother & Child Protection Card)', 'Aadhaar Card'],
    isDemoEstimate: true
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'P-100',
    name: 'Rahul Kumar',
    age: 34,
    gender: 'Male',
    phone: '+91 98234 11223',
    abhaId: '91-4829-1029-4820',
    village: 'Kashele Village',
    block: 'Karjat',
    district: 'Raigad',
    socioeconomicCategory: 'BPL',
    eligibleSchemes: ['SCHEME-MJPJAY', 'SCHEME-PMJAY'],
    emergencyContact: 'Sunita Devi (ASHA) - +91 98221 00000',
    preferredLanguage: 'en'
  },
  {
    id: 'P-101',
    name: 'Savita Patil',
    age: 28,
    gender: 'Female',
    phone: '+91 98234 55678',
    abhaId: '91-4829-1029-4821',
    village: 'Kashele Village',
    block: 'Karjat',
    district: 'Raigad',
    socioeconomicCategory: 'BPL',
    eligibleSchemes: ['SCHEME-MJPJAY', 'SCHEME-JSSK'],
    emergencyContact: 'Ganesh Patil (Spouse) - +91 98234 55679',
    preferredLanguage: 'mr'
  },
  {
    id: 'P-102',
    name: 'Ramesh Pawar',
    age: 56,
    gender: 'Male',
    phone: '+91 98234 22334',
    abhaId: '91-7712-4432-9012',
    village: 'Pashan Wadi',
    block: 'Karjat',
    district: 'Raigad',
    socioeconomicCategory: 'Tribal / ST',
    eligibleSchemes: ['SCHEME-MJPJAY'],
    emergencyContact: 'Eknath Pawar (Son) - +91 98234 22335',
    preferredLanguage: 'mr'
  },
  {
    id: 'P-103',
    name: 'Anandi Bai',
    age: 62,
    gender: 'Female',
    phone: '+91 98234 99887',
    abhaId: '91-2341-8902-1211',
    village: 'Gaurkamat',
    block: 'Karjat',
    district: 'Raigad',
    socioeconomicCategory: 'BPL',
    eligibleSchemes: ['SCHEME-MJPJAY', 'SCHEME-PMJAY'],
    emergencyContact: 'Sunita Devi (ASHA) - +91 98221 00000',
    preferredLanguage: 'mr'
  },
  {
    id: 'P-104',
    name: 'Ganesh Shinde',
    age: 41,
    gender: 'Male',
    phone: '+91 98234 77665',
    abhaId: '91-5544-3322-1100',
    village: 'Kashele Village',
    block: 'Karjat',
    district: 'Raigad',
    socioeconomicCategory: 'APL',
    eligibleSchemes: ['SCHEME-MJPJAY'],
    emergencyContact: 'Meera Shinde (Wife) - +91 98234 77666',
    preferredLanguage: 'mr'
  },
  {
    id: 'P-105',
    name: 'Kavita Jadhav',
    age: 23,
    gender: 'Female',
    phone: '+91 98234 88776',
    abhaId: '91-6677-8899-0011',
    village: 'Wadavali',
    block: 'Karjat',
    district: 'Raigad',
    socioeconomicCategory: 'BPL',
    eligibleSchemes: ['SCHEME-JSSK', 'SCHEME-MJPJAY'],
    emergencyContact: 'Sunita Devi (ASHA) - +91 98221 00000',
    preferredLanguage: 'mr'
  }
];

export const mockFacilities: Facility[] = [
  {
    id: 'FAC-SC-01',
    name: 'Sub-Centre Kashele',
    type: 'Sub-Centre',
    distanceKm: 0.5,
    block: 'Karjat',
    district: 'Raigad',
    availableServices: ['Basic Triage', 'Maternal Screening', 'Immunization', 'First Aid', 'Rapid Diagnostic Kits'],
    isAvailable: true,
    currentLoad: 'Normal',
    empanelledSchemes: ['JSSK'],
    estimatedWaitMinutes: 10,
    isDemoData: true,
    recommendationReason: 'Nearest primary care point (walking distance)'
  },
  {
    id: 'FAC-PHC-01',
    name: 'PHC Kashele',
    type: 'PHC',
    distanceKm: 3.2,
    block: 'Karjat',
    district: 'Raigad',
    availableServices: ['General Medicine', 'MBBS Doctor OP', 'Normal Delivery Room', 'Essential Lab (CBC, Urine, Malaria)', '24x7 Ambulance Point', 'Pharmacy'],
    isAvailable: true,
    currentLoad: 'Normal',
    empanelledSchemes: ['MJPJAY', 'PMJAY', 'JSSK'],
    estimatedWaitMinutes: 25,
    isDemoData: true,
    recommendationReason: 'Recommended first-referral facility with active MBBS Medical Officer'
  },
  {
    id: 'FAC-CHC-01',
    name: 'CHC Karjat',
    type: 'CHC',
    distanceKm: 14.5,
    block: 'Karjat',
    district: 'Raigad',
    availableServices: ['General Surgery', 'Gynecology & Obstetrics', 'Pediatrics', '30-Bed Inpatient', 'X-Ray & Ultrasound', 'Emergency Stabilization'],
    isAvailable: true,
    currentLoad: 'High',
    empanelledSchemes: ['MJPJAY', 'PMJAY', 'JSSK'],
    estimatedWaitMinutes: 60,
    isDemoData: true,
    recommendationReason: 'Secondary referral hospital for specialist consultation and surgical care'
  },
  {
    id: 'FAC-SDH-01',
    name: 'Sub-District Hospital Karjat',
    type: 'Sub-District Hospital',
    distanceKm: 18.0,
    block: 'Karjat',
    district: 'Raigad',
    availableServices: ['Specialist OPD', 'Blood Storage Centre', 'Operation Theatre', '50-Bed IPD', 'Dialysis Unit', 'SNCU (Neonatal Care)'],
    isAvailable: true,
    currentLoad: 'High',
    empanelledSchemes: ['MJPJAY', 'PMJAY'],
    estimatedWaitMinutes: 45,
    isDemoData: true,
    recommendationReason: 'Equipped with dedicated obstetrics team and surgical emergency capability'
  },
  {
    id: 'FAC-DH-01',
    name: 'District Hospital Alibag',
    type: 'District Hospital',
    distanceKm: 52.0,
    block: 'Alibag',
    district: 'Raigad',
    availableServices: ['Tertiary Specialties', 'ICU / CCU', 'CT Scan & MRI', 'Full Blood Bank', 'Trauma Care Unit', 'Oncology Day Care'],
    isAvailable: true,
    currentLoad: 'Overloaded',
    empanelledSchemes: ['MJPJAY', 'PMJAY'],
    estimatedWaitMinutes: 120,
    isDemoData: true,
    recommendationReason: 'Tertiary referral centre for critical care and advanced surgical procedures'
  }
];

export const initialReferrals: Referral[] = [
  {
    id: 'SL-2026-00128',
    careThreadId: 'CT-1042',
    patientId: 'P-100',
    patient: mockPatients[0], // Rahul Kumar
    createdBy: 'ASHA Sunita Devi',
    sourceFacility: 'Sub-Centre Kashele',
    destinationFacility: 'PHC Kashele',
    priority: 'urgent',
    priorityReason: 'High fever (102.8°F) for 4 days with chest congestion and dehydration. Oxygen saturation 94%.',
    status: 'scheduled',
    scheduledTime: 'Tomorrow · 10:30 AM',
    assignedDoctor: 'Dr. Sharma',
    isAtRisk: false,
    referralReason: 'Evaluation of acute lower respiratory infection and chest auscultation',
    schemeId: 'SCHEME-MJPJAY',
    schemeName: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
    vitals: {
      temperature: '102.8 °F',
      bp: '118/78 mmHg',
      spo2: '94%',
      pulse: '104 bpm'
    },
    symptoms: ['High Grade Fever', 'Productive Cough', 'Chest Tightness', 'Fatigue'],
    symptomDuration: '4 days',
    createdAt: '10 Sep · 14:20',
    updatedAt: '11 Sep · 09:15',
    events: [
      {
        id: 'EVT-128-1',
        referralId: 'SL-2026-00128',
        stage: 'created',
        title: 'Referral Initiated by ASHA',
        description: 'ASHA Sunita Devi assessed Rahul Kumar during village health round. Protocol triage recommended immediate PHC referral.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Sub-Centre Kashele',
        timestamp: '10 Sep · 14:20'
      },
      {
        id: 'EVT-128-2',
        referralId: 'SL-2026-00128',
        stage: 'accepted',
        title: 'Referral Accepted by PHC',
        description: 'PHC Kashele verified bed slot and confirmed medical officer availability.',
        actor: 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: 'PHC Kashele',
        timestamp: '10 Sep · 16:45'
      },
      {
        id: 'EVT-128-3',
        referralId: 'SL-2026-00128',
        stage: 'scheduled',
        title: 'Consultation Appointment Scheduled',
        description: 'Priority consultation slot booked for Tomorrow · 10:30 AM with Dr. Sharma.',
        actor: 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: 'PHC Kashele',
        timestamp: '11 Sep · 09:15'
      }
    ]
  },
  {
    id: 'SL-2026-00127',
    careThreadId: 'CT-1041',
    patientId: 'P-101',
    patient: mockPatients[1], // Savita Patil
    createdBy: 'ASHA Sunita Devi',
    sourceFacility: 'Sub-Centre Kashele',
    destinationFacility: 'Sub-District Hospital Karjat',
    priority: 'urgent',
    priorityReason: 'Third trimester bleeding risk with severe gestational hypertension (BP 154/98 mmHg).',
    status: 'accepted',
    isAtRisk: true,
    atRiskReason: 'ST bus transit suspended due to river bridge submergence on Kashele-Karjat route.',
    failureReason: 'transport',
    failureNotes: 'Local state transport bus suspended after torrential rain. Patient lacks private four-wheeler transport.',
    failureTimestamp: '10 Sep · 11:30',
    failureRecordedBy: 'ASHA Sunita Devi',
    delayDuration: '2 days delayed',
    responsiblePerson: 'ASHA Sunita Devi',
    suggestedAction: 'Coordinate 108 Emergency Ambulance or Janani Express rural transport voucher.',
    referralReason: 'High-risk antenatal evaluation & specialist obstetric ultrasound',
    schemeId: 'SCHEME-JSSK',
    schemeName: 'Janani Shishu Suraksha Karyakaram (JSSK)',
    vitals: {
      temperature: '98.6 °F',
      bp: '154/98 mmHg',
      spo2: '97%',
      pulse: '88 bpm'
    },
    symptoms: ['Spotting / Bleeding Risk', 'Severe Headache', 'Bilateral Pedal Edema'],
    symptomDuration: '2 days',
    createdAt: '09 Sep · 09:40',
    updatedAt: '10 Sep · 11:30',
    events: [
      {
        id: 'EVT-127-1',
        referralId: 'SL-2026-00127',
        stage: 'created',
        title: 'Referral Initiated by ASHA',
        description: 'Identified as High-Risk Pregnancy during village ANC screening camp.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Sub-Centre Kashele',
        timestamp: '09 Sep · 09:40'
      },
      {
        id: 'EVT-127-2',
        referralId: 'SL-2026-00127',
        stage: 'accepted',
        title: 'Facility Accepted Slot',
        description: 'SDH Karjat accepted referral under JSSK zero-expense emergency entitlement.',
        actor: 'Dr. Deshmukh',
        actorRole: 'Gynecologist',
        facility: 'Sub-District Hospital Karjat',
        timestamp: '09 Sep · 11:15'
      },
      {
        id: 'EVT-127-3',
        referralId: 'SL-2026-00127',
        stage: 'at_risk',
        title: 'Referral Marked At-Risk: Transport Barrier',
        description: 'State transport bus suspended due to river bridge flooding near Kashele.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Kashele Village',
        timestamp: '10 Sep · 11:30'
      }
    ]
  },
  {
    id: 'SL-2026-00126',
    careThreadId: 'CT-1039',
    patientId: 'P-102',
    patient: mockPatients[2], // Ramesh Pawar
    createdBy: 'ASHA Sunita Devi',
    sourceFacility: 'Sub-Centre Kashele',
    destinationFacility: 'PHC Kashele',
    priority: 'routine',
    priorityReason: 'Uncontrolled type-2 diabetes mellitus with peripheral neuropathy and recurrent non-healing foot blister.',
    status: 'arrived',
    isAtRisk: false,
    referralReason: 'Diabetic foot staging and glycemic optimization',
    schemeId: 'SCHEME-MJPJAY',
    schemeName: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
    vitals: {
      temperature: '98.4 °F',
      bp: '136/84 mmHg',
      spo2: '98%',
      pulse: '76 bpm'
    },
    symptoms: ['Right Great Toe Blister', 'Numbness in Feet', 'Polyuria'],
    symptomDuration: '3 weeks',
    createdAt: '08 Sep · 10:15',
    updatedAt: '11 Sep · 09:45',
    events: [
      {
        id: 'EVT-126-1',
        referralId: 'SL-2026-00126',
        stage: 'created',
        title: 'Referral Created for Diabetic Care',
        description: 'Referral generated for diabetic ulcer management.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Sub-Centre Kashele',
        timestamp: '08 Sep · 10:15'
      },
      {
        id: 'EVT-126-2',
        referralId: 'SL-2026-00126',
        stage: 'accepted',
        title: 'PHC Kashele Confirmed Intake',
        description: 'PHC Kashele scheduled patient for diabetic OPD.',
        actor: 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: 'PHC Kashele',
        timestamp: '08 Sep · 14:00'
      },
      {
        id: 'EVT-126-3',
        referralId: 'SL-2026-00126',
        stage: 'arrived',
        title: 'Patient Checked In at Facility',
        description: 'Patient verified at PHC reception. Token #14 issued for Dr. Sharma consultation.',
        actor: 'PHC Reception Clerk',
        actorRole: 'Facility Desk',
        facility: 'PHC Kashele',
        timestamp: '11 Sep · 09:45'
      }
    ]
  },
  {
    id: 'SL-2026-00125',
    careThreadId: 'CT-1035',
    patientId: 'P-103',
    patient: mockPatients[3], // Anandi Bai
    createdBy: 'ASHA Sunita Devi',
    sourceFacility: 'Sub-Centre Kashele',
    destinationFacility: 'PHC Kashele',
    priority: 'routine',
    priorityReason: 'Grade II Knee Osteoarthritis with bilateral joint swelling and severe mobility limitation.',
    status: 'consulted',
    isAtRisk: false,
    referralReason: 'Evaluation of persistent joint stiffness and analgesia management',
    schemeId: 'SCHEME-MJPJAY',
    schemeName: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
    vitals: {
      temperature: '98.1 °F',
      bp: '142/86 mmHg',
      spo2: '97%',
      pulse: '72 bpm'
    },
    symptoms: ['Bilateral Knee Pain', 'Morning Stiffness', 'Crepitus'],
    symptomDuration: '6 months',
    createdAt: '05 Sep · 11:30',
    updatedAt: '09 Sep · 12:40',
    consultationNotes: 'Bilateral knee osteoarthritis diagnosed. Started on Tab Paracetamol 650mg SOS and Tab Calcium + Vit D3. Physiotherapy exercises demonstrated.',
    consultationOutcome: 'followup_required',
    followUpDate: '23 Sep 2026',
    followUpNotes: 'Assess pain reduction score and mobility response after 2 weeks of medication.',
    events: [
      {
        id: 'EVT-125-1',
        referralId: 'SL-2026-00125',
        stage: 'created',
        title: 'Referral Initiated by ASHA',
        description: 'Referred for chronic knee pain assessment.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Sub-Centre Kashele',
        timestamp: '05 Sep · 11:30'
      },
      {
        id: 'EVT-125-2',
        referralId: 'SL-2026-00125',
        stage: 'consulted',
        title: 'Consultation Completed by Dr. Sharma',
        description: 'Clinical examination conducted. Conservative management initiated with 14-day review.',
        actor: 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: 'PHC Kashele',
        timestamp: '09 Sep · 12:40'
      }
    ]
  },
  {
    id: 'SL-2026-00124',
    careThreadId: 'CT-1030',
    patientId: 'P-104',
    patient: mockPatients[4], // Ganesh Shinde
    createdBy: 'ASHA Sunita Devi',
    sourceFacility: 'Sub-Centre Kashele',
    destinationFacility: 'PHC Kashele',
    priority: 'routine',
    priorityReason: 'Skin rash with pruritus and secondary bacterial excoriation on bilateral forearms.',
    status: 'followup',
    isAtRisk: false,
    referralReason: 'Dermatological assessment and topical regimen prescription',
    schemeId: 'SCHEME-MJPJAY',
    schemeName: 'Mahatma Jyotirao Phule Jan Arogya Yojana',
    createdAt: '01 Sep · 10:00',
    updatedAt: '08 Sep · 15:00',
    consultationNotes: 'Diagnosed contact dermatitis. Prescribed Permethrin 5% lotion and antihistamines. Required home visit verification by ASHA.',
    consultationOutcome: 'followup_required',
    followUpDate: '12 Sep 2026',
    followUpNotes: 'ASHA Sunita Devi to verify household hygiene and complete symptom resolution during home visit.',
    isFollowUpCompleted: false,
    events: [
      {
        id: 'EVT-124-1',
        referralId: 'SL-2026-00124',
        stage: 'created',
        title: 'Referral Initiated',
        description: 'Referred for allergic skin eruption.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Sub-Centre Kashele',
        timestamp: '01 Sep · 10:00'
      },
      {
        id: 'EVT-124-2',
        referralId: 'SL-2026-00124',
        stage: 'followup',
        title: 'Home Follow-up Scheduled',
        description: 'Post-consultation follow-up assigned to ASHA Sunita Devi for Kashele village visit.',
        actor: 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: 'PHC Kashele',
        timestamp: '08 Sep · 15:00'
      }
    ]
  },
  {
    id: 'SL-2026-00120',
    careThreadId: 'CT-1022',
    patientId: 'P-105',
    patient: mockPatients[5], // Kavita Jadhav
    createdBy: 'ASHA Sunita Devi',
    sourceFacility: 'Sub-Centre Kashele',
    destinationFacility: 'PHC Kashele',
    priority: 'urgent',
    priorityReason: 'Post-partum fever on Day 5 following institutional delivery.',
    status: 'completed',
    isAtRisk: false,
    referralReason: 'Post-partum sepsis exclusion and broad-spectrum antibiotic initiation',
    schemeId: 'SCHEME-JSSK',
    schemeName: 'Janani Shishu Suraksha Karyakaram (JSSK)',
    createdAt: '24 Aug · 09:30',
    updatedAt: '02 Sep · 11:15',
    consultationNotes: 'Superficial wound infection treated. Course of oral Cefixime completed. Afebrile for 7 days.',
    consultationOutcome: 'managed_here',
    followUpDate: '02 Sep 2026',
    isFollowUpCompleted: true,
    events: [
      {
        id: 'EVT-120-1',
        referralId: 'SL-2026-00120',
        stage: 'created',
        title: 'Referral Created',
        description: 'Postnatal maternal fever.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Sub-Centre Kashele',
        timestamp: '24 Aug · 09:30'
      },
      {
        id: 'EVT-120-2',
        referralId: 'SL-2026-00120',
        stage: 'completed',
        title: 'Care Completed & Loop Closed',
        description: 'ASHA confirmed full maternal recovery during final home check. Case successfully closed.',
        actor: 'Sunita Devi',
        actorRole: 'ASHA Worker',
        facility: 'Kashele Village',
        timestamp: '02 Sep · 11:15'
      }
    ]
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'NOTIF-01',
    type: 'scheduled',
    title: 'Consultation Tomorrow at 10:30 AM',
    message: 'Rahul Kumar: Your appointment with Dr. Sharma at PHC Kashele is scheduled for tomorrow at 10:30 AM.',
    timestamp: 'Today · 09:15',
    referralId: 'SL-2026-00128',
    isRead: false,
    urgency: 'normal',
    targetRole: 'patient'
  },
  {
    id: 'NOTIF-02',
    type: 'at_risk',
    title: '⚠️ Priority Case Delayed: Savita Patil',
    message: 'Referral #SL-2026-00127 delayed 2 days. Reason: Transport disrupted (ST bus suspended due to river flood).',
    timestamp: '10 Sep · 11:30',
    referralId: 'SL-2026-00127',
    isRead: false,
    urgency: 'high',
    targetRole: 'asha'
  },
  {
    id: 'NOTIF-03',
    type: 'followup_due',
    title: 'Follow-up Due Today: Ganesh Shinde',
    message: 'Home follow-up check for contact dermatitis medication compliance is due today in Kashele Village.',
    timestamp: 'Today · 08:00',
    referralId: 'SL-2026-00124',
    isRead: false,
    urgency: 'normal',
    targetRole: 'asha'
  },
  {
    id: 'NOTIF-04',
    type: 'new_referral',
    title: 'Incoming Priority Referral',
    message: 'Rahul Kumar referred from Sub-Centre Kashele with acute chest congestion (SpO2 94%). Priority: Urgent.',
    timestamp: '10 Sep · 14:20',
    referralId: 'SL-2026-00128',
    isRead: false,
    urgency: 'high',
    targetRole: 'doctor'
  },
  {
    id: 'NOTIF-05',
    type: 'accepted',
    title: 'Patient Arrived at PHC: Ramesh Pawar',
    message: 'Ramesh Pawar checked in at reception desk for diabetic foot evaluation. Token #14 waiting in queue.',
    timestamp: 'Today · 09:45',
    referralId: 'SL-2026-00126',
    isRead: false,
    urgency: 'normal',
    targetRole: 'doctor'
  },
  {
    id: 'NOTIF-06',
    type: 'at_risk',
    title: 'District Bottleneck Alert: Transport Barriers (38%)',
    message: 'High concentration of stalled referrals in Karjat block due to monsoon transit disruption. 18 referrals at risk.',
    timestamp: 'Today · 07:30',
    isRead: false,
    urgency: 'high',
    targetRole: 'admin'
  }
];

export const mockFHIRResources: FHIRMockResource[] = [
  {
    resourceType: 'Patient',
    id: 'fhir-pat-100',
    status: 'active',
    subject: 'Rahul Kumar',
    authoredOn: '2026-09-10T14:20:00Z',
    details: {
      identifier: [{ system: 'https://healthid.ndhm.gov.in', value: '91-4829-1029-4820' }],
      name: [{ use: 'official', family: 'Kumar', given: ['Rahul'] }],
      gender: 'male',
      birthDate: '1992-04-12',
      address: [{ line: ['Kashele Village'], district: 'Raigad', state: 'Maharashtra', country: 'IN' }]
    }
  },
  {
    resourceType: 'ServiceRequest',
    id: 'fhir-req-128',
    status: 'active',
    subject: 'Patient/fhir-pat-100',
    authoredOn: '2026-09-10T14:25:00Z',
    details: {
      intent: 'order',
      category: [{ text: 'Primary to Secondary Healthcare Referral' }],
      priority: 'urgent',
      code: { coding: [{ system: 'http://snomed.info/sct', code: '306206005', display: 'Referral to Medical Officer' }] },
      requester: { display: 'Sunita Devi (ASHA Worker, Sub-Centre Kashele)' },
      performer: [{ display: 'PHC Kashele (Public Health Centre)' }],
      reasonCode: [{ text: 'High fever, chest congestion, hypoxia risk' }]
    }
  },
  {
    resourceType: 'Encounter',
    id: 'fhir-enc-128',
    status: 'planned',
    subject: 'Patient/fhir-pat-100',
    authoredOn: '2026-09-11T09:15:00Z',
    details: {
      class: { code: 'AMB', display: 'Ambulatory outpatient visit' },
      type: [{ text: 'Priority Consultation with Dr. Sharma' }],
      period: { start: '2026-09-12T10:30:00+05:30' },
      serviceProvider: { display: 'PHC Kashele' }
    }
  }
];
