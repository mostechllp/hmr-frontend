import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { showToast } from '../components/common/Toast';
import { addEmployee } from '../store/slices/employeeSlice';

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: 'John Doe',
    organization: 'THESAY',
    designation: 'Software Engineer',
    gender: 'Male',
    specialDays: '15 May',
    company: 'THESAY',
    department: 'IT',
    employeeId: 'EMP001',
    dob: '1990-05-15',
    leaveAllocation: '30',
    joiningDate: '2024-01-01',
    
    // Step 2: Passport Details
    passportFullName: 'John Doe',
    passportNumber: 'A12345678',
    passportIssued: '2020-01-01',
    passportExpiry: '2030-01-01',
    fatherName: 'Robert Doe',
    motherName: 'Jane Doe',
    address: 'Dubai, UAE',
    issuedFrom: 'Dubai, UAE',
    placeOfBirth: 'Dubai',
    
    // Step 3: Visa & Labor
    visaNumber: 'VISA123456',
    visaIssued: '2024-01-01',
    visaExpiry: '2026-01-01',
    laborNumber: 'LAB987654',
    laborIssued: '2024-01-01',
    laborExpiry: '2026-01-01',
    
    // Step 4: EID
    eidNumber: '784-2024-1234567-8',
    eidIssued: '2024-02-01',
    eidExpiry: '2029-02-01',
    
    // Step 5: Contact & Others
    dependents: '0',
    companyEmail: 'john@thesay.ae',
    personalNumber: '+971501234567',
    personalEmail: 'john@gmail.com',
    otherNumber: '+971502345678',
  });

  const steps = [
    { number: 1, title: 'Basic Info', icon: 'fas fa-user-circle' },
    { number: 2, title: 'Passport', icon: 'fas fa-passport' },
    { number: 3, title: 'Visa & Labor', icon: 'fas fa-file-contract' },
    { number: 4, title: 'EID', icon: 'fas fa-id-card' },
    { number: 5, title: 'Contact & Others', icon: 'fas fa-address-card' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName) {
      showToast('Full name is required', 'error');
      return;
    }
    if (!formData.employeeId) {
      showToast('Employee ID is required', 'error');
      return;
    }
    
    setLoading(true);
    
    // Prepare employee data
    const employeeData = {
      name: formData.fullName,
      organization: formData.organization,
      designation: formData.designation,
      gender: formData.gender,
      company: formData.company,
      department: formData.department,
      employeeId: formData.employeeId,
      dob: formData.dob,
      joiningDate: formData.joiningDate,
      leaveAllocation: formData.leaveAllocation,
      passportNumber: formData.passportNumber,
      passportExpiry: formData.passportExpiry,
      visaNumber: formData.visaNumber,
      visaExpiry: formData.visaExpiry,
      eidNumber: formData.eidNumber,
      companyEmail: formData.companyEmail,
      personalEmail: formData.personalEmail,
      personalNumber: formData.personalNumber,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    
    const result = await dispatch(addEmployee(employeeData));
    setLoading(false);
    
    if (addEmployee.fulfilled.match(result)) {
      showToast(`✓ Employee "${formData.fullName}" added successfully!`, 'success');
      setTimeout(() => {
        navigate('/employees');
      }, 1200);
    } else {
      showToast('Failed to add employee', 'error');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div className="form-section-title mb-6">
              <i className="fas fa-user-circle text-green-500 mr-2"></i>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-user text-green-500 mr-1"></i> Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-building text-green-500 mr-1"></i> Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-briefcase text-green-500 mr-1"></i> Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter designation"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-venus-mars text-green-500 mr-1"></i> Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-gift text-green-500 mr-1"></i> Special Days
                </label>
                <input
                  type="text"
                  id="specialDays"
                  value={formData.specialDays}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Birthday / Anniversary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-building text-green-500 mr-1"></i> Company *
                </label>
                <select
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="THESAY">THESAY</option>
                  <option value="Tech Corp">Tech Corp</option>
                  <option value="Innovate Ltd">Innovate Ltd</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-diagram-project text-green-500 mr-1"></i> Department
                </label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-id-card text-green-500 mr-1"></i> Employee ID
                </label>
                <input
                  type="text"
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar text-green-500 mr-1"></i> Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-week text-green-500 mr-1"></i> Leave Allocation (Days)
                </label>
                <input
                  type="number"
                  id="leaveAllocation"
                  value={formData.leaveAllocation}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-alt text-green-500 mr-1"></i> Joining Date
                </label>
                <input
                  type="date"
                  id="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div>
            <div className="form-section-title mb-6">
              <i className="fas fa-passport text-green-500 mr-2"></i>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Passport Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-user-tag text-green-500 mr-1"></i> Passport Full Name
                </label>
                <input
                  type="text"
                  id="passportFullName"
                  value={formData.passportFullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter name as per passport"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-hashtag text-green-500 mr-1"></i> Passport Number
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter passport number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Issued Date
                </label>
                <input
                  type="date"
                  id="passportIssued"
                  value={formData.passportIssued}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Expiry Date
                </label>
                <input
                  type="date"
                  id="passportExpiry"
                  value={formData.passportExpiry}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-father text-green-500 mr-1"></i> Father's Name
                </label>
                <input
                  type="text"
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter father's name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-mother text-green-500 mr-1"></i> Mother's Name
                </label>
                <input
                  type="text"
                  id="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter mother's name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-map-marker-alt text-green-500 mr-1"></i> Address
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="form-input"
                  placeholder="Enter full address"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-globe text-green-500 mr-1"></i> Issued From
                </label>
                <input
                  type="text"
                  id="issuedFrom"
                  value={formData.issuedFrom}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter issuing country/city"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-map-pin text-green-500 mr-1"></i> Place of Birth
                </label>
                <input
                  type="text"
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter place of birth"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="form-section-title mb-6">
              <i className="fas fa-file-contract text-green-500 mr-2"></i>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Visa & Labor Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-id-card text-green-500 mr-1"></i> Visa Number
                </label>
                <input
                  type="text"
                  id="visaNumber"
                  value={formData.visaNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Visa Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Visa Issued Date
                </label>
                <input
                  type="date"
                  id="visaIssued"
                  value={formData.visaIssued}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Visa Expiry Date
                </label>
                <input
                  type="date"
                  id="visaExpiry"
                  value={formData.visaExpiry}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-briefcase text-green-500 mr-1"></i> Labor Number
                </label>
                <input
                  type="text"
                  id="laborNumber"
                  value={formData.laborNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter Labor Number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Labor Issued Date
                </label>
                <input
                  type="date"
                  id="laborIssued"
                  value={formData.laborIssued}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Labor Expiry Date
                </label>
                <input
                  type="date"
                  id="laborExpiry"
                  value={formData.laborExpiry}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <div className="form-section-title mb-6">
              <i className="fas fa-id-card text-green-500 mr-2"></i>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Emirates ID (EID)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-qrcode text-green-500 mr-1"></i> EID Number
                </label>
                <input
                  type="text"
                  id="eidNumber"
                  value={formData.eidNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter EID number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Issued Date
                </label>
                <input
                  type="date"
                  id="eidIssued"
                  value={formData.eidIssued}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Expiry Date
                </label>
                <input
                  type="date"
                  id="eidExpiry"
                  value={formData.eidExpiry}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <div className="form-section-title mb-6">
              <i className="fas fa-address-card text-green-500 mr-2"></i>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Contact Information & Others</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-users text-green-500 mr-1"></i> Dependents
                </label>
                <select
                  id="dependents"
                  value={formData.dependents}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-envelope text-green-500 mr-1"></i> Company Email
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-phone text-green-500 mr-1"></i> Personal Number
                </label>
                <input
                  type="tel"
                  id="personalNumber"
                  value={formData.personalNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter personal phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-envelope text-green-500 mr-1"></i> Personal Email
                </label>
                <input
                  type="email"
                  id="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="name@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-phone-alt text-green-500 mr-1"></i> Other Number
                </label>
                <input
                  type="tel"
                  id="otherNumber"
                  value={formData.otherNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter alternate number"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6 max-w-5xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link to="/employees" className="text-green-500 hover:text-green-600 font-medium">Employees</Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-gray-500 dark:text-gray-400">Add Employee</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              <i className="fas fa-user-plus mr-2"></i> Add New Employee
            </h2>
          </div>

          {/* Step Indicator */}
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 mb-8">
            {steps.map((step, index) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  currentStep === index
                    ? 'bg-green-500 text-white shadow-md'
                    : index < currentStep
                    ? 'text-green-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <i className={`${step.icon} mr-1`}></i>
                {step.number}. {step.title}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8 shadow-soft">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                  >
                    <i className="fas fa-arrow-left"></i> Previous
                  </button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 ml-auto"
                  >
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 ml-auto disabled:opacity-70"
                  >
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                    ) : (
                      <><i className="fas fa-save"></i> Save Employee</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEmployee;