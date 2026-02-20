import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  FiToggleLeft,
  FiToggleRight,
  FiCheck,
  FiX,
  FiBriefcase,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';

const INCOMING_REQUESTS = [
  {
    id: 1,
    customer: 'Alex Thompson',
    service: 'Leaky Kitchen Faucet',
    category: 'Plumbing',
    description: 'Kitchen faucet has been dripping for 2 days. Need it fixed ASAP.',
    budget: '$80 - $120',
    distance: '0.5 mi',
    time: '2 min ago',
    urgency: 'Urgent',
    urgencyColor: 'bg-red-50 text-red-600',
  },
  {
    id: 2,
    customer: 'Maria Garcia',
    service: 'Bathroom Renovation',
    category: 'Plumbing',
    description: 'Full bathroom pipe re-routing. Need professional assessment.',
    budget: '$200 - $400',
    distance: '1.2 mi',
    time: '15 min ago',
    urgency: 'Scheduled',
    urgencyColor: 'bg-blue-50 text-blue-600',
  },
  {
    id: 3,
    customer: 'Robert Kim',
    service: 'Water Heater Repair',
    category: 'Plumbing',
    description: 'Water heater making strange noises and not heating properly.',
    budget: '$150 - $250',
    distance: '2.3 mi',
    time: '1 hr ago',
    urgency: 'Normal',
    urgencyColor: 'bg-gray-50 text-gray-600',
  },
  {
    id: 4,
    customer: 'Jennifer Lee',
    service: 'Outdoor Faucet Installation',
    category: 'Plumbing',
    description: 'Need a new outdoor faucet installed on the south side of the house.',
    budget: '$100 - $180',
    distance: '3.1 mi',
    time: '3 hr ago',
    urgency: 'Normal',
    urgencyColor: 'bg-gray-50 text-gray-600',
  },
];

const STATS = [
  {
    label: 'Jobs Completed',
    value: '856',
    change: '+12 this week',
    changeColor: 'text-emerald-500',
    icon: FiBriefcase,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    label: 'Earnings',
    value: '$12,450',
    change: '+$1,280 this week',
    changeColor: 'text-emerald-500',
    icon: FiDollarSign,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    label: 'Rating',
    value: '4.9',
    change: '342 reviews',
    changeColor: 'text-amber-500',
    icon: FiStar,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    label: 'Completion Rate',
    value: '98%',
    change: '+2% vs last month',
    changeColor: 'text-emerald-500',
    icon: FiTrendingUp,
    gradient: 'from-purple-500 to-pink-600',
  },
];

export default function ProDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState(INCOMING_REQUESTS);

  const handleAccept = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    // In a real app, this would call the API via axiosInstance
  };

  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pro Dashboard</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {user?.displayName || 'Professional'} 🔧
                </h1>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Work Availability</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isAvailable ? 'Visible to customers' : 'Hidden from search'}
                  </p>
                </div>
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className="transition-all"
                >
                  {isAvailable ? (
                    <FiToggleRight className="w-12 h-12 text-emerald-400" />
                  ) : (
                    <FiToggleLeft className="w-12 h-12 text-gray-500" />
                  )}
                </button>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                  {isAvailable ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8">
          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                <p className={`text-xs font-medium mt-1 ${stat.changeColor}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          {/* ── Incoming Job Requests ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Incoming Job Requests</h2>
                <p className="text-sm text-gray-500 mt-0.5">{requests.length} new requests</p>
              </div>
              <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-500/25">
                {requests.length}
              </span>
            </div>

            {requests.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="px-6 py-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Customer Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                        <FiUser className="w-6 h-6 text-blue-500" />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{request.service}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${request.urgencyColor}`}>
                            {request.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.customer}</p>
                        <p className="text-sm text-gray-500 mb-3">{request.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="w-3.5 h-3.5" /> {request.budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3.5 h-3.5" /> {request.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-3.5 h-3.5" /> {request.time}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30"
                        >
                          <FiCheck className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-medium rounded-xl transition-all border border-gray-200 hover:border-red-200"
                        >
                          <FiX className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No pending requests</h3>
                <p className="text-sm text-gray-500">New job requests will appear here when customers book your services.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
