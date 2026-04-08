import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { showToast } from '../components/common/Toast';
import { addEmployee } from '../store/slices/employeeSlice';

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch organizations and designations from slices (assuming you have these slices)
  const { organizations = [] } = useSelector((state) => state.organizations || {});
  const { designations = [] } = useSelector((state) => state.designations || {});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
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
      roles: 'Employee',
      privileges: 'employee',
    },
  });

  // Watch values for cross-validation
  const passportIssued = watch('passportIssued');
  const passportExpiry = watch('passportExpiry');
  const visaIssued = watch('visaIssued');
  const visaExpiry = watch('visaExpiry');
  const laborIssued = watch('laborIssued');
  const laborExpiry = watch('laborExpiry');
  const eidIssued = watch('eidIssued');
  const eidExpiry = watch('eidExpiry');

  const steps = [
    { number: 1, title: 'Basic Info', icon: 'fas fa-user-circle' },
    { number: 2, title: 'Passport', icon: 'fas fa-passport' },
    { number: 3, title: 'Visa & Labor', icon: 'fas fa-file-contract' },
    { number: 4, title: 'EID', icon: 'fas fa-id-card' },
    { number: 5, title: 'Contact & Others', icon: 'fas fa-address-card' },
  ];

  const roleOptions = [
    'Admin',
    'Subadmin',
    'Manager',
    'Employee',
    'Driver',
  ];

  const privilegeOptions = [
    'admin',
    'manager',
    'employee',
    'driver',
    'field_employee',
    'remote_employee',
  ];

  // Validation rules
  const validationRules = {
    fullName: {
      required: 'Full name is required',
      minLength: {
        value: 2,
        message: 'Full name must be at least 2 characters',
      },
      maxLength: {
        value: 100,
        message: 'Full name must not exceed 100 characters',
      },
    },
    employeeId: {
      required: 'Employee ID is required',
      pattern: {
        value: /^[A-Za-z0-9]{3,20}$/,
        message: 'Employee ID must be 3-20 alphanumeric characters',
      },
    },
    organization: {
      required: 'Organization is required',
    },
    designation: {
      required: 'Designation is required',
    },
    companyEmail: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address format',
      },
    },
    personalEmail: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address format',
      },
    },
    personalNumber: {
      pattern: {
        value: /^\+?[1-9]\d{7,14}$/,
        message: 'Invalid phone number format',
      },
    },
    passportNumber: {
      pattern: {
        value: /^[A-Z0-9]{6,20}$/,
        message: 'Passport number must be 6-20 alphanumeric characters',
      },
    },
    visaNumber: {
      pattern: {
        value: /^[A-Z0-9]{6,20}$/,
        message: 'Visa number must be 6-20 alphanumeric characters',
      },
    },
    eidNumber: {
      pattern: {
        value: /^\d{3}-\d{4}-\d{7}-\d{1}$/,
        message: 'Invalid EID format (e.g., 784-2024-1234567-8)',
      },
    },
    leaveAllocation: {
      min: {
        value: 0,
        message: 'Leave allocation cannot be negative',
      },
      max: {
        value: 365,
        message: 'Leave allocation cannot exceed 365 days',
      },
    },
    joiningDate: {
      validate: (value) => {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const joinDate = new Date(value);
        if (joinDate > today) {
          return 'Joining date cannot be in the future';
        }
        return true;
      },
    },
    dob: {
      validate: (value) => {
        if (!value) return true;
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          return 'Employee must be at least 18 years old';
        }
        if (age > 80) {
          return 'Invalid date of birth';
        }
        return true;
      },
    },
  };

  // Date validation functions
  const validateIssueDate = (issueDate, expiryDate, fieldName) => {
    if (!issueDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const issue = new Date(issueDate);
    
    if (issue > today) {
      return `${fieldName} cannot be in the future`;
    }
    
    if (expiryDate && issue >= new Date(expiryDate)) {
      return `Issued date must be before expiry date`;
    }
    
    return true;
  };

  const validateExpiryDate = (expiryDate, issueDate, fieldName) => {
    if (!expiryDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    
    if (expiry < today) {
      return `${fieldName} cannot be in the past`;
    }
    
    if (issueDate && expiry <= new Date(issueDate)) {
      return `Expiry date must be after issued date`;
    }
    
    return true;
  };

  const handleNext = async () => {
    // Validate fields in current step
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['fullName', 'employeeId', 'organization', 'designation', 'joiningDate', 'dob'];
        break;
      case 1:
        fieldsToValidate = ['passportIssued', 'passportExpiry'];
        break;
      case 2:
        fieldsToValidate = ['visaIssued', 'visaExpiry', 'laborIssued', 'laborExpiry'];
        break;
      case 3:
        fieldsToValidate = ['eidIssued', 'eidExpiry', 'eidNumber'];
        break;
      case 4:
        fieldsToValidate = ['companyEmail', 'personalEmail', 'personalNumber', 'roles', 'privileges'];
        break;
      default:
        fieldsToValidate = [];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Please fix the errors before proceeding', 'error');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Prepare employee data
    const employeeData = {
      name: data.fullName,
      organization: data.organization,
      designation: data.designation,
      gender: data.gender,
      company: data.company,
      department: data.department,
      employeeId: data.employeeId,
      dob: data.dob,
      joiningDate: data.joiningDate,
      leaveAllocation: data.leaveAllocation,
      passportNumber: data.passportNumber,
      passportExpiry: data.passportExpiry,
      visaNumber: data.visaNumber,
      visaExpiry: data.visaExpiry,
      eidNumber: data.eidNumber,
      companyEmail: data.companyEmail,
      personalEmail: data.personalEmail,
      personalNumber: data.personalNumber,
      roles: data.roles,
      privileges: data.privileges,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    
    const result = await dispatch(addEmployee(employeeData));
    setLoading(false);
    
    if (addEmployee.fulfilled.match(result)) {
      showToast(`✓ Employee "${data.fullName}" added successfully!`, 'success');
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
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-user-circle text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-user text-green-500 mr-1"></i> Full Name *
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={validationRules.fullName}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-building text-green-500 mr-1"></i> Organization *
                </label>
                <Controller
                  name="organization"
                  control={control}
                  rules={validationRules.organization}
                  render={({ field }) => (
                    <>
                      <select
                        {...field}
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.organization
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      >
                        <option value="">Select Organization</option>
                        {organizations.length > 0 ? (
                          organizations.map((org) => (
                            <option key={org.id || org} value={org.name || org}>
                              {org.name || org}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="THESAY">THESAY</option>
                            <option value="Tech Corp">Tech Corp</option>
                            <option value="Innovate Ltd">Innovate Ltd</option>
                          </>
                        )}
                      </select>
                      {errors.organization && (
                        <p className="mt-1 text-xs text-red-500">{errors.organization.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-briefcase text-green-500 mr-1"></i> Designation *
                </label>
                <Controller
                  name="designation"
                  control={control}
                  rules={validationRules.designation}
                  render={({ field }) => (
                    <>
                      <select
                        {...field}
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.designation
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      >
                        <option value="">Select Designation</option>
                        {designations.length > 0 ? (
                          designations.map((desig) => (
                            <option key={desig.id || desig} value={desig.name || desig}>
                              {desig.name || desig}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Software Engineer">Software Engineer</option>
                            <option value="Senior Software Engineer">Senior Software Engineer</option>
                            <option value="Team Lead">Team Lead</option>
                            <option value="Project Manager">Project Manager</option>
                          </>
                        )}
                      </select>
                      {errors.designation && (
                        <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-venus-mars text-green-500 mr-1"></i> Gender
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-gift text-green-500 mr-1"></i> Special Days
                </label>
                <Controller
                  name="specialDays"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="e.g. Birthday / Anniversary"
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-building text-green-500 mr-1"></i> Company *
                </label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    >
                      <option value="THESAY">THESAY</option>
                      <option value="Tech Corp">Tech Corp</option>
                      <option value="Innovate Ltd">Innovate Ltd</option>
                    </select>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-diagram-project text-green-500 mr-1"></i> Department
                </label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    >
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-id-card text-green-500 mr-1"></i> Employee ID *
                </label>
                <Controller
                  name="employeeId"
                  control={control}
                  rules={validationRules.employeeId}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.employeeId
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="Enter employee ID"
                      />
                      {errors.employeeId && (
                        <p className="mt-1 text-xs text-red-500">{errors.employeeId.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar text-green-500 mr-1"></i> Date of Birth
                </label>
                <Controller
                  name="dob"
                  control={control}
                  rules={validationRules.dob}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.dob
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.dob && (
                        <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-week text-green-500 mr-1"></i> Leave Allocation (Days)
                </label>
                <Controller
                  name="leaveAllocation"
                  control={control}
                  rules={validationRules.leaveAllocation}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="number"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.leaveAllocation
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.leaveAllocation && (
                        <p className="mt-1 text-xs text-red-500">{errors.leaveAllocation.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-alt text-green-500 mr-1"></i> Joining Date
                </label>
                <Controller
                  name="joiningDate"
                  control={control}
                  rules={validationRules.joiningDate}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.joiningDate
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.joiningDate && (
                        <p className="mt-1 text-xs text-red-500">{errors.joiningDate.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-passport text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Passport Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-user-tag text-green-500 mr-1"></i> Passport Full Name
                </label>
                <Controller
                  name="passportFullName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter name as per passport"
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-hashtag text-green-500 mr-1"></i> Passport Number
                </label>
                <Controller
                  name="passportNumber"
                  control={control}
                  rules={validationRules.passportNumber}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.passportNumber
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="Enter passport number"
                      />
                      {errors.passportNumber && (
                        <p className="mt-1 text-xs text-red-500">{errors.passportNumber.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Issued Date
                </label>
                <Controller
                  name="passportIssued"
                  control={control}
                  rules={{
                    validate: (value) => validateIssueDate(value, passportExpiry, 'Passport issued date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.passportIssued
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.passportIssued && (
                        <p className="mt-1 text-xs text-red-500">{errors.passportIssued.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Expiry Date
                </label>
                <Controller
                  name="passportExpiry"
                  control={control}
                  rules={{
                    validate: (value) => validateExpiryDate(value, passportIssued, 'Passport expiry date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.passportExpiry
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.passportExpiry && (
                        <p className="mt-1 text-xs text-red-500">{errors.passportExpiry.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-father text-green-500 mr-1"></i> Father's Name
                </label>
                <Controller
                  name="fatherName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter father's name"
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-mother text-green-500 mr-1"></i> Mother's Name
                </label>
                <Controller
                  name="motherName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter mother's name"
                    />
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-map-marker-alt text-green-500 mr-1"></i> Address
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows="2"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter full address"
                    ></textarea>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-globe text-green-500 mr-1"></i> Issued From
                </label>
                <Controller
                  name="issuedFrom"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter issuing country/city"
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-map-pin text-green-500 mr-1"></i> Place of Birth
                </label>
                <Controller
                  name="placeOfBirth"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter place of birth"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-file-contract text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Visa & Labor Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-id-card text-green-500 mr-1"></i> Visa Number
                </label>
                <Controller
                  name="visaNumber"
                  control={control}
                  rules={validationRules.visaNumber}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.visaNumber
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="Enter Visa Number"
                      />
                      {errors.visaNumber && (
                        <p className="mt-1 text-xs text-red-500">{errors.visaNumber.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Visa Issued Date
                </label>
                <Controller
                  name="visaIssued"
                  control={control}
                  rules={{
                    validate: (value) => validateIssueDate(value, visaExpiry, 'Visa issued date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.visaIssued
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.visaIssued && (
                        <p className="mt-1 text-xs text-red-500">{errors.visaIssued.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Visa Expiry Date
                </label>
                <Controller
                  name="visaExpiry"
                  control={control}
                  rules={{
                    validate: (value) => validateExpiryDate(value, visaIssued, 'Visa expiry date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.visaExpiry
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.visaExpiry && (
                        <p className="mt-1 text-xs text-red-500">{errors.visaExpiry.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-briefcase text-green-500 mr-1"></i> Labor Number
                </label>
                <Controller
                  name="laborNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter Labor Number"
                    />
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Labor Issued Date
                </label>
                <Controller
                  name="laborIssued"
                  control={control}
                  rules={{
                    validate: (value) => validateIssueDate(value, laborExpiry, 'Labor issued date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.laborIssued
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.laborIssued && (
                        <p className="mt-1 text-xs text-red-500">{errors.laborIssued.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Labor Expiry Date
                </label>
                <Controller
                  name="laborExpiry"
                  control={control}
                  rules={{
                    validate: (value) => validateExpiryDate(value, laborIssued, 'Labor expiry date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.laborExpiry
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.laborExpiry && (
                        <p className="mt-1 text-xs text-red-500">{errors.laborExpiry.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-id-card text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Emirates ID (EID)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-qrcode text-green-500 mr-1"></i> EID Number
                </label>
                <Controller
                  name="eidNumber"
                  control={control}
                  rules={validationRules.eidNumber}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.eidNumber
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="Enter EID number (e.g., 784-2024-1234567-8)"
                      />
                      {errors.eidNumber && (
                        <p className="mt-1 text-xs text-red-500">{errors.eidNumber.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Issued Date
                </label>
                <Controller
                  name="eidIssued"
                  control={control}
                  rules={{
                    validate: (value) => validateIssueDate(value, eidExpiry, 'EID issued date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.eidIssued
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.eidIssued && (
                        <p className="mt-1 text-xs text-red-500">{errors.eidIssued.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Expiry Date
                </label>
                <Controller
                  name="eidExpiry"
                  control={control}
                  rules={{
                    validate: (value) => validateExpiryDate(value, eidIssued, 'EID expiry date'),
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.eidExpiry
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      />
                      {errors.eidExpiry && (
                        <p className="mt-1 text-xs text-red-500">{errors.eidExpiry.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-address-card text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">Contact Information & Others</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-users text-green-500 mr-1"></i> Dependents
                </label>
                <Controller
                  name="dependents"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3+">3+</option>
                    </select>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-envelope text-green-500 mr-1"></i> Company Email
                </label>
                <Controller
                  name="companyEmail"
                  control={control}
                  rules={validationRules.companyEmail}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="email"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.companyEmail
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="name@company.com"
                      />
                      {errors.companyEmail && (
                        <p className="mt-1 text-xs text-red-500">{errors.companyEmail.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-phone text-green-500 mr-1"></i> Personal Number
                </label>
                <Controller
                  name="personalNumber"
                  control={control}
                  rules={validationRules.personalNumber}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="tel"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.personalNumber
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="Enter personal phone number"
                      />
                      {errors.personalNumber && (
                        <p className="mt-1 text-xs text-red-500">{errors.personalNumber.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-envelope text-green-500 mr-1"></i> Personal Email
                </label>
                <Controller
                  name="personalEmail"
                  control={control}
                  rules={validationRules.personalEmail}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="email"
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.personalEmail
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                        placeholder="name@gmail.com"
                      />
                      {errors.personalEmail && (
                        <p className="mt-1 text-xs text-red-500">{errors.personalEmail.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-phone-alt text-green-500 mr-1"></i> Other Number
                </label>
                <Controller
                  name="otherNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      placeholder="Enter alternate number"
                    />
                  )}
                />
              </div>

              {/* Roles Dropdown */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-user-tag text-green-500 mr-1"></i> Role *
                </label>
                <Controller
                  name="roles"
                  control={control}
                  rules={{ required: 'Role is required' }}
                  render={({ field }) => (
                    <>
                      <select
                        {...field}
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.roles
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {errors.roles && (
                        <p className="mt-1 text-xs text-red-500">{errors.roles.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Privileges Dropdown */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                  <i className="fas fa-shield-alt text-green-500 mr-1"></i> Privileges *
                </label>
                <Controller
                  name="privileges"
                  control={control}
                  rules={{ required: 'Privileges are required' }}
                  render={({ field }) => (
                    <>
                      <select
                        {...field}
                        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:ring-2 ${
                          errors.privileges
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20'
                        }`}
                      >
                        {privilegeOptions.map((privilege) => (
                          <option key={privilege} value={privilege}>
                            {privilege.replace('_', ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                      {errors.privileges && (
                        <p className="mt-1 text-xs text-red-500">{errors.privileges.message}</p>
                      )}
                    </>
                  )}
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
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? 'md:ml-[72px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto w-full">
            {/* Breadcrumbs - Responsive */}
            <div className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6 flex-wrap">
              <Link to="/employees" className="text-green-500 hover:text-green-600 font-medium">Employees</Link>
              <i className="fas fa-chevron-right text-gray-400 text-[10px] md:text-xs"></i>
              <span className="text-gray-500 dark:text-gray-400">Add Employee</span>
            </div>

            {/* Page Header */}
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
                <i className="fas fa-user-plus mr-2"></i> Add New Employee
              </h2>
            </div>

            {/* Step Indicator - Horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-2 mb-4 md:mb-8 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(index)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                      currentStep === index
                        ? 'bg-green-500 text-white shadow-md'
                        : index < currentStep
                        ? 'text-green-500'
                        : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <i className={`${step.icon} mr-1 text-xs md:text-sm`}></i>
                    <span className="hidden sm:inline">{step.number}. {step.title}</span>
                    <span className="sm:hidden">{step.number}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 lg:p-8 shadow-soft">
              <form onSubmit={handleSubmit(onSubmit)}>
                {renderStepContent()}

                {/* Navigation Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <i className="fas fa-arrow-left text-xs md:text-sm"></i>
                      <span>Previous</span>
                    </button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <span>Next</span>
                      <i className="fas fa-arrow-right text-xs md:text-sm"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-70"
                    >
                      {loading ? (
                        <><i className="fas fa-spinner fa-spin"></i> <span>Saving...</span></>
                      ) : (
                        <><i className="fas fa-save text-xs md:text-sm"></i> <span>Save Employee</span></>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEmployee;