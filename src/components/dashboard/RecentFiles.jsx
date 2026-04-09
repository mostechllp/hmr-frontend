import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import EntriesSelector from "../common/EntriesSelector";
import Pagination from "../common/Paginations";
import { useSelector } from "react-redux";
import ConfirmModal from "../common/ConfirmModal";
import { showToast } from "../common/Toast";

const RecentFiles = () => {
  const { recentData } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documents = [
    ...(recentData?.agreements || []),
    ...(recentData?.hr || []),
    ...(recentData?.others || []),
    ...(recentData?.organization_files || []),
  ];

  const folders = [
    { name: "All Files", value: "all", icon: "fas fa-folder-open", route: null },
    { name: "Agreements", value: "Agreements", icon: "fas fa-file-signature", route: "/agreements/add-agreement" },
    { name: "HR", value: "HR", icon: "fas fa-users", route: "/agreements/add-agreement" },
    { name: "Employees", value: "Employees", icon: "fas fa-user-tie", route: "/employees/add-employee" },
    { name: "Folders", value: "Folders", icon: "fas fa-folder", route: "create-folder" },
    { name: "Others", value: "Others", icon: "fas fa-ellipsis-h", route: "create-file" },
  ];

  const getFilteredDocs = () => {
    let filtered =
      activeFolder === "all"
        ? documents
        : documents.filter((doc) => doc.folder === activeFolder);
    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  };

  const filteredDocs = getFilteredDocs();
  const totalPages = Math.ceil(filteredDocs.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageDocs = filteredDocs.slice(start, start + perPage);

  const handleAddClick = () => {
    
    switch (activeFolder) {
      case "Agreements":
        navigate("/agreements/add-agreement");
        break;
      case "HR":
        navigate("/agreements/add-agreement");
        break;
      case "Employees":
        navigate("/employees/add-employee");
        break;
      case "Folders": {
        const folderName = prompt("Enter folder name:", "New Folder");
        if (folderName) {
          // TODO: API call to create folder
          showToast(`Folder "${folderName}" created successfully`, "success");
        }
        break;
      }
      case "Others": {
        const fileName = prompt("Enter file name:", "New File");
        if (fileName) {
          // TODO: API call to create file
          showToast(`File "${fileName}" added successfully`, "success");
        }
        break;
      }
      default:
        navigate("/agreements/add-agreement");
    }
  };

  const handleView = (doc) => {
    if (doc.file_path) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || window.location.origin;
      const fileUrl = `${baseUrl}/storage/${doc.file_path.replace(/^\/+/, '')}`;
      window.open(fileUrl, '_blank');
    } else {
      showToast("No document file available", "info");
    }
  };

  const handleEdit = (doc) => {
    // Navigate to appropriate edit page based on document type
    if (doc.type === 'agreement' || doc.folder === 'Agreements') {
      navigate(`/agreements/edit-agreement/${doc.id}`);
    } else if (doc.folder === 'HR') {
      navigate(`/agreements/edit-agreement/${doc.id}`);
    } else if (doc.folder === 'Employees') {
      navigate(`/employees/edit/${doc.employee_id || doc.id}`);
    }
  };

  const handleDeleteClick = (doc) => {
    setSelectedDocument(doc);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDocument) return;
    
    // TODO: API call to delete document
    showToast(`${selectedDocument.name} deleted successfully`, "success");
    setConfirmOpen(false);
    setSelectedDocument(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No Expiry';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getExpiryClass = (expiryDate) => {
    if (!expiryDate) return '';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-500 font-semibold';
    if (diffDays <= 30) return 'text-amber-500 font-semibold';
    return '';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          <i className="fas fa-folder-open mr-2 text-green-500"></i>
          {folders.find((f) => f.value === activeFolder)?.name || "All Files"}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
          {folders.map((folder) => (
            <button
              key={folder.value}
              onClick={() => setActiveFolder(folder.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFolder === folder.value
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30"
              }`}
            >
              <i className={`${folder.icon} mr-1 text-xs`}></i>
              {folder.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <EntriesSelector value={perPage} onChange={setPerPage} />
          <div className="flex gap-3">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search records..."
            />
            <button
              onClick={handleAddClick}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <i className="fas fa-plus"></i>
              {activeFolder === "Agreements"
                ? "Add Agreement"
                : activeFolder === "HR"
                  ? "Add HR Document"
                  : activeFolder === "Employees"
                    ? "Add Employee"
                    : activeFolder === "Folders"
                      ? "Create Folder"
                      : activeFolder === "Others"
                        ? "Add Other File"
                        : "Add Document"}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                S.L.NO.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Document Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Folder
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Expiry Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pageDocs.map((doc, idx) => (
              <tr
                key={doc.id || idx}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-3 text-sm text-center">
                  {start + idx + 1}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {doc.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                    {doc.folder}
                  </span>
                </td>
                <td className={`px-4 py-3 text-sm ${getExpiryClass(doc.expiry)}`}>
                  {formatDate(doc.expiry)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(doc)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-blue-500 transition-colors"
                      title="View"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      onClick={() => handleEdit(doc)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-amber-500 transition-colors"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(doc)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageDocs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No documents found in this folder
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredDocs.length}
          itemsPerPage={perPage}
        />
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${selectedDocument?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default RecentFiles;