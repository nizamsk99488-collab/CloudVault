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

  // Fetch only logged-in user's files
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
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          CloudVault
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-6">
          Welcome, {user?.name} 👋
        </h2>

        <button
          onClick={handleUploadClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-6"
        >
          Upload File
        </button>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold mb-4">
            My Files
          </h3>

          {files.length === 0 ? (
            <p>No files uploaded.</p>
          ) : (
            files.map((file) => (
              <div
                key={file._id}
                className="flex justify-between items-center border-b py-3"
              >
                <span>📄 {file.fileName}</span>

                <div className="space-x-2">
                  <button
                    onClick={() => handleDownload(file._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;