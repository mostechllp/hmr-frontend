import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { showToast } from '../components/common/Toast';
import { addEmployee } from '../store/slices/employeeSlice';
import { fetchOrganizations } from '../store/slices/organizationSlice';
import { fetchCompanies } from '../store/slices/companySlice';
import { fetchDesignations } from '../store/slices/designationSlice';
import { fetchDepartments } from '../store/slices/departmentSlice';

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Document file states
  const [documents, setDocuments] = useState({
    passport_1st_page: null,
    passport_2nd_page: null,
    passport_outer_page: null,
    passport_id_page: null,
    visa_page: null,
    labor_card: null,
    eid_1st_page: null,
    eid_2nd_page: null,
    educational_1st_page: null,
    educational_2nd_page: null,
    home_country_id_proof: null,
  });

  const [documentPreviews, setDocumentPreviews] = useState({});

  // Fetch data from slices
  const { organizations = [] } = useSelector((state) => state.organizations || {});
  const { companies = [] } = useSelector((state) => state.companies || {});
  const { designations = [] } = useSelector((state) => state.designations || {});
  const { departments = [] } = useSelector((state) => state.departments || {});

  // Initialize useForm
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      // Step 1: Basic Info
      first_name: '',
      last_name: '',
      organization_id: '',
      company_id: '',
      designation_id: '',
      department_id: '',
      employee_id: '',
      type: 'employee',
      total_leaves_allocated: 30,
      joining_date: '',
      dob: '',
      gender: 'male',
      special_days: '',
      username: '',
      
      // Step 2: Passport Details
      passport_full_name: '',
      passport_number: '',
      passport_issued_date: '',
      passport_expiry_date: '',
      father_name: '',
      mother_name: '',
      address: '',
      passport_issued_from: '',
      place_of_birth: '',
      
      // Step 3: Visa & Labor
      visa_number: '',
      visa_issued_date: '',
      visa_expiry_date: '',
      labor_number: '',
      labor_issued_date: '',
      labor_expiry_date: '',
      
      // Step 4: EID
      eid_number: '',
      eid_issued_date: '',
      eid_expiry_date: '',
      
      // Step 5: Contact & Others
      dependents: 0,
      company_email: '',
      company_mobile_number: '',
      personal_number: '',
      personal_email: '',
      other_number: '',
      home_country_number: '',
      role: 'Employee',
    },
  });

  const watchOrganizationId = watch('organization_id');
  const passportIssued = watch('passport_issued_date');
  const passportExpiry = watch('passport_expiry_date');
  const visaIssued = watch('visa_issued_date');
  const visaExpiry = watch('visa_expiry_date');
  const laborIssued = watch('labor_issued_date');
  const laborExpiry = watch('labor_expiry_date');
  const eidIssued = watch('eid_issued_date');
  const eidExpiry = watch('eid_expiry_date');

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchDesignations());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Fetch companies when organization changes
  useEffect(() => {
    if (watchOrganizationId) {
      dispatch(fetchCompanies(watchOrganizationId));
    }
  }, [watchOrganizationId, dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const steps = [
    { number: 1, title: 'Basic Info', icon: 'fas fa-user-circle' },
    { number: 2, title: 'Passport', icon: 'fas fa-passport' },
    { number: 3, title: 'Visa & Labor', icon: 'fas fa-file-contract' },
    { number: 4, title: 'EID', icon: 'fas fa-id-card' },
    { number: 5, title: 'Contact', icon: 'fas fa-address-card' },
    { number: 6, title: 'Documents', icon: 'fas fa-file-upload' },
  ];

  const userTypeOptions = [
    'admin',
    'manager',
    'employee',
    'field_employee',
    'driver',
    'remote_employee',
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const documentFields = [
    { key: 'passport_1st_page', label: 'Passport 1st Page', icon: 'fas fa-passport', accept: 'image/*,.pdf' },
    { key: 'passport_2nd_page', label: 'Passport 2nd Page', icon: 'fas fa-passport', accept: 'image/*,.pdf' },
    { key: 'passport_outer_page', label: 'Passport Outer', icon: 'fas fa-passport', accept: 'image/*,.pdf' },
    { key: 'passport_id_page', label: 'Passport ID', icon: 'fas fa-id-card', accept: 'image/*,.pdf' },
    { key: 'visa_page', label: 'Visa Page', icon: 'fas fa-file-contract', accept: 'image/*,.pdf' },
    { key: 'labor_card', label: 'Labor Card', icon: 'fas fa-id-card', accept: 'image/*,.pdf' },
    { key: 'eid_1st_page', label: 'EID 1st Page', icon: 'fas fa-id-card', accept: 'image/*,.pdf' },
    { key: 'eid_2nd_page', label: 'EID 2nd Page', icon: 'fas fa-id-card', accept: 'image/*,.pdf' },
    { key: 'educational_1st_page', label: 'Educational 1', icon: 'fas fa-graduation-cap', accept: 'image/*,.pdf' },
    { key: 'educational_2nd_page', label: 'Educational 2', icon: 'fas fa-graduation-cap', accept: 'image/*,.pdf' },
    { key: 'home_country_id_proof', label: 'Home ID', icon: 'fas fa-home', accept: 'image/*,.pdf' },
  ];

  // Validation rules
  const validationRules = {
    first_name: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters',
      },
    },
    employee_id: {
      required: 'Employee ID is required',
    },
    organization_id: {
      required: 'Organization is required',
    },
    company_id: {
      required: 'Company is required',
    },
    type: {
      required: 'User type is required',
    },
    company_email: {
      required: 'Company email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address format',
      },
    },
    personal_email: {
      required: 'Personal email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address format',
      },
    },
    total_leaves_allocated: {
      required: 'Leave allocation is required',
      min: { value: 0, message: 'Leave allocation cannot be negative' },
      max: { value: 365, message: 'Leave allocation cannot exceed 365 days' },
    },
    username: {
      required: 'Username is required',
      minLength: { value: 3, message: 'Username must be at least 3 characters' },
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

  const handleFileChange = (fieldKey, file) => {
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 5) {
        showToast(`${documentFields.find(f => f.key === fieldKey)?.label} must be less than 5MB`, 'error');
        return;
      }
      
      setDocuments({ ...documents, [fieldKey]: file });
      
      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setDocumentPreviews({ ...documentPreviews, [fieldKey]: event.target.result });
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, show a PDF icon preview
        setDocumentPreviews({ ...documentPreviews, [fieldKey]: 'pdf' });
      }
    }
  };

  const handleNext = async () => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = [
          'first_name', 'employee_id', 'username',
          'organization_id', 'company_id', 'type',
          'total_leaves_allocated'
        ];
        break;
      case 1:
        fieldsToValidate = ['passport_issued_date', 'passport_expiry_date'];
        break;
      case 2:
        fieldsToValidate = ['visa_issued_date', 'visa_expiry_date', 'labor_issued_date', 'labor_expiry_date'];
        break;
      case 3:
        fieldsToValidate = ['eid_issued_date', 'eid_expiry_date'];
        break;
      case 4:
        fieldsToValidate = ['company_email', 'personal_email', 'type'];
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
    
    const formDataToSend = new FormData();
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== '') {
        formDataToSend.append(key, data[key]);
      }
    });
    
    // Add all documents
    Object.keys(documents).forEach(key => {
      if (documents[key]) {
        formDataToSend.append(key, documents[key]);
      }
    });
    
    // Convert IDs to integers
    formDataToSend.set('organization_id', parseInt(data.organization_id));
    formDataToSend.set('company_id', parseInt(data.company_id));
    if (data.designation_id) formDataToSend.set('designation_id', parseInt(data.designation_id));
    if (data.department_id) formDataToSend.set('department_id', parseInt(data.department_id));
    formDataToSend.set('total_leaves_allocated', parseInt(data.total_leaves_allocated));
    if (data.dependents) formDataToSend.set('dependents', parseInt(data.dependents));
    
    console.log('Submitting employee with documents');
    
    const result = await dispatch(addEmployee(formDataToSend));
    setLoading(false);
    
    if (addEmployee.fulfilled.match(result)) {
      showToast(`✓ Employee "${data.first_name} ${data.last_name || ''}" added successfully!`, 'success');
      setTimeout(() => {
        navigate('/employees');
      }, 1200);
    } else {
      const errorPayload = result.payload;
      if (errorPayload && errorPayload.errors) {
        const errorMessages = Object.entries(errorPayload.errors).map(([field, messages]) => {
          return `${field}: ${Array.isArray(messages) ? messages[0] : messages}`;
        });
        showToast(errorMessages.join('\n'), 'error');
      } else if (typeof errorPayload === 'string') {
        showToast(errorPayload, 'error');
      } else {
        showToast('Failed to add employee', 'error');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-user-circle text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-user text-green-500 mr-1"></i> First Name *
                </label>
                <Controller
                  name="first_name"
                  control={control}
                  rules={validationRules.first_name}
                  render={({ field }) => (
                    <>
                      <input {...field} type="text" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.first_name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/20'}`} placeholder="Enter first name" />
                      {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
                    </>
                  )}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-user text-green-500 mr-1"></i> Last Name
                </label>
                <Controller name="last_name" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter last name" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-building text-green-500 mr-1"></i> Organization *
                </label>
                <Controller name="organization_id" control={control} rules={validationRules.organization_id} render={({ field }) => (
                  <>
                    <select {...field} className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.organization_id ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`}>
                      <option value="">Select Organization</option>
                      {organizations.map((org) => (<option key={org.id} value={org.id}>{org.name}</option>))}
                    </select>
                    {errors.organization_id && <p className="mt-1 text-xs text-red-500">{errors.organization_id.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-building text-green-500 mr-1"></i> Company *
                </label>
                <Controller name="company_id" control={control} rules={validationRules.company_id} render={({ field }) => (
                  <>
                    <select {...field} disabled={!watchOrganizationId} className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${!watchOrganizationId ? 'opacity-50 cursor-not-allowed' : ''} ${errors.company_id ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`}>
                      <option value="">Select Company</option>
                      {companies.map((company) => (<option key={company.id} value={company.id}>{company.company_name || company.name}</option>))}
                    </select>
                    {errors.company_id && <p className="mt-1 text-xs text-red-500">{errors.company_id.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-briefcase text-green-500 mr-1"></i> Designation
                </label>
                <Controller name="designation_id" control={control} render={({ field }) => (
                  <select {...field} className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
                    <option value="">Select Designation</option>
                    {designations.map((desig) => (<option key={desig.id} value={desig.id}>{desig.name}</option>))}
                  </select>
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-diagram-project text-green-500 mr-1"></i> Department
                </label>
                <Controller name="department_id" control={control} render={({ field }) => (
                  <select {...field} className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
                    <option value="">Select Department</option>
                    {departments.map((dept) => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
                  </select>
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-user-tag text-green-500 mr-1"></i> User Type *
                </label>
                <Controller name="type" control={control} rules={validationRules.type} render={({ field }) => (
                  <>
                    <select {...field} className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.type ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`}>
                      {userTypeOptions.map((type) => (<option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</option>))}
                    </select>
                    {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-venus-mars text-green-500 mr-1"></i> Gender
                </label>
                <Controller name="gender" control={control} render={({ field }) => (
                  <select {...field} className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
                    <option value="">Select Gender</option>
                    {genderOptions.map((gender) => (<option key={gender.value} value={gender.value}>{gender.label}</option>))}
                  </select>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-gift text-green-500 mr-1"></i> Special Days
                </label>
                <Controller name="special_days" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="e.g. Birthday / Anniversary" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-id-card text-green-500 mr-1"></i> Employee ID *
                </label>
                <Controller name="employee_id" control={control} rules={validationRules.employee_id} render={({ field }) => (
                  <>
                    <input {...field} type="text" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.employee_id ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} placeholder="Enter employee ID" />
                    {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id.message}</p>}
                  </>
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-user-circle text-green-500 mr-1"></i> Username *
                </label>
                <Controller name="username" control={control} rules={validationRules.username} render={({ field }) => (
                  <>
                    <input {...field} type="text" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} placeholder="Enter username" />
                    {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar text-green-500 mr-1"></i> Date of Birth
                </label>
                <Controller name="dob" control={control} render={({ field }) => (
                  <input {...field} type="date" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-week text-green-500 mr-1"></i> Leave Allocation (Days) *
                </label>
                <Controller name="total_leaves_allocated" control={control} rules={validationRules.total_leaves_allocated} render={({ field }) => (
                  <>
                    <input {...field} type="number" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.total_leaves_allocated ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.total_leaves_allocated && <p className="mt-1 text-xs text-red-500">{errors.total_leaves_allocated.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-alt text-green-500 mr-1"></i> Joining Date
                </label>
                <Controller name="joining_date" control={control} render={({ field }) => (
                  <input {...field} type="date" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />
                )} />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-passport text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Passport Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-user-tag text-green-500 mr-1"></i> Passport Full Name
                </label>
                <Controller name="passport_full_name" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter name as per passport" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-hashtag text-green-500 mr-1"></i> Passport Number
                </label>
                <Controller name="passport_number" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter passport number" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Issued Date
                </label>
                <Controller name="passport_issued_date" control={control} rules={{ validate: (value) => validateIssueDate(value, passportExpiry, 'Passport issued date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.passport_issued_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.passport_issued_date && <p className="mt-1 text-xs text-red-500">{errors.passport_issued_date.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Expiry Date
                </label>
                <Controller name="passport_expiry_date" control={control} rules={{ validate: (value) => validateExpiryDate(value, passportIssued, 'Passport expiry date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.passport_expiry_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.passport_expiry_date && <p className="mt-1 text-xs text-red-500">{errors.passport_expiry_date.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-father text-green-500 mr-1"></i> Father's Name
                </label>
                <Controller name="father_name" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter father's name" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-mother text-green-500 mr-1"></i> Mother's Name
                </label>
                <Controller name="mother_name" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter mother's name" />
                )} />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-map-marker-alt text-green-500 mr-1"></i> Address
                </label>
                <Controller name="address" control={control} render={({ field }) => (
                  <textarea {...field} rows="2" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter full address"></textarea>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-globe text-green-500 mr-1"></i> Issued From
                </label>
                <Controller name="passport_issued_from" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter issuing country/city" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-map-pin text-green-500 mr-1"></i> Place of Birth
                </label>
                <Controller name="place_of_birth" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter place of birth" />
                )} />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-file-contract text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Visa & Labor Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-id-card text-green-500 mr-1"></i> Visa Number
                </label>
                <Controller name="visa_number" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter Visa Number" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Visa Issued Date
                </label>
                <Controller name="visa_issued_date" control={control} rules={{ validate: (value) => validateIssueDate(value, visaExpiry, 'Visa issued date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.visa_issued_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.visa_issued_date && <p className="mt-1 text-xs text-red-500">{errors.visa_issued_date.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Visa Expiry Date
                </label>
                <Controller name="visa_expiry_date" control={control} rules={{ validate: (value) => validateExpiryDate(value, visaIssued, 'Visa expiry date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.visa_expiry_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.visa_expiry_date && <p className="mt-1 text-xs text-red-500">{errors.visa_expiry_date.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-briefcase text-green-500 mr-1"></i> Labor Number
                </label>
                <Controller name="labor_number" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter Labor Number" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Labor Issued Date
                </label>
                <Controller name="labor_issued_date" control={control} rules={{ validate: (value) => validateIssueDate(value, laborExpiry, 'Labor issued date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.labor_issued_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.labor_issued_date && <p className="mt-1 text-xs text-red-500">{errors.labor_issued_date.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Labor Expiry Date
                </label>
                <Controller name="labor_expiry_date" control={control} rules={{ validate: (value) => validateExpiryDate(value, laborIssued, 'Labor expiry date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.labor_expiry_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.labor_expiry_date && <p className="mt-1 text-xs text-red-500">{errors.labor_expiry_date.message}</p>}
                  </>
                )} />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-id-card text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Emirates ID (EID)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-qrcode text-green-500 mr-1"></i> EID Number
                </label>
                <Controller name="eid_number" control={control} render={({ field }) => (
                  <input {...field} type="text" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter EID number (e.g., 784-2024-1234567-8)" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-plus text-green-500 mr-1"></i> Issued Date
                </label>
                <Controller name="eid_issued_date" control={control} rules={{ validate: (value) => validateIssueDate(value, eidExpiry, 'EID issued date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.eid_issued_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.eid_issued_date && <p className="mt-1 text-xs text-red-500">{errors.eid_issued_date.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-calendar-times text-green-500 mr-1"></i> Expiry Date
                </label>
                <Controller name="eid_expiry_date" control={control} rules={{ validate: (value) => validateExpiryDate(value, eidIssued, 'EID expiry date') }} render={({ field }) => (
                  <>
                    <input {...field} type="date" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.eid_expiry_date ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} />
                    {errors.eid_expiry_date && <p className="mt-1 text-xs text-red-500">{errors.eid_expiry_date.message}</p>}
                  </>
                )} />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-address-card text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Contact Information & Others</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-users text-green-500 mr-1"></i> Dependents
                </label>
                <Controller name="dependents" control={control} render={({ field }) => (
                  <input {...field} type="number" min="0" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Number of dependents" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-phone text-green-500 mr-1"></i> Company Mobile Number
                </label>
                <Controller name="company_mobile_number" control={control} render={({ field }) => (
                  <input {...field} type="tel" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter company mobile number" />
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-phone text-green-500 mr-1"></i> Personal Number
                </label>
                <Controller name="personal_number" control={control} render={({ field }) => (
                  <input {...field} type="tel" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter personal phone number" />
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-phone-alt text-green-500 mr-1"></i> Other Number
                </label>
                <Controller name="other_number" control={control} render={({ field }) => (
                  <input {...field} type="tel" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter alternate number" />
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-globe text-green-500 mr-1"></i> Home Country Number
                </label>
                <Controller name="home_country_number" control={control} render={({ field }) => (
                  <input {...field} type="tel" className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Enter home country number" />
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-envelope text-green-500 mr-1"></i> Company Email *
                </label>
                <Controller name="company_email" control={control} rules={validationRules.company_email} render={({ field }) => (
                  <>
                    <input {...field} type="email" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.company_email ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} placeholder="name@company.com" />
                    {errors.company_email && <p className="mt-1 text-xs text-red-500">{errors.company_email.message}</p>}
                  </>
                )} />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-envelope text-green-500 mr-1"></i> Personal Email *
                </label>
                <Controller name="personal_email" control={control} rules={validationRules.personal_email} render={({ field }) => (
                  <>
                    <input {...field} type="email" className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border rounded-lg text-sm md:text-base text-gray-800 transition-all focus:outline-none focus:ring-2 ${errors.personal_email ? 'border-red-500' : 'border-gray-200 focus:border-green-500'}`} placeholder="name@gmail.com" />
                    {errors.personal_email && <p className="mt-1 text-xs text-red-500">{errors.personal_email.message}</p>}
                  </>
                )} />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  <i className="fas fa-user-tag text-green-500 mr-1"></i> Role
                </label>
                <Controller name="role" control={control} render={({ field }) => (
                  <select {...field} className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20">
                    <option value="">Select Role</option>
                    {userTypeOptions.map((role) => (<option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}</option>))}
                  </select>
                )} />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div>
            <div className="form-section-title mb-4 md:mb-6">
              <i className="fas fa-file-upload text-green-500 mr-2"></i>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Upload Documents</h3>
              <p className="text-sm text-gray-500 mt-1">Upload required documents (Max size: 5MB per file)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {documentFields.map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <i className={`${doc.icon} text-green-500 mr-2`}></i>
                    {doc.label}
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="file"
                      id={doc.key}
                      accept={doc.accept}
                      onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById(doc.key).click()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-upload"></i> Choose File
                    </button>
                    <span className="text-sm text-gray-500 truncate flex-1">
                      {documents[doc.key] ? documents[doc.key].name : 'No file chosen'}
                    </span>
                  </div>
                  {documentPreviews[doc.key] && documentPreviews[doc.key] !== 'pdf' && (
                    <div className="mt-3">
                      <img src={documentPreviews[doc.key]} alt={doc.label} className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => {
                          setDocuments({ ...documents, [doc.key]: null });
                          setDocumentPreviews({ ...documentPreviews, [doc.key]: null });
                        }}
                        className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  )}
                  {documentPreviews[doc.key] === 'pdf' && (
                    <div className="mt-3">
                      <div className="h-20 w-20 bg-red-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <i className="fas fa-file-pdf text-red-500 text-3xl"></i>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDocuments({ ...documents, [doc.key]: null });
                          setDocumentPreviews({ ...documentPreviews, [doc.key]: null });
                        }}
                        className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    <i className="fas fa-info-circle mr-1"></i> Max size: 5MB. Allowed: JPG, PNG, PDF
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? 'md:ml-[72px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6 flex-wrap">
              <Link to="/employees" className="text-green-500 hover:text-green-600 font-medium">Employees</Link>
              <i className="fas fa-chevron-right text-gray-400 text-[10px] md:text-xs"></i>
              <span className="text-gray-500">Add Employee</span>
            </div>

            {/* Page Header */}
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent">
                <i className="fas fa-user-plus mr-2"></i> Add New Employee
              </h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the employee details below</p>
            </div>

            {/* Step Indicator */}
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
                        : 'text-gray-500 bg-gray-100'
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
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 lg:p-8 shadow-soft">
              <form onSubmit={handleSubmit(onSubmit)}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
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