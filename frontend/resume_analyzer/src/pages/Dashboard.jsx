import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/resume/history");
        setHistory(response.data.history.slice(0, 3));
      } catch (error) {
        console.error("Error fetching history:", error.message);
      }
    };
    fetchHistory();
  }, []);
  console.log("User history:", history);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    setUploading(true);
    try {
      const response = await api.post("resume/upload", formData);
      setResumeText(response.data.text);
    } catch (error) {
      setError(error.response?.data?.message || "Error uploading resume");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 ">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Upload your resume to get AI powered feedback and insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Analyses</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {history.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Last Score</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {history[0]?.analysisResult?.overallScore ?? "--"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Last Match Score</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {history[0]?.matchResult?.matchScore ?? "--"}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Upload Resume
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload and Analyze"}
            </button>
          </div>

          {resumeText && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm font-medium mb-3">
                ✅ Resume uploaded successfully!
              </p>
              <button
                onClick={() => navigate("/analyze", { state: { resumeText } })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Analyze Resume
              </button>
            </div>
          )}
        </div>
      </div>
      {history.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Analyses
            </h2>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.analysisResult ? "Resume Analysis" : "Job Match"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {item.analysisResult && (
                      <span className="text-blue-600 font-bold text-sm">
                        Score: {item.analysisResult.overallScore}
                      </span>
                    )}
                    {item.matchResult && (
                      <span className="text-green-600 font-bold text-sm">
                        Match Score: {item.matchResult.matchScore}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
