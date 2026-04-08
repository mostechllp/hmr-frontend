import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { showToast } from "../components/common/Toast";
import { fetchCompanies, updateCompany } from "../store/slices/companySlice";

const EditCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { organizationId, id } = useParams();
  const {
    companies,
    loading: fetchLoading,
    currentOrganizationName,
  } = useSelector((state) => state.companies || {});

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);
  const [, setOriginalLogo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch companies if not already loaded
  useEffect(() => {
    if (!companies || companies.length === 0) {
      dispatch(fetchCompanies(parseInt(organizationId))).then(() => {
        setInitialLoading(false);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialLoading(false);
    }
  }, [dispatch, organizationId, companies]);

  // Load company data when available
  useEffect(() => {
    if (companies && companies.length > 0 && id) {
      const company = companies.find((comp) => comp.id === parseInt(id));
      if (company) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: company.name || "",
          phone: company.phone || "",
          email: company.email || "",
          address: company.address || "",
        });
        if (company.logo) {
          setOriginalLogo(company.logo);
          setLogoPreview(company.logo);
        }
      } else {
        showToast("Company not found", "error");
        navigate(`/organizations/${organizationId}/companies`);
      }
    }
  }, [companies, id, navigate, organizationId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Logo size must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setOriginalLogo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      showToast("Company name is required", "error");
      return;
    }
    if (!formData.phone) {
      showToast("Phone number is required", "error");
      return;
    }
    if (!formData.email) {
      showToast("Email address is required", "error");
      return;
    }

    setLoading(true);

    const companyData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      logo: logoPreview,
    };

    const result = await dispatch(
      updateCompany({ id: parseInt(id), data: companyData }),
    );
    setLoading(false);

    if (updateCompany.fulfilled.match(result)) {
      showToast(
        `✓ Company "${formData.name}" updated successfully!`,
        "success",
      );
      setTimeout(() => {
        navigate(`/organizations/${organizationId}/companies`);
      }, 1200);
    } else {
      const errorMsg = result.payload || "Failed to update company";
      showToast(errorMsg, "error");
    }
  };

  if (initialLoading || fetchLoading) {
    return (
      <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div
          className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? "md:ml-[72px]" : ""}`}
        >
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? "md:ml-[72px]" : ""}`}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          <div className="max-w-4xl mx-auto w-full">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6 flex-wrap">
              <Link
                to="/organizations"
                className="text-green-500 hover:text-green-600 font-medium"
              >
                Organizations
              </Link>
              <i className="fas fa-chevron-right text-gray-400 text-[10px] md:text-xs"></i>
              <Link
                to={`/organizations/${organizationId}/companies`}
                state={{ organizationName: currentOrganizationName }}
                className="text-green-500 hover:text-green-600 font-medium"
              >
                {currentOrganizationName || "Companies"}
              </Link>
              <i className="fas fa-chevron-right text-gray-400 text-[10px] md:text-xs"></i>
              <span className="text-gray-500 dark:text-gray-400">
                Edit Company
              </span>
            </div>

            {/* Page Header */}
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
                <i className="fas fa-edit mr-2"></i> Edit Company
              </h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update company information
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 lg:p-8 shadow-soft">
              <form onSubmit={handleSubmit}>
                {/* Company Details Section */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-green-100 dark:border-green-900/30 mb-4 md:mb-6">
                    <i className="fas fa-info-circle text-green-500 text-base md:text-lg"></i>
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">
                      Company Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {/* Parent Organization - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        <i className="fas fa-sitemap text-green-500 mr-1"></i>{" "}
                        Parent Organization
                      </label>
                      <input
                        type="text"
                        value={currentOrganizationName || "Loading..."}
                        disabled
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm md:text-base text-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    {/* Company Name - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        <i className="fas fa-building text-green-500 mr-1"></i>{" "}
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        <i className="fas fa-phone text-green-500 mr-1"></i>{" "}
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        <i className="fas fa-envelope text-green-500 mr-1"></i>{" "}
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    {/* Address - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        <i className="fas fa-map-marker-alt text-green-500 mr-1"></i>{" "}
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 transition-all focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-vertical"
                        placeholder="Enter full address"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Company Logo Section */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 pb-3 border-b-2 border-green-100 dark:border-green-900/30 mb-4 md:mb-6">
                    <i className="fas fa-image text-green-500 text-base md:text-lg"></i>
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200">
                      Company Logo
                    </h3>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 md:p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                    <input
                      type="file"
                      id="logoInput"
                      accept="image/jpeg,image/png,image/svg+xml"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <label htmlFor="logoInput" className="cursor-pointer block">
                      <div className="upload-icon mb-2 md:mb-3">
                        <i className="fas fa-cloud-upload-alt text-3xl md:text-5xl text-green-500"></i>
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload new logo
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 md:mt-2">
                        Max size: 2MB. Format: JPG, PNG, SVG
                      </div>
                    </label>
                  </div>

                  {logoPreview && (
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-w-[80px] md:max-w-[120px] max-h-[80px] md:max-h-[120px] rounded-xl border-2 border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800 object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-red-500 hover:text-red-600 text-xs md:text-sm flex items-center gap-1 transition-colors"
                      >
                        <i className="fas fa-trash"></i> Remove Logo
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to={`/organizations/${organizationId}/companies`}
                    className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <i className="fas fa-times text-xs md:text-sm"></i>
                    <span>Cancel</span>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>{" "}
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save text-xs md:text-sm"></i>{" "}
                        <span>Update Company</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCompany;
