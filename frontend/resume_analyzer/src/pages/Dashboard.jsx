import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-6">Welcome to your dashboard!</p>
      </div>
    </div>
  );
};

export default Dashboard;