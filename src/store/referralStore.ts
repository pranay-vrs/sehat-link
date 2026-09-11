import { useState, useEffect } from 'react';
import { 
  Role, 
  UserType,
  HealthWorkerSubRole,
  UserSession,
  Language, 
  Referral, 
  Patient, 
  Facility, 
  GovtScheme, 
  AppNotification, 
  SyncAction, 
  FailureReason, 
  Priority,
  ReferralStatus 
} from '../types';
import { 
  demoUsers,
  mockSchemes, 
  mockFacilities, 
  mockPatients, 
  initialReferrals, 
  initialNotifications,
  mockFHIRResources
} from '../data/mockData';

const STORAGE_KEY = 'sehat_link_state_v3';

interface StateData {
  currentUser: UserSession | null;
  role: Role;
  language: Language;
  isOffline: boolean;
  syncQueue: SyncAction[];
  referrals: Referral[];
  patients: Patient[];
  notifications: AppNotification[];
  selectedReferralId: string | null;
  selectedBottleneckReason: FailureReason | null;
}

const loadInitialState = (): StateData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        currentUser: parsed.currentUser !== undefined ? parsed.currentUser : demoUsers[1], // default Sunita Devi ASHA
        role: parsed.role || 'asha',
        language: parsed.language || (parsed.currentUser?.preferredLanguage || 'en'),
        isOffline: Boolean(parsed.isOffline),
        syncQueue: parsed.syncQueue || [],
        referrals: parsed.referrals || initialReferrals,
        patients: parsed.patients || mockPatients,
        notifications: parsed.notifications || initialNotifications,
        selectedReferralId: parsed.selectedReferralId || 'SL-2026-00128',
        selectedBottleneckReason: parsed.selectedBottleneckReason || null
      };
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  return {
    currentUser: demoUsers[1], // Sunita Devi ASHA default
    role: 'asha',
    language: 'en',
    isOffline: false,
    syncQueue: [],
    referrals: initialReferrals,
    patients: mockPatients,
    notifications: initialNotifications,
    selectedReferralId: 'SL-2026-00128',
    selectedBottleneckReason: null
  };
};

let globalState = loadInitialState();
const listeners = new Set<() => void>();

const notify = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
  } catch (e) {
    console.error('Error persisting state:', e);
  }
  listeners.forEach(l => l());
};

