const FoldersTable = ({
  pageDocs,
  start,
  handleEdit,
  handleDeleteClick
}) => {
  return (
    <table className="w-full border-collapse min-w-[800px]">
      <thead>
        <tr className="bg-gray-50 dark:bg-gray-700/50">
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sl.No.</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Folder Name</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th>
        </tr>
      </thead>

      <tbody>
        {pageDocs.map((folder, idx) => (
          <tr key={folder.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{start + idx + 1}</td>
            <td className="px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <i className="fas fa-folder-open text-green-500 text-sm"></i>
                {folder.name}
              </span>
            </td>

            <td className="px-4 py-3">
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(folder)}
                  className="text-amber-500 hover:text-amber-600 transition-colors"
                  title="Edit folder"
                >
                  <i className="fas fa-edit text-sm"></i>
                </button>
                <button 
                  onClick={() => handleDeleteClick(folder)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Delete folder"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              </div>
            </td>
          </tr>
        ))}

        {pageDocs.length === 0 && (
          <tr>
            <td colSpan="3" className="text-center py-8 text-gray-400 dark:text-gray-500">
              <i className="fas fa-folder-open text-3xl mb-2 block"></i>
              <p>No folders found</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FoldersTable;