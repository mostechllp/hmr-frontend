import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { showToast } from '../components/common/Toast';
import { addOrganization } from '../store/slices/organizationSlice';

const AddCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    multiCompany: 'Yes',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Logo size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      showToast('Organization name is required', 'error');
      return;
    }
    if (!formData.phone) {
      showToast('Phone number is required', 'error');
      return;
    }
    if (!formData.email) {
      showToast('Email address is required', 'error');
      return;
    }
    
    setLoading(true);
    
    const organizationData = {
      ...formData,
      logo: logoPreview,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
    };
    
    const result = await dispatch(addOrganization(organizationData));
    setLoading(false);
    
    if (addOrganization.fulfilled.match(result)) {
      showToast(`✓ Organization "${formData.name}" added successfully!`, 'success');
      setTimeout(() => {
        navigate('/organizations');
      }, 1200);
    } else {
      showToast('Failed to add organization', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link to="/organizations" className="text-green-500 hover:text-green-600 font-medium">Organizations</Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-gray-500 dark:text-gray-400">Add Company</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              <i className="fas fa-building mr-2"></i> Add New Company
            </h2>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8 shadow-soft">
            <form onSubmit={handleSubmit}>
              {/* Company Details Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-green-100 dark:border-green-900/30 mb-6">
                  <i className="fas fa-info-circle text-green-500 text-lg"></i>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Company Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-building text-green-500 mr-1"></i> Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter organization name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-phone text-green-500 mr-1"></i> Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-envelope text-green-500 mr-1"></i> Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter email address"
                      required
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
                      rows="3"
                      className="form-input"
                      placeholder="Enter full address"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-sitemap text-green-500 mr-1"></i> Has Multiple Companies?
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="multiCompany"
                          value="Yes"
                          checked={formData.multiCompany === 'Yes'}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="multiCompany"
                          value="No"
                          checked={formData.multiCompany === 'No'}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Logo Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-green-100 dark:border-green-900/30 mb-6">
                  <i className="fas fa-image text-green-500 text-lg"></i>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Company Logo</h3>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                  <input
                    type="file"
                    id="logoInput"
                    accept="image/jpeg,image/png,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <label htmlFor="logoInput" className="cursor-pointer block">
                    <div className="upload-icon mb-3">
                      <i className="fas fa-cloud-upload-alt text-5xl text-green-500"></i>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload logo</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max size: 2MB. Format: JPG, PNG, SVG</div>
                  </label>
                </div>
                
                {logoPreview && (
                  <div className="mt-4 flex justify-center">
                    <img src={logoPreview} alt="Logo Preview" className="max-w-[120px] max-h-[120px] rounded-xl border-2 border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800" />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/organizations"
                  className="px-6 py-2.5 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-times"></i> Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  ) : (
                    <><i className="fas fa-save"></i> Save Organization</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCompany;