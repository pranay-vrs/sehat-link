import React, { useState, useEffect } from 'react';
import { useReferralStore } from './store/referralStore';
import { LoginScreen } from './components/auth/LoginScreen';
import { AppHeader } from './components/common/AppHeader';
import { AppSidebar } from './components/common/AppSidebar';
import { OfflineBanner } from './components/common/OfflineBanner';
import { MobileNavigation } from './components/common/MobileNavigation';
import { AshaDashboard } from './components/roles/AshaDashboard';
import { DoctorDashboard } from './components/roles/DoctorDashboard';
import { AdminDashboard } from './components/roles/AdminDashboard';
import { PatientDashboard } from './components/roles/PatientDashboard';
import { NewCaseModal } from './components/modals/NewCaseModal';
import { PatientSearchModal } from './components/modals/PatientSearchModal';
import { RecordFailureModal } from './components/modals/RecordFailureModal';
import { DoctorActionModal } from './components/modals/DoctorActionModal';
import { ReReferralModal } from './components/modals/ReReferralModal';
import { Patient, Referral } from './types';
import { HeartPulse } from 'lucide-react';
import { translations } from './data/translations';

export function App() {
  const { currentUser, language } = useReferralStore();
  const t = translations[language];

  // Active navigation tab (defaults to 'home')
  const [activeTab, setActiveTab] = useState<string>('home');

  // Reset tab to 'home' whenever user session changes
  useEffect(() => {
    setActiveTab('home');
  }, [currentUser?.id]);

  // Modals state
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [preselectedPatient, setPreselectedPatient] = useState<Patient | null>(null);

  const [activeFailureReferral, setActiveFailureReferral] = useState<Referral | null>(null);
  const [isRecordFailureOpen, setIsRecordFailureOpen] = useState(false);

  const [activeDoctorReferral, setActiveDoctorReferral] = useState<Referral | null>(null);
  const [isDoctorActionOpen, setIsDoctorActionOpen] = useState(false);

  const [activeReReferral, setActiveReReferral] = useState<Referral | null>(null);
  const [isReReferralOpen, setIsReReferralOpen] = useState(false);

  const handleOpenNewCaseWithPatient = (patient: Patient) => {
    setPreselectedPatient(patient);
    setIsNewCaseOpen(true);
  };

  const handleRecordFailure = (ref: Referral) => {
    setActiveFailureReferral(ref);
    setIsRecordFailureOpen(true);
  };

  const handleResolveFailure = (ref: Referral) => {
    setActiveFailureReferral(ref);
    setIsRecordFailureOpen(true);
  };

  const handleDoctorAction = (ref: Referral) => {
    setActiveDoctorReferral(ref);
    setIsDoctorActionOpen(true);
  };

  const handleOpenReRefer = () => {
    setActiveReReferral(activeDoctorReferral);
    setIsReReferralOpen(true);
  };

  // If not authenticated, show the Login Screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Top Application Header */}
      <AppHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewCase={() => {
          setPreselectedPatient(null);
          setIsNewCaseOpen(true);
        }}
        onSearch={() => setIsSearchOpen(true)}
      />

      {/* Offline Status Simulation Banner */}
      <OfflineBanner />

      {/* Responsive Workspace Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (visible on md: and above for all authenticated roles) */}
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewCase={() => {
            setPreselectedPatient(null);
            setIsNewCaseOpen(true);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 pb-20 md:pb-8 min-w-0 overflow-x-hidden">
          {/* 1. Patient Experience */}
          {currentUser.userType === 'patient' && (
            <PatientDashboard 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}

          {/* 2. Healthcare Worker Experience */}
          {currentUser.userType === 'health_worker' && (
            currentUser.subRole === 'medical_officer' ? (
              <DoctorDashboard
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onDoctorAction={handleDoctorAction}
                onRecordFailure={handleRecordFailure}
                onResolveFailure={handleResolveFailure}
              />
            ) : (
              <AshaDashboard
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onNewCase={() => {
                  setPreselectedPatient(null);
                  setIsNewCaseOpen(true);
                }}
                onSearch={() => setIsSearchOpen(true)}
                onRecordFailure={handleRecordFailure}
                onResolveFailure={handleResolveFailure}
                onDoctorAction={handleDoctorAction}
              />
            )
          )}

          {/* 3. District Administrator Experience */}
          {currentUser.userType === 'admin' && (
            <AdminDashboard
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onRecordFailure={handleRecordFailure}
              onResolveFailure={handleResolveFailure}
            />
          )}
        </main>
      </div>

      {/* Role-Specific Mobile Bottom Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewCase={() => {
          setPreselectedPatient(null);
          setIsNewCaseOpen(true);
        }}
        onSearch={() => setIsSearchOpen(true)}
      />

      {/* MODALS */}
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        preselectedPatient={preselectedPatient}
      />

      <PatientSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPatient={handleOpenNewCaseWithPatient}
      />

      <RecordFailureModal
        isOpen={isRecordFailureOpen}
        onClose={() => setIsRecordFailureOpen(false)}
        referral={activeFailureReferral}
      />

      <DoctorActionModal
        isOpen={isDoctorActionOpen}
        onClose={() => setIsDoctorActionOpen(false)}
        referral={activeDoctorReferral}
        onReRefer={handleOpenReRefer}
      />

      <ReReferralModal
        isOpen={isReReferralOpen}
        onClose={() => setIsReReferralOpen(false)}
        referral={activeReReferral}
      />

      {/* Desktop Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <HeartPulse className="w-4 h-4 text-teal-700" />
            <span>SEHAT-LINK — Rural Healthcare Referral Continuity Platform</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Smart India Hackathon 2026 · PS 26133 · Government of Maharashtra
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
