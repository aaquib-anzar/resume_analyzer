import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const Analyze = () => {
  const location = useLocation();
  const [resumeText, setResumeText] = useState(location.state?.resumeText || "");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.state?.showMatch ? "match" : "analyze"
  );
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError("Please paste your resume text first");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/resume/analyze", { resumeText });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both resume text and job description");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/resume/match", { resumeText, jobDescription });
      setMatchResult(res.data.matchResult);
    } catch (err) {
      setError(err.response?.data?.message || "Error matching resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analyze Resume</h1>
          <p className="text-gray-500 mt-1">
            Get AI powered feedback or match against a job description
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "analyze"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Resume Analysis
          </button>
          <button
            onClick={() => setActiveTab("match")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "match"
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Job Match
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Resume Text Input */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <label className="text-sm font-medium text-gray-700">
            Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Your resume text will appear here after upload, or paste it manually..."
            rows={6}
            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Job Description — only on match tab */}
        {activeTab === "match" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={activeTab === "analyze" ? handleAnalyze : handleMatch}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-medium transition disabled:opacity-50 ${
            activeTab === "analyze"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading
            ? "Processing..."
            : activeTab === "analyze"
            ? "Analyze Resume"
            : "Match with Job"}
        </button>

        {/* Analysis Results */}
        {analysis && activeTab === "analyze" && (
          <div className="mt-8 space-y-4">

            {/* Score */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Overall Score</p>
              <div className="flex items-center gap-4">
                <p className="text-5xl font-bold text-blue-600">
                  {analysis.overallScore}
                </p>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${analysis.overallScore}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">{analysis.summary}</p>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ✅ Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-green-500">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ⚠️ Improvements
              </h3>
              <ul className="space-y-2">
                {analysis.improvements?.map((imp, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-yellow-500">•</span> {imp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                🔍 Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                💡 Suggestions
              </h3>
              <div className="space-y-2">
                {Object.entries(analysis.suggestions || {}).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-gray-700 capitalize">{key}: </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Match Results */}
        {matchResult && activeTab === "match" && (
          <div className="mt-8 space-y-4">

            {/* Match Score */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Match Score</p>
              <div className="flex items-center gap-4">
                <p className="text-5xl font-bold text-purple-600">
                  {matchResult.matchScore}%
                </p>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${matchResult.matchScore}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3">{matchResult.verdict}</p>
            </div>

            {/* Matched Keywords */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ✅ Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchedKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ❌ Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                💡 Suggestions
              </h3>
              <ul className="space-y-2">
                {matchResult.suggestions?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-blue-500">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Analyze;