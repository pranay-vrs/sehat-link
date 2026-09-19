export type Role = 'asha' | 'doctor' | 'admin' | 'patient';
export type UserType = 'patient' | 'health_worker' | 'admin';
export type HealthWorkerSubRole = 'asha' | 'anm' | 'medical_officer';
export type Language = 'en' | 'mr' | 'hi';
export type Priority = 'emergency' | 'urgent' | 'routine';
export type ReferralStatus = 'created' | 'accepted' | 'scheduled' | 'arrived' | 'consulted' | 'followup' | 'completed';

export type FailureReason = 
  | 'transport'
  | 'capacity'
  | 'appointment'
  | 'unreachable'
  | 'service_unavailable'
  | 'waiting_time'
  | 'other';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  subRole?: HealthWorkerSubRole;
  roleTitle: string;
  village?: string;
  facility?: string;
  block?: string;
  district: string;
  preferredLanguage: Language;
  abhaId?: string;
  phone?: string;
  avatar?: string;
  assignedPatientsCount?: number;
  permissions?: string[];
}

export interface GovtScheme {
  id: string;
  name: string;
  shortName: string;
  coverageAmount: string;
  description: string;
  eligibleCriteria: string;
  benefits: string[];
  documentsRequired: string[];
  isDemoEstimate?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  abhaId?: string;
  village: string;
  block: string;
  district: string;
  socioeconomicCategory: 'BPL' | 'APL' | 'Tribal / ST' | 'SC' | 'General';
  eligibleSchemes: string[];
  emergencyContact?: string;
  preferredLanguage?: Language;
}

export interface ReferralEvent {
  id: string;
  referralId: string;
  stage: ReferralStatus | 'at_risk' | 'at_risk_resolved' | 're_referred';
  title: string;
  description: string;
  actor: string;
  actorRole: string;
  facility: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface Referral {
  id: string;
  careThreadId: string;
  patientId: string;
  patient: Patient;
  createdBy: string;
  sourceFacility: string;
  destinationFacility: string;
  priority: Priority;
  priorityReason: string;
  status: ReferralStatus;
  isAtRisk: boolean;
  atRiskReason?: string;
  failureReason?: FailureReason;
  failureNotes?: string;
  failureTimestamp?: string;
  failureRecordedBy?: string;
  delayDuration?: string;
  referralReason: string;
  schemeId?: string;
  schemeName?: string;
  vitals?: {
    temperature?: string;
    bp?: string;
    spo2?: string;
    pulse?: string;
  };
  symptoms?: string[];
  symptomDuration?: string;
  scheduledTime?: string;
  assignedDoctor?: string;
  createdAt: string;
  updatedAt: string;
  events: ReferralEvent[];
  consultationNotes?: string;
  consultationOutcome?: 'managed_here' | 'followup_required' | 'referred_onward';
  followUpDate?: string;
  followUpNotes?: string;
  isFollowUpCompleted?: boolean;
  parentReferralId?: string;
  childReferralIds?: string[];
  suggestedAction?: string;
  responsiblePerson?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Sub-Centre' | 'PHC' | 'CHC' | 'Sub-District Hospital' | 'District Hospital';
  distanceKm: number;
  block: string;
  district: string;
  availableServices: string[];
  isAvailable: boolean;
  currentLoad: 'Normal' | 'High' | 'Overloaded';
  empanelledSchemes: string[];
  estimatedWaitMinutes?: number;
  isDemoData?: boolean;
  recommendationReason?: string;
}

export interface AppNotification {
  id: string;
  type: 'new_referral' | 'accepted' | 'scheduled' | 'at_risk' | 'followup_due' | 'completed';
  title: string;
  message: string;
  timestamp: string;
  referralId?: string;
  isRead: boolean;
  urgency: 'high' | 'normal';
  targetRole?: 'patient' | 'asha' | 'doctor' | 'admin' | 'all';
}

export interface SyncAction {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface FHIRMockResource {
  resourceType: 'Patient' | 'ServiceRequest' | 'Encounter' | 'Condition' | 'CarePlan';
  id: string;
  status: string;
  subject: string;
  authoredOn: string;
  details: Record<string, any>;
}
