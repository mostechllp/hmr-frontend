import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCompanies } from '../../store/slices/companySlice';

const UploadAttendanceModal = ({ isOpen, onClose, onUpload }) => {
  const dispatch = useDispatch();
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch companies when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCompaniesList();
    }
  }, [isOpen]);

  const fetchCompaniesList = async () => {
    setLoadingCompanies(true);
    try {
      // Fetch all companies (you might need to pass organization_id if required)
      const result = await dispatch(fetchCompanies()).unwrap();
      console.log("Fetched companies:", result);
      
      // Extract companies from the result
      let companiesList = [];
      if (result && result.companies) {
        companiesList = result.companies;
      } else if (Array.isArray(result)) {
        companiesList = result;
      } else if (result && result.data) {
        companiesList = result.data;
      }
      
      setCompanies(companiesList);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setError('');
    
    if (file) {
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!['.dat', '.csv', '.txt'].includes(fileExt)) {
        setError('Please upload .dat, .csv, or .txt files only');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompanyId(companyId);
    
    // Find and set company name for display
    const selectedCompany = companies.find(c => c.id === parseInt(companyId));
    if (selectedCompany) {
      setSelectedCompanyName(selectedCompany.name || selectedCompany.company_name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedCompanyId) {
      setError('Please select a company');
      return;
    }
    if (!selectedFile) {
      setError('Please select an attendance file');
      return;
    }

    setUploading(true);
    
    try {
      await onUpload({
        company_id: selectedCompanyId,  // Send company_id to API
        company_name: selectedCompanyName,
        file: selectedFile
      });
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file. Please check the file format and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedCompanyId('');
    setSelectedCompanyName('');
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-[90%] p-7 shadow-soft-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <i className="fas fa-cloud-upload-alt text-green-500"></i>
            Upload Attendance
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-red-500 transition-colors text-2xl">
            &times;
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <i className="fas fa-building text-green-500 mr-1"></i> Select Company <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              required
              disabled={loadingCompanies}
            >
              <option value="">{loadingCompanies ? "Loading companies..." : "Select Company"}</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name || company.company_name}
                </option>
              ))}
            </select>
            {companies.length === 0 && !loadingCompanies && (
              <p className="text-xs text-red-500 mt-1">No companies found. Please add a company first.</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <i className="fas fa-file-alt text-green-500 mr-1"></i> Attendance File <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
            >
              <div className="mb-3">
                <i className="fas fa-file-upload text-5xl text-green-500"></i>
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload attendance file</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Accepted formats: .dat (space-separated) or .csv
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                File should contain: Employee ID, Name, Date, Punch In, Punch Out
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".dat,.csv,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFile && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fas fa-file-csv text-2xl text-green-500"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedFile.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-red-500 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || loadingCompanies || companies.length === 0}
              className="px-5 py-2 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><i className="fas fa-spinner fa-spin"></i> Uploading...</>
              ) : (
                <><i className="fas fa-upload"></i> Upload</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAttendanceModal;