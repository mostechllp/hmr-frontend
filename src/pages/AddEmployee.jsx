import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/add-employee-datepicker.css";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { showToast } from "../components/common/Toast";
import { addEmployee } from "../store/slices/employeeSlice";
import { fetchCompanies } from "../store/slices/companySlice";
import { fetchDesignations } from "../store/slices/designationSlice";
import { fetchDepartments } from "../store/slices/departmentSlice";

const AddEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [, setVisitedSteps] = useState([0]);

  // Document file states
  const [documents, setDocuments] = useState({
    passport_size_photo: null,
    passport_1st_page: null,
    passport_2nd_page: null,
    passport_outer_page: null,
    passport_id_page: null,
    visa_page: null,
    labor_card: null,
    labor_contract: null,
    eid_1st_page: null,
    eid_2nd_page: null,
    educational_1st_page: null,
    educational_2nd_page: null,
    home_country_id_proof: null,
  });

  const [documentPreviews, setDocumentPreviews] = useState({});
  const { companies = [] } = useSelector((state) => state.companies || {});
  const { designations = [] } = useSelector(
    (state) => state.designations || {},
  );
  const { departments = [] } = useSelector((state) => state.departments || {});

  // Initialize useForm
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      // Step 1: Basic Info
      first_name: "",
      last_name: "",
      organization_id: "",
      company_id: "",
      designation_id: "",
      department_id: "",
      employee_id: "",
      type: "employee",
      total_leaves_allocated: 30,
      joining_date: "",
      dob: "",
      gender: "male",
      nationality: "",
      marital_status: "",
      special_days: [{ name: "", date: "" }], // Changed to array of objects
      username: "",

      // Step 2: Passport Details
      passport_full_name: "",
      passport_number: "",
      passport_issued_date: "",
      passport_expiry_date: "",
      father_name: "",
      mother_name: "",
      address: "",
      passport_issued_from: "",
      place_of_birth: "",

      // Step 3: Visa & Labor
      visa_type: "",
      visa_number: "",
      visa_issued_date: "",
      visa_expiry_date: "",
      labor_number: "",
      labor_issued_date: "",
      labor_expiry_date: "",

      // Step 4: EID
      eid_number: "",
      eid_issued_date: "",
      eid_expiry_date: "",

      // Step 5: Contact & Others
      dependents: 0,
      company_email: "",
      company_mobile_number: "",
      personal_number: "",
      personal_email: "",
      other_number: "",
      home_country_number: "",
      role: "Employee",
    },
    shouldUnregister: true,
    mode: "onSubmit",
  });

  // UseFieldArray for special days
  const { fields, append, remove } = useFieldArray({
    control,
    name: "special_days",
  });

  const passportIssued = watch("passport_issued_date");
  const passportExpiry = watch("passport_expiry_date");
  const visaIssued = watch("visa_issued_date");
  const visaExpiry = watch("visa_expiry_date");
  const laborIssued = watch("labor_issued_date");
  const laborExpiry = watch("labor_expiry_date");
  const eidIssued = watch("eid_issued_date");
  const eidExpiry = watch("eid_expiry_date");
  const watchCompanyId = watch("company_id");

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchDesignations());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (!watchCompanyId) {
      setValue("organization_id", "");
      return;
    }

    const selectedCompany = companies.find(
      (c) => String(c.id) === String(watchCompanyId),
    );

    if (selectedCompany?.raw?.organization_id || selectedCompany?.organization_id) {
      const orgId = selectedCompany.raw?.organization_id ?? selectedCompany.organization_id;
      setValue("organization_id", String(orgId));
    }
  }, [watchCompanyId, companies, setValue]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const steps = [
    { number: 1, title: "Basic", icon: "fas fa-user-circle" },
    { number: 2, title: "Passport", icon: "fas fa-passport" },
    { number: 3, title: "Visa & Labor", icon: "fas fa-file-contract" },
    { number: 4, title: "EID", icon: "fas fa-id-card" },
    { number: 5, title: "Other", icon: "fas fa-address-card" },
  ];

  const userTypeOptions = [
    "admin",
    "manager",
    "employee",
    "field_employee",
    "driver",
    "remote_employee",
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];
  const visaTypeOptions = [
    "Employment Visa",
    "Visit Visa",
    "Residence Visa",
    "Investor Visa",
    "Dependent Visa",
  ];

  const labelClass =
    "mb-1.5 block text-[13px] font-medium text-slate-700";
  const inputBaseClass =
    "w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
  const errorInputClass =
    "border-red-400 focus:border-red-400 focus:ring-red-100";
  const fileInputClass =
    "block w-full rounded-md border border-slate-200 bg-white text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200";

  const getValidDate = (value) => {
    if (!value) return null;
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const showFieldValidation = (fieldName) => {
    const fieldElement = document.querySelector(`[name="${fieldName}"]`);
    if (!fieldElement) return;

    requestAnimationFrame(() => {
      fieldElement.focus();
      if (typeof fieldElement.reportValidity === "function") {
        fieldElement.reportValidity();
      }
    });
  };

  const DateInput = React.forwardRef(function DateInput(
    { value, onClick, placeholder, name, hasError },
    ref,
  ) {
    return (
      <div className="relative">
        <input
          ref={ref}
          name={name}
          value={value || ""}
          readOnly
          onClick={onClick}
          placeholder={placeholder}
          className={`${inputBaseClass} ${hasError ? errorInputClass : ""} pr-10`}
          autoComplete="off"
        />
        <i className="fas fa-calendar-alt pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"></i>
      </div>
    );
  });

  const SmartDatePicker = ({
    field,
    placeholder = "Select date",
    hasError = false,
    minDate,
    maxDate,
  }) => {
    const [mode, setMode] = useState("day"); // day | month | year

    const currentValue = getValidDate(field.value) || new Date();

    return (
      <DatePicker
        selected={getValidDate(field.value)}
        onChange={(date) => {
          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
          setMode("day");
        }}
        onSelect={() => setMode("day")}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        customInput={
          <DateInput
            name={field.name}
            placeholder={placeholder}
            hasError={hasError}
          />
        }
        wrapperClassName="w-full"
        calendarClassName="employee-datepicker"
        popperClassName="employee-datepicker-popper"
        showPopperArrow={false}
        minDate={minDate}
        maxDate={maxDate}
        name={field.name}
        autoComplete="off"
        formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 2).toUpperCase()}
        showMonthYearPicker={mode === "month"}
        showYearPicker={mode === "year"}
        yearItemNumber={12}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          decreaseYear,
          increaseYear,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          const monthYearLabel = format(date, "MMMM yyyy");
          const yearLabel = format(date, "yyyy");

          const onPrev = mode === "year" ? decreaseYear : decreaseMonth;
          const onNext = mode === "year" ? increaseYear : increaseMonth;

          return (
            <div className="employee-datepicker-header">
              <button
                type="button"
                onClick={onPrev}
                disabled={prevMonthButtonDisabled}
                className="employee-datepicker-nav"
              >
                ‹
              </button>

              {mode === "day" && (
                <button
                  type="button"
                  className="employee-datepicker-title"
                  onClick={() => setMode("month")}
                >
                  {monthYearLabel}
                </button>
              )}

              {mode === "month" && (
                <button
                  type="button"
                  className="employee-datepicker-title"
                  onClick={() => setMode("year")}
                >
                  {yearLabel}
                </button>
              )}

              {mode === "year" && (
                <span className="employee-datepicker-title">
                  {format(date, "yyyy")}-{format(new Date(date.getFullYear() + 9, 0, 1), "yyyy")}
                </span>
              )}

              <button
                type="button"
                onClick={onNext}
                disabled={nextMonthButtonDisabled}
                className="employee-datepicker-nav"
              >
                ›
              </button>
            </div>
          );
        }}
        openToDate={currentValue}
      />
    );
  };

  const renderDatePicker = (args) => <SmartDatePicker {...args} />;

  const handleFileChange = (fieldKey, file) => {
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 5) {
        showToast(`${fieldKey} file must be less than 5MB`, "error");
        return;
      }

      setDocuments({ ...documents, [fieldKey]: file });

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setDocumentPreviews({
          ...documentPreviews,
          [fieldKey]: base64String,
        });
        setDocuments((prev) => ({
          ...prev,
          [fieldKey]: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getFieldsToValidate = (stepIndex) => {
    let fieldsToValidate = [];

    switch (stepIndex) {
      case 0:
        fieldsToValidate = [
          "first_name",
          "designation_id",
          "department_id",
          "employee_id",
          "company_id",
        ];
        break;
      case 1:
        fieldsToValidate = ["passport_issued_date", "passport_expiry_date"];
        break;
      case 2:
        fieldsToValidate = [
          "visa_issued_date",
          "visa_expiry_date",
          "labor_issued_date",
          "labor_expiry_date",
        ];
        break;
      case 3:
        fieldsToValidate = ["eid_issued_date", "eid_expiry_date"];
        break;
      case 4:
        fieldsToValidate = ["company_email", "personal_email", "type"];
        break;
      default:
        fieldsToValidate = [];
    }

    return fieldsToValidate;
  };

  const validateStep = async (stepIndex) => {
    const fieldsToValidate = getFieldsToValidate(stepIndex);

    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

    if (!isValid) {
      const firstInvalidField =
        fieldsToValidate.find((fieldName) => {
          const fieldElement = document.querySelector(`[name="${fieldName}"]`);
          return (
            fieldElement &&
            typeof fieldElement.checkValidity === "function" &&
            !fieldElement.checkValidity()
          );
        }) || fieldsToValidate[0];

      showFieldValidation(firstInvalidField);
      showToast("Please fix the errors before proceeding", "error");
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);

    if (isValid) {
      setVisitedSteps((prev) => [...new Set([...prev, currentStep + 1])]);
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepChange = async (targetStep) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    for (let stepIndex = currentStep; stepIndex < targetStep; stepIndex += 1) {
      const isValid = await validateStep(stepIndex);

      if (!isValid) {
        return;
      }
    }

    setVisitedSteps((prev) =>
      [...new Set([...prev, ...Array.from({ length: targetStep + 1 }, (_, i) => i)])],
    );
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const submitData = { ...data };

    // Convert IDs to integers
    submitData.organization_id = parseInt(data.organization_id);
    submitData.company_id = parseInt(data.company_id);
    if (data.designation_id) submitData.designation_id = parseInt(data.designation_id);
    if (data.department_id) submitData.department_id = parseInt(data.department_id);
    submitData.total_leaves_allocated = parseInt(data.total_leaves_allocated);

    if (data.dependents !== undefined && data.dependents !== "") {
      submitData.dependents = String(data.dependents);
    }

    // Convert special days array to JSON string for storage
    if (data.special_days && data.special_days.length > 0) {
      const validSpecialDays = data.special_days.filter(
        day => day.name && day.date
      );
      submitData.special_days = JSON.stringify(validSpecialDays);
    } else {
      submitData.special_days = null;
    }

    // Add all documents as base64 strings
    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        submitData[key] = documents[key];
      }
    });

    const result = await dispatch(addEmployee(submitData));
    setLoading(false);

    if (addEmployee.fulfilled.match(result)) {
      showToast(
        `✓ Employee "${data.first_name} ${data.last_name || ""}" added successfully!`,
        "success",
      );
      navigate("/employees");
    } else {
      const errorPayload = result.payload;
      if (errorPayload && errorPayload.errors) {
        const errorMessages = Object.entries(errorPayload.errors).map(
          ([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages[0] : messages}`;
          },
        );
        showToast(errorMessages.join("\n"), "error");
      } else if (typeof errorPayload === "string") {
        showToast(errorPayload, "error");
      } else {
        showToast("Failed to add employee", "error");
      }
    }
  };

  // Validation rules
  const validationRules = {
    first_name: {
      required: "First name is required",
      minLength: {
        value: 2,
        message: "First name must be at least 2 characters",
      },
    },
    employee_id: {
      required: "Employee ID is required",
    },
    company_id: {
      required: "Company is required",
    },
    designation_id: {
      required: "Designation is required",
    },
    department_id: {
      required: "Department is required",
    },
    type: {
      required: "User type is required",
    },
    company_email: {
      required: "Company email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address format",
      },
    },
    personal_email: {
      required: "Personal email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address format",
      },
    },
    total_leaves_allocated: {
      required: "Leave allocation is required",
      min: { value: 0, message: "Leave allocation cannot be negative" },
      max: { value: 365, message: "Leave allocation cannot exceed 365 days" },
    },
    username: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
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

  return (
    <div className="app flex min-h-screen overflow-x-hidden bg-[#f7f8fa]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? (sidebarOpen ? "md:ml-[250px]" : "md:ml-[84px]") : ""}`}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content w-full overflow-x-hidden px-4 py-4 md:px-5 md:py-5">
          <div className="mx-auto w-full max-w-[1180px]">
            {/* Page Header */}
            <div className="mb-4">
              <h2 className="text-[28px] font-semibold text-slate-800">
                Add Employee
              </h2>
              <div className="mt-2 flex items-center gap-2 text-xs md:text-sm">
                <Link
                  to="/employees"
                  className="font-medium text-slate-500 hover:text-emerald-600"
                >
                  Employees
                </Link>
                <i className="fas fa-chevron-right text-[10px] text-slate-300 md:text-xs"></i>
                <span className="font-medium text-emerald-600">Add Employee</span>
              </div>
            </div>

            {/* Form Container */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)] md:p-6">
              <div className="mb-5 overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-5">
                  {steps.map((step, index) => (
                    <button
                      type="button"
                      key={step.number}
                      onClick={() => handleStepChange(index)}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all md:text-[13px] ${
                        currentStep === index
                          ? "bg-emerald-500 text-white"
                          : "text-slate-700 hover:text-emerald-600"
                      }`}
                    >
                      {step.title}
                    </button>
                  ))}
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  if (currentStep !== steps.length - 1) {
                    e.preventDefault();
                    return;
                  }
                  handleSubmit(onSubmit)(e);
                }}
              >
                {/* Hidden required fields (API expects these) */}
                <Controller
                  name="organization_id"
                  control={control}
                  rules={{ required: "Organization is required" }}
                  render={({ field }) => (
                    <input {...field} type="hidden" required />
                  )}
                />
                <Controller
                  name="type"
                  control={control}
                  rules={validationRules.type}
                  render={({ field }) => (
                    <input {...field} type="hidden" required />
                  )}
                />
                <Controller
                  name="total_leaves_allocated"
                  control={control}
                  rules={validationRules.total_leaves_allocated}
                  render={({ field }) => (
                    <input {...field} type="hidden" required />
                  )}
                />

                <div className="space-y-8">
                  {/* Step 0 - Basic Info */}
                  <div className={currentStep === 0 ? "block" : "hidden"}>
                    <div>
                      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <label className={labelClass}>First Name *</label>
                          <Controller
                            name="first_name"
                            control={control}
                            rules={validationRules.first_name}
                            render={({ field }) => (
                              <>
                                <input
                                  {...field}
                                  type="text"
                                  required
                                  className={`${inputBaseClass} ${errors.first_name ? errorInputClass : ""}`}
                                  placeholder="Enter first name"
                                />
                                {errors.first_name && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.first_name.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Last Name</label>
                          <Controller
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter last name"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Company *</label>
                          <Controller
                            name="company_id"
                            control={control}
                            rules={validationRules.company_id}
                            render={({ field }) => (
                              <>
                                <select
                                  {...field}
                                  required
                                  className={`${inputBaseClass} ${errors.company_id ? errorInputClass : ""}`}
                                >
                                  <option value="">Select Company</option>
                                  {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                      {company.company_name || company.name}
                                    </option>
                                  ))}
                                </select>
                                {errors.company_id && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.company_id.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Department *</label>
                          <Controller
                            name="department_id"
                            control={control}
                            rules={validationRules.department_id}
                            render={({ field }) => (
                              <select
                                {...field}
                                required
                                className={`${inputBaseClass} ${errors.department_id ? errorInputClass : ""}`}
                              >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                  <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                          {errors.department_id && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.department_id.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>Designation *</label>
                          <Controller
                            name="designation_id"
                            control={control}
                            rules={validationRules.designation_id}
                            render={({ field }) => (
                              <select
                                {...field}
                                required
                                className={`${inputBaseClass} ${errors.designation_id ? errorInputClass : ""}`}
                              >
                                <option value="">Select Designation</option>
                                {designations.map((desig) => (
                                  <option key={desig.id} value={desig.id}>
                                    {desig.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                          {errors.designation_id && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.designation_id.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>Date of Joining</label>
                          <Controller
                            name="joining_date"
                            control={control}
                            render={({ field }) => (
                              renderDatePicker({
                                field,
                                placeholder: "Select joining date",
                              })
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Employee ID *</label>
                          <Controller
                            name="employee_id"
                            control={control}
                            rules={validationRules.employee_id}
                            render={({ field }) => (
                              <>
                                <input
                                  {...field}
                                  type="text"
                                  required
                                  className={`${inputBaseClass} ${errors.employee_id ? errorInputClass : ""}`}
                                  placeholder="Enter employee ID"
                                />
                                {errors.employee_id && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.employee_id.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Date of Birth</label>
                          <Controller
                            name="dob"
                            control={control}
                            render={({ field }) => (
                              renderDatePicker({
                                field,
                                placeholder: "Select date of birth",
                                maxDate: new Date(),
                              })
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Gender</label>
                          <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className={inputBaseClass}
                              >
                                <option value="">Select Gender</option>
                                {genderOptions.map((gender) => (
                                  <option key={gender.value} value={gender.value}>
                                    {gender.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Nationality</label>
                          <Controller
                            name="nationality"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter nationality"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Marital Status</label>
                          <Controller
                            name="marital_status"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                className={inputBaseClass}
                              >
                                <option value="">Select Marital Status</option>
                                {maritalStatusOptions.map((status) => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>

                        <div className="md:col-span-2 xl:col-span-4">
                          <label className={labelClass}>Special Days</label>
                          <div className="flex flex-col gap-3 md:flex-row md:items-end">
                            <div className="flex-1">
                              <Controller
                                name="special_days.0.name"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder="e.g. Birthday / Anniversary"
                                    className={inputBaseClass}
                                  />
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <Controller
                                name="special_days.0.date"
                                control={control}
                                render={({ field }) => (
                                  renderDatePicker({
                                    field,
                                    placeholder: "Select date",
                                  })
                                )}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => append({ name: "", date: "" })}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400 text-sm text-white transition-colors hover:bg-teal-500"
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          {fields.length > 1 && (
                            <div className="mt-3 space-y-3">
                              {fields.slice(1).map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-3 md:flex-row md:items-end">
                                  <div className="flex-1">
                                    <Controller
                                      name={`special_days.${index + 1}.name`}
                                      control={control}
                                      render={({ field }) => (
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="e.g. Birthday / Anniversary"
                                          className={inputBaseClass}
                                        />
                                      )}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Controller
                                      name={`special_days.${index + 1}.date`}
                                      control={control}
                                      render={({ field }) => (
                                        renderDatePicker({
                                          field,
                                          placeholder: "Select date",
                                        })
                                      )}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => remove(index + 1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2 xl:col-span-4">
                          <label className={labelClass}>Passport Size Photo</label>
                          <div className="flex flex-col gap-4 md:flex-row md:items-start">
                            <div className="flex h-[132px] w-[106px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-center text-[13px] text-slate-400">
                              {documentPreviews.passport_size_photo &&
                              documentPreviews.passport_size_photo !== "pdf" ? (
                                <img
                                  src={documentPreviews.passport_size_photo}
                                  alt="Passport size preview"
                                  className="h-full w-full rounded object-cover"
                                />
                              ) : (
                                <div>
                                  <i className="fas fa-user mb-2 block text-2xl text-slate-300"></i>
                                  <span>Photo</span>
                                </div>
                              )}
                            </div>
                            <div className="pt-3">
                              <input
                                type="file"
                                id="doc_passport_size_photo"
                                accept="image/*"
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleFileChange(
                                    "passport_size_photo",
                                    e.target.files[0],
                                  );
                                }}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  document
                                    .getElementById("doc_passport_size_photo")
                                    .click()
                                }
                                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-5 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                              >
                                <i className="fas fa-upload"></i>
                                Upload Photo
                              </button>
                              <p className="mt-3 text-xs text-slate-400">
                                Accepted: JPG, PNG, GIF. Max 2MB.
                              </p>
                              <p className="text-xs text-slate-400">
                                Recommended size: 35mm x 45mm (passport size).
                              </p>
                              {documentPreviews.passport_size_photo && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDocuments((prev) => ({
                                      ...prev,
                                      passport_size_photo: null,
                                    }));
                                    setDocumentPreviews((prev) => ({
                                      ...prev,
                                      passport_size_photo: null,
                                    }));
                                  }}
                                  className="mt-2 block text-xs text-red-500 hover:text-red-600"
                                >
                                  Remove photo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 - Passport */}
                  <div className={currentStep === 1 ? "block" : "hidden"}>
                    <div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div>
                          <label className={labelClass}>Passport Full Name</label>
                          <Controller
                            name="passport_full_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter name as per passport"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Passport Number</label>
                          <Controller
                            name="passport_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter passport number"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Issued From</label>
                          <Controller
                            name="passport_issued_from"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter issuing country/city"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Issued Date</label>
                          <Controller
                            name="passport_issued_date"
                            control={control}
                            rules={{
                              validate: (value) =>
                                validateIssueDate(
                                  value,
                                  passportExpiry,
                                  "Passport issued date",
                                ),
                            }}
                            render={({ field }) => (
                              <>
                                {renderDatePicker({
                                  field,
                                  placeholder: "Select issued date",
                                  hasError: !!errors.passport_issued_date,
                                  maxDate: new Date(),
                                })}
                                {errors.passport_issued_date && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.passport_issued_date.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Expiry Date</label>
                          <Controller
                            name="passport_expiry_date"
                            control={control}
                            rules={{
                              validate: (value) =>
                                validateExpiryDate(
                                  value,
                                  passportIssued,
                                  "Passport expiry date",
                                ),
                            }}
                            render={({ field }) => (
                              <>
                                {renderDatePicker({
                                  field,
                                  placeholder: "Select expiry date",
                                  hasError: !!errors.passport_expiry_date,
                                  minDate:
                                    getValidDate(passportIssued) || undefined,
                                })}
                                {errors.passport_expiry_date && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.passport_expiry_date.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Place of Birth</label>
                          <Controller
                            name="place_of_birth"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter place of birth"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Father's Name</label>
                          <Controller
                            name="father_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter father's name"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Mother's Name</label>
                          <Controller
                            name="mother_name"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter mother's name"
                              />
                            )}
                          />
                        </div>

                        <div className="lg:col-span-3">
                          <label className={labelClass}>Address</label>
                          <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                              <textarea
                                {...field}
                                rows="2"
                                className={inputBaseClass}
                                placeholder="Enter full address"
                              />
                            )}
                          />
                        </div>

                        <div className="lg:col-span-3 pt-2">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                              <label className={labelClass}>Passport 1st Page</label>
                              <input
                                type="file"
                                name="passport_1st_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "passport_1st_page",
                                    e.target.files?.[0],
                                  )
                                }
                                className="block w-full rounded-md border border-slate-200 bg-white text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Passport 2nd Page</label>
                              <input
                                type="file"
                                name="passport_2nd_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "passport_2nd_page",
                                    e.target.files?.[0],
                                  )
                                }
                                className="block w-full rounded-md border border-slate-200 bg-white text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Outer Page</label>
                              <input
                                type="file"
                                name="passport_outer_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "passport_outer_page",
                                    e.target.files?.[0],
                                  )
                                }
                                className="block w-full rounded-md border border-slate-200 bg-white text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                              />
                            </div>
                            <div>
                              <label className={labelClass}>ID Page</label>
                              <input
                                type="file"
                                name="passport_id_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "passport_id_page",
                                    e.target.files?.[0],
                                  )
                                }
                                className="block w-full rounded-md border border-slate-200 bg-white text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 - Visa & Labor */}
                  <div className={currentStep === 2 ? "block" : "hidden"}>
                    <div>
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                          <h4 className="mb-3 text-xl font-semibold text-slate-800">
                            Visa Details
                          </h4>
                          <div className="space-y-3">
                            <Controller
                              name="visa_type"
                              control={control}
                              render={({ field }) => (
                                <select {...field} className={inputBaseClass}>
                                  <option value="">Select Type of Visa</option>
                                  {visaTypeOptions.map((visaType) => (
                                    <option key={visaType} value={visaType}>
                                      {visaType}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                            <Controller
                              name="visa_number"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={inputBaseClass}
                                  placeholder="Enter Visa Number"
                                />
                              )}
                            />
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <Controller
                                name="visa_issued_date"
                                control={control}
                                rules={{
                                  validate: (value) =>
                                    validateIssueDate(
                                      value,
                                      visaExpiry,
                                      "Visa issued date",
                                    ),
                                }}
                                render={({ field }) => (
                                  <>
                                    {renderDatePicker({
                                      field,
                                      placeholder: "Visa issued date",
                                      hasError: !!errors.visa_issued_date,
                                      maxDate: new Date(),
                                    })}
                                    {errors.visa_issued_date && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {errors.visa_issued_date.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                              <Controller
                                name="visa_expiry_date"
                                control={control}
                                rules={{
                                  validate: (value) =>
                                    validateExpiryDate(
                                      value,
                                      visaIssued,
                                      "Visa expiry date",
                                    ),
                                }}
                                render={({ field }) => (
                                  <>
                                    {renderDatePicker({
                                      field,
                                      placeholder: "Visa expiry date",
                                      hasError: !!errors.visa_expiry_date,
                                      minDate:
                                        getValidDate(visaIssued) || undefined,
                                    })}
                                    {errors.visa_expiry_date && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {errors.visa_expiry_date.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Attach Visa Page</label>
                              <input
                                type="file"
                                name="visa_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange("visa_page", e.target.files?.[0])
                                }
                                className={fileInputClass}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-3 text-xl font-semibold text-slate-800">
                            Labor Details
                          </h4>
                          <div className="space-y-3">
                            <Controller
                              name="labor_number"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={inputBaseClass}
                                  placeholder="Enter Labor Number"
                                />
                              )}
                            />
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <Controller
                                name="labor_issued_date"
                                control={control}
                                rules={{
                                  validate: (value) =>
                                    validateIssueDate(
                                      value,
                                      laborExpiry,
                                      "Labor issued date",
                                    ),
                                }}
                                render={({ field }) => (
                                  <>
                                    {renderDatePicker({
                                      field,
                                      placeholder: "Labor issued date",
                                      hasError: !!errors.labor_issued_date,
                                      maxDate: new Date(),
                                    })}
                                    {errors.labor_issued_date && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {errors.labor_issued_date.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                              <Controller
                                name="labor_expiry_date"
                                control={control}
                                rules={{
                                  validate: (value) =>
                                    validateExpiryDate(
                                      value,
                                      laborIssued,
                                      "Labor expiry date",
                                    ),
                                }}
                                render={({ field }) => (
                                  <>
                                    {renderDatePicker({
                                      field,
                                      placeholder: "Labor expiry date",
                                      hasError: !!errors.labor_expiry_date,
                                      minDate:
                                        getValidDate(laborIssued) || undefined,
                                    })}
                                    {errors.labor_expiry_date && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {errors.labor_expiry_date.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Attach Labor Card</label>
                              <input
                                type="file"
                                name="labor_card"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange("labor_card", e.target.files?.[0])
                                }
                                className={fileInputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Attach Labor Contract</label>
                              <input
                                type="file"
                                name="labor_contract"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "labor_contract",
                                    e.target.files?.[0],
                                  )
                                }
                                className={fileInputClass}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 - EID */}
                  <div className={currentStep === 3 ? "block" : "hidden"}>
                    <div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div>
                          <label className={labelClass}>EID Number</label>
                          <Controller
                            name="eid_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={inputBaseClass}
                                placeholder="Enter EID number"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Issued Date</label>
                          <Controller
                            name="eid_issued_date"
                            control={control}
                            rules={{
                              validate: (value) =>
                                validateIssueDate(
                                  value,
                                  eidExpiry,
                                  "EID issued date",
                                ),
                            }}
                            render={({ field }) => (
                              <>
                                {renderDatePicker({
                                  field,
                                  placeholder: "Select issued date",
                                  hasError: !!errors.eid_issued_date,
                                  maxDate: new Date(),
                                })}
                                {errors.eid_issued_date && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.eid_issued_date.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Expiry Date</label>
                          <Controller
                            name="eid_expiry_date"
                            control={control}
                            rules={{
                              validate: (value) =>
                                validateExpiryDate(
                                  value,
                                  eidIssued,
                                  "EID expiry date",
                                ),
                            }}
                            render={({ field }) => (
                              <>
                                {renderDatePicker({
                                  field,
                                  placeholder: "Select expiry date",
                                  hasError: !!errors.eid_expiry_date,
                                  minDate: getValidDate(eidIssued) || undefined,
                                })}
                                {errors.eid_expiry_date && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.eid_expiry_date.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div className="lg:col-span-3 pt-2">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className={labelClass}>Attach 1st Page</label>
                              <input
                                type="file"
                                name="eid_1st_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange("eid_1st_page", e.target.files?.[0])
                                }
                                className={fileInputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Attach 2nd Page</label>
                              <input
                                type="file"
                                name="eid_2nd_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange("eid_2nd_page", e.target.files?.[0])
                                }
                                className={fileInputClass}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 - Contact */}
                  <div className={currentStep === 4 ? "block" : "hidden"}>
                    <div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                        <div>
                          <label className={labelClass}>Dependents</label>
                          <Controller
                            name="dependents"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className={inputBaseClass}>
                                <option value="">Select option</option>
                                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Company Mobile</label>
                          <Controller
                            name="company_mobile_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="tel"
                                className={inputBaseClass}
                                placeholder="Enter company mobile number"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Personal Number</label>
                          <Controller
                            name="personal_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="tel"
                                className={inputBaseClass}
                                placeholder="Enter personal phone number"
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>
                            1st Relative/Friend number
                          </label>
                          <Controller
                            name="other_number"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="tel"
                                className={inputBaseClass}
                                placeholder="Enter alternate number"
                              />
                            )}
                          />
                        </div>

                        <div className="lg:col-span-2">
                          <label className={labelClass}>Company Email</label>
                          <Controller
                            name="company_email"
                            control={control}
                            rules={validationRules.company_email}
                            render={({ field }) => (
                              <>
                                <input
                                  {...field}
                                  type="email"
                                  className={`${inputBaseClass} ${
                                    errors.company_email ? errorInputClass : ""
                                  }`}
                                  placeholder="Enter company email (e.g. name@company.com)"
                                />
                                {errors.company_email && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.company_email.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div className="lg:col-span-2">
                          <label className={labelClass}>Personal Email</label>
                          <Controller
                            name="personal_email"
                            control={control}
                            rules={validationRules.personal_email}
                            render={({ field }) => (
                              <>
                                <input
                                  {...field}
                                  type="email"
                                  className={`${inputBaseClass} ${
                                    errors.personal_email ? errorInputClass : ""
                                  }`}
                                  placeholder="Enter personal email (e.g. name@gmail.com)"
                                />
                                {errors.personal_email && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {errors.personal_email.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>

                        <div className="lg:col-span-4 pt-2">
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div>
                              <label className={labelClass}>Education 1st Page</label>
                              <input
                                type="file"
                                name="educational_1st_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "educational_1st_page",
                                    e.target.files?.[0],
                                  )
                                }
                                className={fileInputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Education 2nd Page</label>
                              <input
                                type="file"
                                name="educational_2nd_page"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "educational_2nd_page",
                                    e.target.files?.[0],
                                  )
                                }
                                className={fileInputClass}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>
                                Home Country ID / Address Proof
                              </label>
                              <input
                                type="file"
                                name="home_country_id_proof"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    "home_country_id_proof",
                                    e.target.files?.[0],
                                  )
                                }
                                className={fileInputClass}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex items-center justify-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 font-semibold text-slate-700 transition-all hover:bg-slate-200"
                    >
                      <i className="fas fa-arrow-left"></i>
                      <span>Previous</span>
                    </button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
                    >
                      <span>Next</span>
                      <i className="fas fa-angle-double-right"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-auto flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save"></i> Save Employee
                        </>
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