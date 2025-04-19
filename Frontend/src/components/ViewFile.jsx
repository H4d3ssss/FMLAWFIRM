import React, { useEffect, useState } from "react";

const ViewFile = ({ filePath, closeModal }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    // Construct the full URL to fetch the file
    setFileUrl(`${window.location.origin}/files/uploads/${filePath}`);
  }, [filePath]);

  if (!fileUrl) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-lg relative">
        <div className="bg-yellow-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">View File</h2>
          <button onClick={closeModal} className="text-black text-xl font-bold">
            X
          </button>
        </div>

        <div className="p-6">
          <iframe
            src={fileUrl}
            width="100%"
            height="500px"
            title="File Viewer"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ViewFile;