export const useReferralStore = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const formatTimestamp = () => {
    const now = new Date();
    const day = now.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${day} ${month} · ${hours}:${mins}`;
  };

  // Auth Actions
  const login = (user: UserSession) => {
    globalState.currentUser = user;
    globalState.language = user.preferredLanguage || 'en';
    
    if (user.userType === 'patient') {
      globalState.role = 'patient';
    } else if (user.userType === 'admin') {
      globalState.role = 'admin';
    } else if (user.userType === 'health_worker') {
      globalState.role = user.subRole === 'medical_officer' ? 'doctor' : 'asha';
    }
    
    notify();
  };

  const logout = () => {
    globalState.currentUser = null;
    notify();
  };

  const setLanguage = (language: Language) => {
    globalState.language = language;
    if (globalState.currentUser) {
      globalState.currentUser.preferredLanguage = language;
    }
    notify();
  };

  const setSelectedBottleneckReason = (reason: FailureReason | null) => {
    globalState.selectedBottleneckReason = reason;
    notify();
  };

  const toggleOffline = () => {
    globalState.isOffline = !globalState.isOffline;
    if (!globalState.isOffline && globalState.syncQueue.length > 0) {
      const syncCount = globalState.syncQueue.length;
      setTimeout(() => {
        globalState.syncQueue = [];
        globalState.notifications.unshift({
          id: `NOTIF-${Date.now()}`,
          type: 'accepted',
          title: 'Back Online & Synced ✅',
          message: `${syncCount} offline updates reconciled with the district health registry.`,
          timestamp: formatTimestamp(),
          isRead: false,
          urgency: 'normal',
          targetRole: 'all'
        });
        notify();
      }, 700);
    }
    notify();
  };

  const syncPendingActions = () => {
    if (globalState.isOffline) return;
    const syncCount = globalState.syncQueue.length;
    globalState.syncQueue = [];
    globalState.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      type: 'accepted',
      title: 'Manual Sync Succeeded',
      message: `${syncCount || 'All'} pending offline records synced with Maharashtra health registry.`,
      timestamp: formatTimestamp(),
      isRead: false,
      urgency: 'normal',
      targetRole: 'all'
    });
    notify();
  };

  const selectReferral = (id: string | null) => {
    globalState.selectedReferralId = id;
    notify();
  };

  // Create Referral (Care Thread)
  const createReferral = (data: {
    patientId: string;
    patient?: Patient;
    sourceFacility: string;
    destinationFacility: string;
    priority: Priority;
    priorityReason: string;
    referralReason: string;
    schemeId?: string;
    schemeName?: string;
    vitals?: { temperature?: string; bp?: string; spo2?: string; pulse?: string };
    symptoms?: string[];
    symptomDuration?: string;
  }): Referral => {
    const timestamp = formatTimestamp();
    const count = globalState.referrals.length + 131;
    const newId = `SL-2026-${String(count).padStart(5, '0')}`;
    const newCareThreadId = `CT-${1040 + globalState.referrals.length + 1}`;

    let patient = data.patient;
    if (!patient) {
      patient = globalState.patients.find(p => p.id === data.patientId)!;
    } else if (!globalState.patients.some(p => p.id === patient.id)) {
      globalState.patients.unshift(patient);
    }

    const creatorName = globalState.currentUser?.name || 'Sunita Devi';

    const newReferral: Referral = {
      id: newId,
      careThreadId: newCareThreadId,
      patientId: patient.id,
      patient: patient,
      createdBy: creatorName,
      sourceFacility: data.sourceFacility,
      destinationFacility: data.destinationFacility,
      priority: data.priority,
      priorityReason: data.priorityReason,
      status: 'created',
      isAtRisk: false,
      referralReason: data.referralReason,
      schemeId: data.schemeId || 'SCHEME-MJPJAY',
      schemeName: data.schemeName || 'Mahatma Jyotirao Phule Jan Arogya Yojana',
      vitals: data.vitals,
      symptoms: data.symptoms,
      symptomDuration: data.symptomDuration,
      createdAt: timestamp,
      updatedAt: timestamp,
      events: [
        {
          id: `EVT-${Date.now()}`,
          referralId: newId,
          stage: 'created',
          title: 'Care Thread & Referral Created',
          description: `Referral initiated by ${creatorName}. Target: ${data.destinationFacility}. Scheme: ${data.schemeName || 'MJPJAY'}.`,
          actor: creatorName,
          actorRole: 'ASHA Worker',
          facility: data.sourceFacility,
          timestamp: timestamp
        }
      ]
    };

    globalState.referrals.unshift(newReferral);
    globalState.selectedReferralId = newId;

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'CREATE_REFERRAL',
        description: `Created Care Thread #${newCareThreadId} (${newId}) for ${patient.name}`,
        timestamp: timestamp
      });
    }

    globalState.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      type: 'new_referral',
      title: `Referral Created: #${newId}`,
      message: `${patient.name} (${data.priority.toUpperCase()}) referred to ${data.destinationFacility}.`,
      timestamp: timestamp,
      referralId: newId,
      isRead: false,
      urgency: data.priority === 'urgent' ? 'high' : 'normal',
      targetRole: 'doctor'
    });

    notify();
    return newReferral;
  };

  // Facility Doctor Accepts Referral
  const acceptReferral = (referralId: string, notes?: string) => {
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.status = 'accepted';
    ref.updatedAt = timestamp;
    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'accepted',
      title: 'Facility Accepted Referral',
      description: notes || `Referral slot and bed reservation confirmed at ${ref.destinationFacility}.`,
      actor: globalState.currentUser?.name || 'Dr. Sharma',
      actorRole: 'Medical Officer',
      facility: ref.destinationFacility,
      timestamp: timestamp
    });

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'ACCEPT_REFERRAL',
        description: `Accepted Referral #${ref.id}`,
        timestamp: timestamp
      });
    }

    globalState.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      type: 'accepted',
      title: `Referral Accepted: #${ref.id}`,
      message: `${ref.destinationFacility} accepted care for ${ref.patient.name}.`,
      timestamp: timestamp,
      referralId: ref.id,
      isRead: false,
      urgency: 'normal',
      targetRole: 'asha'
    });

    notify();
  };

  // Schedule Appointment for Referral
  const scheduleReferral = (referralId: string, scheduledTime?: string, notes?: string) => {
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.status = 'scheduled';
    ref.scheduledTime = scheduledTime || 'Tomorrow · 10:30 AM';
    ref.assignedDoctor = ref.assignedDoctor || 'Dr. Sharma';
    ref.updatedAt = timestamp;
    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'scheduled',
      title: 'Consultation Appointment Scheduled',
      description: notes || `Appointment confirmed for ${ref.scheduledTime} with ${ref.assignedDoctor}.`,
      actor: globalState.currentUser?.name || 'Dr. Sharma',
      actorRole: 'Medical Officer',
      facility: ref.destinationFacility,
      timestamp: timestamp
    });

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'SCHEDULE_REFERRAL',
        description: `Scheduled Referral #${ref.id}`,
        timestamp: timestamp
      });
    }

    globalState.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      type: 'scheduled',
      title: `Appointment Scheduled: #${ref.id}`,
      message: `Appointment set for ${ref.patient.name} on ${ref.scheduledTime}.`,
      timestamp: timestamp,
      referralId: ref.id,
      isRead: false,
      urgency: 'normal',
      targetRole: 'patient'
    });

    notify();
  };

  // Mark Patient Arrived
  const markPatientArrived = (referralId: string) => {
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.status = 'arrived';
    ref.updatedAt = timestamp;
    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'arrived',
      title: 'Patient Arrived at Facility',
      description: `Patient arrived at ${ref.destinationFacility}. Check-in verified.`,
      actor: globalState.currentUser?.name || 'Facility Reception',
      actorRole: 'Facility Desk',
      facility: ref.destinationFacility,
      timestamp: timestamp
    });

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'MARK_ARRIVED',
        description: `Marked ${ref.patient.name} arrived at ${ref.destinationFacility}`,
        timestamp: timestamp
      });
    }

    notify();
  };

  // Complete Consultation
  const completeConsultation = (
    referralId: string, 
    arg2: any,
    arg3?: any,
    followUpDate?: string,
    followUpNotes?: string
  ) => {
    let outcome: 'managed_here' | 'followup_required' | 'referred_onward' = 'managed_here';
    let notes = '';
    if (['managed_here', 'followup_required', 'referred_onward'].includes(arg2)) {
      outcome = arg2;
      notes = typeof arg3 === 'string' ? arg3 : '';
    } else {
      notes = typeof arg2 === 'string' ? arg2 : '';
      outcome = ['managed_here', 'followup_required', 'referred_onward'].includes(arg3) ? arg3 : 'managed_here';
    }
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.status = outcome === 'followup_required' ? 'followup' : (outcome === 'managed_here' ? 'completed' : 'consulted');
    ref.consultationNotes = notes;
    ref.consultationOutcome = outcome;
    ref.followUpDate = followUpDate;
    ref.followUpNotes = followUpNotes;
    ref.updatedAt = timestamp;

    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'consulted',
      title: 'Consultation Completed',
      description: notes,
      actor: globalState.currentUser?.name || 'Dr. Sharma',
      actorRole: 'Medical Officer',
      facility: ref.destinationFacility,
      timestamp: timestamp
    });

    if (outcome === 'followup_required') {
      ref.events.push({
        id: `EVT-${Date.now() + 1}`,
        referralId: ref.id,
        stage: 'followup',
        title: 'Home Follow-up Mandated',
        description: `Follow-up due: ${followUpDate || 'Within 7 days'}. Instructions: ${followUpNotes || 'Assess recovery.'}`,
        actor: globalState.currentUser?.name || 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: ref.destinationFacility,
        timestamp: timestamp
      });

      globalState.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        type: 'followup_due',
        title: `Follow-up Due: ${ref.patient.name}`,
        message: `Field visit scheduled for ${followUpDate || 'next week'}. ${followUpNotes || ''}`,
        timestamp: timestamp,
        referralId: ref.id,
        isRead: false,
        urgency: 'normal',
        targetRole: 'asha'
      });
    } else if (outcome === 'managed_here') {
      ref.events.push({
        id: `EVT-${Date.now() + 2}`,
        referralId: ref.id,
        stage: 'completed',
        title: 'Care Loop Completed',
        description: 'Treatment successful. No further intervention required.',
        actor: globalState.currentUser?.name || 'Dr. Sharma',
        actorRole: 'Medical Officer',
        facility: ref.destinationFacility,
        timestamp: timestamp
      });
    }

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'CONSULTATION_COMPLETE',
        description: `Consultation logged for ${ref.patient.name}`,
        timestamp: timestamp
      });
    }

    notify();
  };

  // Record At-Risk / Operational Failure Reason
  const recordFailureReason = (
    referralId: string, 
    reason: FailureReason, 
    notes: string,
    suggestedAction?: string
  ) => {
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.isAtRisk = true;
    ref.failureReason = reason;
    ref.failureNotes = notes;
    ref.failureTimestamp = timestamp;
    ref.failureRecordedBy = globalState.currentUser?.name || 'Sunita Devi (ASHA)';
    ref.delayDuration = 'Delayed in Transit';
    ref.suggestedAction = suggestedAction || 'Coordinate local transport or arrange home verification.';
    ref.responsiblePerson = globalState.currentUser?.name || 'Sunita Devi';
    ref.updatedAt = timestamp;

    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'at_risk',
      title: `Care At Risk: ${reason.toUpperCase()}`,
      description: notes,
      actor: globalState.currentUser?.name || 'Sunita Devi',
      actorRole: 'ASHA Worker',
      facility: ref.sourceFacility,
      timestamp: timestamp,
      metadata: { reason, suggestedAction: ref.suggestedAction }
    });

    globalState.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      type: 'at_risk',
      title: `⚠️ Referral Stalled: ${ref.patient.name}`,
      message: `Issue: ${notes}`,
      timestamp: timestamp,
      referralId: ref.id,
      isRead: false,
      urgency: 'high',
      targetRole: 'asha'
    });

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'RECORD_FAILURE',
        description: `Logged delay issue (${reason}) for ${ref.patient.name}`,
        timestamp: timestamp
      });
    }

    notify();
  };

  // Resolve Failure Reason
  const resolveFailureReason = (referralId: string, resolutionNotes: string) => {
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.isAtRisk = false;
    ref.failureNotes = undefined;
    ref.failureReason = undefined;
    ref.delayDuration = undefined;
    ref.updatedAt = timestamp;

    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'at_risk_resolved',
      title: 'Operational Issue Resolved',
      description: resolutionNotes,
      actor: globalState.currentUser?.name || 'Sunita Devi',
      actorRole: 'Care Coordinator',
      facility: ref.sourceFacility,
      timestamp: timestamp
    });

    if (globalState.isOffline) {
      globalState.syncQueue.push({
        id: `SYNC-${Date.now()}`,
        action: 'RESOLVE_FAILURE',
        description: `Resolved bottleneck for ${ref.patient.name}`,
        timestamp: timestamp
      });
    }

    notify();
  };

  // Mark Follow-Up Completed
  const completeFollowUp = (referralId: string, notes: string) => {
    const timestamp = formatTimestamp();
    const ref = globalState.referrals.find(r => r.id === referralId);
    if (!ref) return;

    ref.status = 'completed';
    ref.isFollowUpCompleted = true;
    ref.updatedAt = timestamp;

    ref.events.push({
      id: `EVT-${Date.now()}`,
      referralId: ref.id,
      stage: 'completed',
      title: 'Home Follow-up Verified & Loop Closed',
      description: notes || 'ASHA verified medication adherence and full symptom resolution.',
      actor: globalState.currentUser?.name || 'Sunita Devi',
      actorRole: 'ASHA Worker',
      facility: 'Patient Home',
      timestamp: timestamp
    });

    notify();
  };

  // Re-Refer (Upward Referral)
  const reReferPatient = (
    originalReferralId: string, 
    newDestinationFacility: string, 
    reason: string,
    priority: Priority
  ): Referral | undefined => {
    const timestamp = formatTimestamp();
    const originalRef = globalState.referrals.find(r => r.id === originalReferralId);
    if (!originalRef) return undefined;

    const count = globalState.referrals.length + 132;
    const newId = `SL-2026-${String(count).padStart(5, '0')}`;

    const childReferral: Referral = {
      id: newId,
      careThreadId: originalRef.careThreadId,
      patientId: originalRef.patientId,
      patient: originalRef.patient,
      createdBy: globalState.currentUser?.name || 'Dr. Sharma',
      sourceFacility: originalRef.destinationFacility,
      destinationFacility: newDestinationFacility,
      priority: priority,
      priorityReason: reason,
      status: 'created',
      isAtRisk: false,
      referralReason: reason,
      schemeId: originalRef.schemeId,
      schemeName: originalRef.schemeName,
      vitals: originalRef.vitals,
      symptoms: originalRef.symptoms,
      createdAt: timestamp,
      updatedAt: timestamp,
      parentReferralId: originalRef.id,
      events: [
        {
          id: `EVT-${Date.now()}`,
          referralId: newId,
          stage: 're_referred',
          title: `Care Escalated to ${newDestinationFacility}`,
          description: `Second-tier referral created by ${globalState.currentUser?.name || 'Dr. Sharma'}. Reason: ${reason}.`,
          actor: globalState.currentUser?.name || 'Dr. Sharma',
          actorRole: 'Medical Officer',
          facility: originalRef.destinationFacility,
          timestamp: timestamp
        }
      ]
    };

    if (!originalRef.childReferralIds) originalRef.childReferralIds = [];
    originalRef.childReferralIds.push(newId);
    originalRef.status = 'consulted';
    originalRef.consultationOutcome = 'referred_onward';

    globalState.referrals.unshift(childReferral);
    globalState.selectedReferralId = newId;

    notify();
    return childReferral;
  };

  // Add New Patient
  const addPatient = (patientData: Omit<Patient, 'id'>): Patient => {
    const newId = `P-${100 + globalState.patients.length + 1}`;
    const newPatient: Patient = {
      id: newId,
      ...patientData
    };
    globalState.patients.unshift(newPatient);
    notify();
    return newPatient;
  };

  const markNotificationAsRead = (notifId: string) => {
    const n = globalState.notifications.find(x => x.id === notifId);
    if (n) {
      n.isRead = true;
      notify();
    }
  };

  const markAllNotificationsAsRead = () => {
    globalState.notifications.forEach(n => n.isRead = true);
    notify();
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    globalState = {
      currentUser: demoUsers[1],
      role: 'asha',
      language: 'en',
      isOffline: false,
      syncQueue: [],
      referrals: initialReferrals,
      patients: mockPatients,
      notifications: initialNotifications,
      selectedReferralId: 'SL-2026-00128',
      selectedBottleneckReason: null
    };
    notify();
  };

  // Scoped views for RBAC
  const getScopedReferrals = (): Referral[] => {
    const user = globalState.currentUser;
    if (!user) return [];

    if (user.userType === 'patient') {
      return globalState.referrals.filter(r => 
        r.patient.name.toLowerCase() === user.name.toLowerCase() ||
        r.patient.abhaId === user.abhaId ||
        r.patientId === 'P-100'
      );
    }

    if (user.userType === 'health_worker') {
      if (user.subRole === 'medical_officer') {
        return globalState.referrals.filter(r => 
          r.destinationFacility.toLowerCase().includes('phc') ||
          r.assignedDoctor?.toLowerCase() === user.name.toLowerCase()
        );
      } else {
        // ASHA / ANM
        return globalState.referrals.filter(r => 
          r.createdBy.toLowerCase().includes('sunita') ||
          r.sourceFacility.toLowerCase().includes('sub-centre') ||
          r.patient.village.toLowerCase().includes('kashele')
        );
      }
    }

    // Admin sees all
    return globalState.referrals;
  };

  const getScopedNotifications = (): AppNotification[] => {
    const user = globalState.currentUser;
    if (!user) return [];

    return globalState.notifications.filter(n => {
      if (!n.targetRole || n.targetRole === 'all') return true;
      if (user.userType === 'patient' && n.targetRole === 'patient') return true;
      if (user.userType === 'admin' && n.targetRole === 'admin') return true;
      if (user.userType === 'health_worker') {
        if (user.subRole === 'medical_officer' && n.targetRole === 'doctor') return true;
        if (user.subRole !== 'medical_officer' && n.targetRole === 'asha') return true;
      }
      return false;
    });
  };

  const activeReferral = globalState.referrals.find(r => r.id === globalState.selectedReferralId) || globalState.referrals[0];

  return {
    currentUser: globalState.currentUser,
    role: globalState.role,
    language: globalState.language,
    isOffline: globalState.isOffline,
    syncQueue: globalState.syncQueue,
    referrals: globalState.referrals,
    patients: globalState.patients,
    notifications: globalState.notifications,
    selectedReferralId: globalState.selectedReferralId,
    activeReferral,
    selectedBottleneckReason: globalState.selectedBottleneckReason,
    schemes: mockSchemes,
    facilities: mockFacilities,
    fhirResources: mockFHIRResources,
    mockFHIRResources: mockFHIRResources,
    demoUsers,
    
    // Actions
    login,
    logout,
    setLanguage,
    setSelectedBottleneckReason,
    toggleOffline,
    syncPendingActions,
    selectReferral,
    createReferral,
    acceptReferral,
    scheduleReferral,
    markPatientArrived,
    completeConsultation,
    recordConsultation: completeConsultation,
    recordFailureReason,
    resolveFailureReason,
    resolveFailure: resolveFailureReason,
    markNotificationRead: markNotificationAsRead,
    completeFollowUp,
    reReferPatient,
    addPatient,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetToDefault,
    getScopedReferrals,
    getScopedNotifications
  };
};
