import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { showToast } from '../components/common/Toast';
import { addAgreement } from '../store/slices/agreementsSlice';

const AddAgreement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedShareWith, setSelectedShareWith] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    folder: '',
    expiryDate: '',
  });

  // Employee data for sharing
  const employees = [
    { id: 1, name: "JITHIN", designation: "IT Manager" },
    { id: 2, name: "FAWZY", designation: "Business Development Manager" },
    { id: 3, name: "FAHEEM", designation: "Corporate Secretary" },
    { id: 4, name: "ASLAN", designation: "Director" },
    { id: 5, name: "ABHILASH", designation: "Finance Manager" },
    { id: 6, name: "AKSHAY", designation: "General Accountant" },
    { id: 7, name: "VIJAY", designation: "Business Head GCC" },
    { id: 8, name: "SUNEEL", designation: "Business Development Manager" },
    { id: 9, name: "SHANOOB", designation: "Digital Marketing Strategist" },
    { id: 10, name: "SENTIL", designation: "General Manager" }
  ];

  const groups = [
    { name: "All Employees", value: "All Employees" },
    { name: "HR Team", value: "HR Team" },
    { name: "Managers", value: "Managers" },
    { name: "Finance Team", value: "Finance Team" },
    { name: "IT Team", value: "IT Team" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 10) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.replace(/\.[^/.]+$/, '') });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 10) {
        showToast('File size must be less than 10MB', 'error');
        return;
      }
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.replace(/\.[^/.]+$/, '') });
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleShareItem = (value) => {
    if (selectedShareWith.includes(value)) {
      setSelectedShareWith(selectedShareWith.filter(item => item !== value));
    } else {
      setSelectedShareWith([...selectedShareWith, value]);
    }
  };

  const removeSelectedItem = (item) => {
    setSelectedShareWith(selectedShareWith.filter(i => i !== item));
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      showToast('File name is required', 'error');
      return;
    }
    if (selectedShareWith.length === 0) {
      showToast('Please select at least one recipient to share with', 'error');
      return;
    }
    if (!formData.folder) {
      showToast('Please select a folder', 'error');
      return;
    }
    if (!selectedFile) {
      showToast('Please upload a file', 'error');
      return;
    }
    
    setLoading(true);
    
    const agreementData = {
      name: formData.name,
      description: formData.description,
      shareWith: selectedShareWith,
      folder: formData.folder,
      expiry: formData.expiryDate,
      fileName: selectedFile.name,
      fileSize: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      uploadedBy: 'HR Admin',
    };
    
    const result = await dispatch(addAgreement(agreementData));
    setLoading(false);
    
    if (addAgreement.fulfilled.match(result)) {
      showToast(`✓ Agreement "${formData.name}" uploaded successfully!`, 'success');
      setTimeout(() => {
        navigate('/agreements');
      }, 1200);
    } else {
      showToast('Failed to upload agreement', 'error');
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
            <Link to="/agreements" className="text-green-500 hover:text-green-600 font-medium">Agreements</Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-gray-500 dark:text-gray-400">Add Agreement</span>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              <i className="fas fa-file-upload mr-2"></i> Add Agreement File
            </h2>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8 shadow-soft">
            <form onSubmit={handleSubmit}>
              {/* Upload File Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-green-100 dark:border-green-900/30 mb-6">
                  <i className="fas fa-cloud-upload-alt text-green-500 text-lg"></i>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Upload File</h3>
                </div>
                
                <div
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                >
                  <div className="mb-4">
                    <i className="fas fa-file-upload text-6xl text-green-500"></i>
                  </div>
                  <div className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Drag & Drop files here or click to upload
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    All standard document file types such as .pdf .docx .xls can be uploaded with a maximum file size of 10 MB
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-file-pdf text-2xl text-green-500"></i>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedFile.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-red-500 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Agreement Details Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 pb-3 border-b-2 border-green-100 dark:border-green-900/30 mb-6">
                  <i className="fas fa-info-circle text-green-500 text-lg"></i>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Agreement Details</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-tag text-green-500 mr-1"></i> File Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter file name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-align-left text-green-500 mr-1"></i> Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="form-input"
                      placeholder="Enter description about this agreement"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-share-alt text-green-500 mr-1"></i> Share with <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                      >
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {selectedShareWith.length === 0 ? (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Select employees or groups...</span>
                          ) : (
                            selectedShareWith.map(item => (
                              <span key={item} className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-xs">
                                {item}
                                <i
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSelectedItem(item);
                                  }}
                                  className="fas fa-times cursor-pointer hover:text-red-500"
                                ></i>
                              </span>
                            ))
                          )}
                        </div>
                        <i className={`fas fa-chevron-down text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
                      </div>
                      
                      {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-soft-lg z-10 max-h-80 overflow-y-auto">
                          {/* Groups Section */}
                          <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                              <i className="fas fa-users text-green-500 mr-1 text-xs"></i>
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Groups</span>
                            </div>
                            {groups.map(group => (
                              <div
                                key={group.value}
                                onClick={() => toggleShareItem(group.value)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedShareWith.includes(group.value)}
                                  onChange={() => {}}
                                  className="w-4 h-4 accent-green-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{group.name}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Employees Section */}
                          <div>
                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                              <i className="fas fa-user-circle text-green-500 mr-1 text-xs"></i>
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Employees</span>
                            </div>
                            {employees.map(emp => (
                              <div
                                key={emp.id}
                                onClick={() => toggleShareItem(emp.name)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedShareWith.includes(emp.name)}
                                  onChange={() => {}}
                                  className="w-4 h-4 accent-green-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {emp.name} <span className="text-xs text-gray-500">({emp.designation})</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <i className="fas fa-folder text-green-500 mr-1"></i> Folders <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="folder"
                        value={formData.folder}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select Folder</option>
                        <option value="Company Policies">Company Policies</option>
                        <option value="Employee Contracts">Employee Contracts</option>
                        <option value="NDA Agreements">NDA Agreements</option>
                        <option value="Vendor Agreements">Vendor Agreements</option>
                        <option value="HR Documents">HR Documents</option>
                        <option value="Legal Documents">Legal Documents</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <i className="fas fa-calendar-times text-green-500 mr-1"></i> File Expiry Date
                      </label>
                      <input
                        type="date"
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/agreements"
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
                    <><i className="fas fa-save"></i> Save Agreement</>
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

export default AddAgreement;