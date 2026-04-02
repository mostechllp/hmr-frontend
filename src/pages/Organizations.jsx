import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import EntriesSelector from "../components/common/EntriesSelector";
import Loader from "../components/common/Loader";
import { showToast } from "../components/common/Toast";
import {
  fetchOrganizations,
  deleteOrganization,
} from "../store/slices/organizationSlice";
import Pagination from "../components/common/Paginations";

const Organizations = () => {
  const dispatch = useDispatch();
  const { organizations = [], loading } = useSelector(
    (state) => state.organizations || {},
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const getFilteredOrgs = () => {
    let filtered = organizations;
    if (searchTerm) {
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.phone.includes(searchTerm),
      );
    }
    return filtered;
  };

  const filteredOrgs = getFilteredOrgs();
  const totalFiltered = filteredOrgs.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageOrgs = filteredOrgs.slice(start, start + perPage);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const result = await dispatch(deleteOrganization(id));
      if (deleteOrganization.fulfilled.match(result)) {
        showToast(`${name} deleted successfully`, "success");
      } else {
        showToast("Failed to delete organization", "error");
      }
    }
  };

  const handleViewSubsidiaries = (orgName) => {
    alert(
      `📋 ${orgName} subsidiary management is available.\n\nClick "Manage Companies" to view detailed structure.`,
    );
  };

  const totalOrgs = organizations.length;
  const multiCompanyCount = organizations.filter(
    (o) => o.multiCompany === "Yes",
  ).length;

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-building text-green-600 dark:text-green-400 text-xl"></i>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                {totalOrgs}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Total Organizations
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-sitemap text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {multiCompanyCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Multi-Company Enabled
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Organization Directory
            </h2>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex gap-3">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, email..."
              />
              <Link
                to="/organizations/add-company"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-plus-circle"></i> Add Company
              </Link>
            </div>
          </div>

          {/* Organizations Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Logo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Org Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Multi-Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageOrgs.map((org) => (
                  <tr
                    key={org.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                        <i className="fas fa-briefcase text-lg"></i>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {org.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {org.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {org.email}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewSubsidiaries(org.name)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          org.multiCompany === "Yes"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <i
                          className={`fas ${org.multiCompany === "Yes" ? "fa-sitemap" : "fa-building"} text-xs`}
                        ></i>
                        {org.multiCompany === "Yes"
                          ? "Manage Companies"
                          : "Single Entity"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {org.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/edit-company/${org.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500 transition-colors"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(org.id, org.name)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageOrgs.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No organizations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalFiltered}
            itemsPerPage={perPage}
          />
        </main>
      </div>
    </div>
  );
};

export default Organizations;
