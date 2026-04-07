import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import EntriesSelector from "../common/EntriesSelector";
import Pagination from "../common/Paginations";
import { useSelector } from "react-redux";

const RecentFiles = () => {
  const { recentData } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const documents = [
    ...(recentData?.agreements || []),
    ...(recentData?.hr || []),
    ...(recentData?.others || []),
    ...(recentData?.organization_files || []),
  ];

  const folders = [
    { name: "All Files", value: "all", icon: "fas fa-folder-open" },
    { name: "Agreements", value: "Agreements", icon: "fas fa-file-signature" },
    { name: "HR", value: "HR", icon: "fas fa-users" },
    { name: "Employees", value: "Employees", icon: "fas fa-user-tie" },
    { name: "Folders", value: "Folders", icon: "fas fa-folder" },
    { name: "Others", value: "Others", icon: "fas fa-ellipsis-h" },
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
        navigate("/add-agreement");
        break;
      case "HR":
        navigate("/add-agreement");
        break;
      case "Employees":
        navigate("/add-employee");
        break;
      case "Folders": {
        const folderName = prompt("Enter folder name:", "New Folder");
        if (folderName) {
          alert(`Folder "${folderName}" created`);
        }
        break;
      }
      case "Others": {
        const fileName = prompt("Enter file name:", "New File");
        if (fileName) {
          alert(`File "${fileName}" added`);
        }
        break;
      }
      default:
        navigate("/add-company");
    }
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
                        : "Add Company"}
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
                key={idx}
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
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {doc.expiry || "No Expiry"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-blue-500">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-amber-500">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
    </div>
  );
};

export default RecentFiles;
