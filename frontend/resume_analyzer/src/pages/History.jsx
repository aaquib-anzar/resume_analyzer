import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/resume/history");
        setHistory(res.data.history);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">History</h1>
          <p className="text-gray-500 mt-1">All your past resume analyses</p>
        </div>

        {/* Empty state */}
        {history.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <p className="text-4xl mb-4">📄</p>
            <p className="text-gray-700 font-medium">No analyses yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Upload your resume and analyze it to see results here
            </p>
          </div>
        )}

        {/* History list + Detail — side by side */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left — History List */}
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelected(item)}
                  className={`bg-white rounded-2xl p-5 shadow-sm border cursor-pointer transition hover:shadow-md ${
                    selected?._id === item._id
                      ? "border-blue-500"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.matchResult
                          ? "🎯 Job Match"
                          : "📊 Resume Analysis"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="gap-4 flex">
                      {item.analysisResult && (
                        <span className="text-blue-600 font-bold text-lg">
                          {item.analysisResult?.overallScore}%
                        </span>
                      )}
                      {item.matchResult && (
                        <span className="text-purple-600 font-bold text-lg">
                          {item.matchResult.matchScore}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Detail View */}
            {selected ? (
              <div className="space-y-4">
                {/* Analysis Detail */}
                {selected.analysisResult && (
                  <>
                    {/* Score */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">
                        Overall Score
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-5xl font-bold text-blue-600">
                          {selected.analysisResult.overallScore}
                        </p>
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{
                              width: `${selected.analysisResult.overallScore}%`,
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-3">
                        {selected.analysisResult.summary}
                      </p>
                    </div>

                    {/* Strengths */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        ✅ Strengths
                      </h3>
                      <ul className="space-y-2">
                        {selected.analysisResult.strengths?.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex gap-2"
                          >
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
                        {selected.analysisResult.improvements?.map((imp, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex gap-2"
                          >
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
                        {selected.analysisResult.missingKeywords?.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Match Detail */}
                {selected.matchResult && (
                  <>
                    {/* Match Score */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Match Score</p>
                      <div className="flex items-center gap-4">
                        <p className="text-5xl font-bold text-purple-600">
                          {selected.matchResult.matchScore}%
                        </p>
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-purple-600 h-3 rounded-full"
                            style={{
                              width: `${selected.matchResult.matchScore}%`,
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-3">
                        {selected.matchResult.verdict}
                      </p>
                    </div>

                    {/* Matched Keywords */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        ✅ Matched Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selected.matchResult.matchedKeywords?.map((kw, i) => (
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
                        {selected.matchResult.missingKeywords?.map((kw, i) => (
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
                        {selected.matchResult.suggestions?.map((s, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex gap-2"
                          >
                            <span className="text-blue-500">•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <p className="text-4xl mb-4">👈</p>
                <p className="text-gray-500 text-sm">
                  Select an analysis from the left to view details
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
