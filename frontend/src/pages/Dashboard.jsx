import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, []);

  // Fetch user's files
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/files?userId=${user._id}`
      );

      setFiles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged Out Successfully");
    navigate("/login");
  };

  // Open file picker
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Upload file
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user._id);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );

      alert(res.data.message);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("File Upload Failed");
    }

    e.target.value = "";
  };

  // Download file
  const handleDownload = (id) => {
    window.open(
      `http://localhost:5000/api/files/download/${id}`,
      "_blank"
    );
  };

  // Delete file
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/files/${id}`
      );

      alert(res.data.message);
      fetchFiles();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow-md px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
          CloudVault
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-10">

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name} 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your files easily.
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-6"
        >
          ☁️ Upload File
        </button>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* Files Section */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">

          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            My Files
          </h3>

          {files.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-4xl mb-3">📂</p>
              <p>No files uploaded.</p>
            </div>
          ) : (
            <div className="space-y-3">

              {files.map((file) => (
                <div
                  key={file._id}
                  className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >

                  {/* File Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">
                      📄
                    </span>

                    <span className="font-medium truncate">
                      {file.fileName}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto">

                    <button
                      onClick={() => handleDownload(file._id)}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => handleDelete(file._id)}
                      className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;