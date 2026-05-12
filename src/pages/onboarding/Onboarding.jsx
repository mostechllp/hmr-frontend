import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiCheck } from "react-icons/fi";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import Stepper from "./Stepper";
import ResumeUpload from "./ResumeUpload";
import EmployeeDetailsForm from "./EmployeeDetailsForm";
import OfferLetterPreview from "./OfferLetterPreview";
import OnboardingReview from "./OnboardingReview";
import { resetOnboarding } from "../../store/slices/onboardingSlice";

const Onboarding = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const onboardingState = useSelector((state) => state.onboarding) || {};
  const { currentStep = 1, onboardingComplete = false } = onboardingState;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onboardingComplete) {
      const timer = setTimeout(() => {
        dispatch(resetOnboarding());
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [onboardingComplete, dispatch]);

  const SuccessView = () => (
    <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
      <div className="w-32 h-32 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <FiCheck size={64} strokeWidth={3} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Submitted Successfully!</h2>
      <p className="text-gray-500 dark:text-gray-400 font-medium">Redirecting you back to onboarding...</p>
    </div>
  );

  const renderStep = () => {
    if (onboardingComplete) return <SuccessView />;
    
    switch (currentStep) {
      case 1:
        return <ResumeUpload />;
      case 2:
        return <EmployeeDetailsForm />;
      case 3:
        return <OfferLetterPreview />;
      case 4:
        return <OnboardingReview />;
      default:
        return <ResumeUpload />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 min-w-0 ${!isMobile ? "md:ml-[72px]" : ""}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Employee Onboarding
              </h1>
              {!onboardingComplete && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  AI-powered workflow to streamline new hire integration.
                </p>
              )}
            </div>
          </div>

          {/* Stepper Navigation - Hidden on Success */}
          {!onboardingComplete && (
            <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft">
              <Stepper currentStep={currentStep} />
            </div>
          )}

          {/* Step Content */}
          <div className="relative">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Onboarding;
