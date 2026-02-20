import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiFilter,
  FiMessageSquare,
  FiClock,
  FiUser,
} from 'react-icons/fi';

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🔥' },
  { id: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { id: 'electrical', label: 'Electrical', emoji: '⚡' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'carpentry', label: 'Carpentry', emoji: '🪚' },
  { id: 'painting', label: 'Painting', emoji: '🎨' },
  { id: 'hvac', label: 'HVAC', emoji: '❄️' },
];

const NEARBY_PROS = [
  {
    id: 1,
    name: 'Marcus Johnson',
    title: 'Master Plumber',
    rating: 4.9,
    reviews: 342,
    jobs: 856,
    rate: 65,
    distance: '0.8 mi',
    availability: 'Available Now',
    availColor: 'bg-emerald-500',
    badges: ['Top Rated', 'Background Checked'],
    category: 'plumbing',
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    title: 'Deep Clean Specialist',
    rating: 4.9,
    reviews: 571,
    jobs: 1204,
    rate: 45,
    distance: '0.5 mi',
    availability: 'Available Now',
    availColor: 'bg-emerald-500',
    badges: ['Super Pro', 'Eco Friendly'],
    category: 'cleaning',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    title: 'HVAC Technician',
    rating: 4.9,
    reviews: 412,
    jobs: 934,
    rate: 80,
    distance: '0.9 mi',
    availability: 'Available Today',
    availColor: 'bg-amber-500',
    badges: ['Top Rated', 'Insured'],
    category: 'hvac',
  },
  {
    id: 4,
    name: 'James Wilson',
    title: 'Licensed Electrician',
    rating: 4.8,
    reviews: 289,
    jobs: 612,
    rate: 70,
    distance: '1.2 mi',
    availability: 'Available Now',
    availColor: 'bg-emerald-500',
    badges: ['Licensed', 'Background Checked'],
    category: 'electrical',
  },
  {
    id: 5,
    name: 'Sarah Chen',
    title: 'Interior Painter',
    rating: 4.9,
    reviews: 198,
    jobs: 423,
    rate: 55,
    distance: '1.5 mi',
    availability: 'Available Now',
    availColor: 'bg-emerald-500',
    badges: ['Top Rated', 'Eco Friendly'],
    category: 'painting',
  },
  {
    id: 6,
    name: 'David Thompson',
    title: 'Custom Woodworker',
    rating: 4.7,
    reviews: 156,
    jobs: 387,
    rate: 75,
    distance: '2.1 mi',
    availability: 'Available Tomorrow',
    availColor: 'bg-orange-500',
    badges: ['Background Checked'],
    category: 'carpentry',
  },
];

export default function UserHome() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPros = NEARBY_PROS.filter((pro) => {
    const matchesCategory =
      activeCategory === 'all' || pro.category === activeCategory;
    const matchesSearch =
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        {/* ── Welcome Header ── */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {user?.username || user?.displayName || 'Customer'} 👋
            </h1>
            <p className="text-blue-100 text-sm">
              Find the perfect service professional near you.
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <FiSearch className="w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a service or professional..."
                  className="bg-transparent text-white placeholder:text-white/50 text-sm w-full outline-none"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 shrink-0">
                <FiFilter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8">
          {/* ── Map Placeholder ── */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative h-64 bg-gradient-to-br from-emerald-100 via-blue-100 to-indigo-100">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
              {[
                { top: '30%', left: '25%' },
                { top: '50%', left: '45%' },
                { top: '35%', left: '65%' },
                { top: '60%', left: '30%' },
                { top: '45%', left: '75%' },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 ring-4 ring-white">
                    <FiMapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-3 h-3 bg-blue-600 rotate-45 -translate-y-1.5" />
                </div>
              ))}
              <div className="absolute top-4 left-4 bg-white rounded-xl shadow-md px-4 py-2 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Your Area
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-md px-4 py-2">
                <span className="text-xs font-medium text-gray-500">
                  Google Maps Integration
                </span>
              </div>
            </div>
          </div>

          {/* ── Category Filters ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Section Title ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Nearby Service Providers
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredPros.length} professionals found
              </p>
            </div>
          </div>

          {/* ── Pro Cards Grid ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPros.map((pro) => (
              <div
                key={pro.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiUser className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 ${pro.availColor} text-white text-xs font-semibold rounded-full shadow-md`}
                    >
                      {pro.availability}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-600 text-xs font-medium rounded-full">
                      📍 {pro.distance}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{pro.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {pro.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm shrink-0">
                      <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{pro.rating}</span>
                      <span className="text-gray-400 text-xs">
                        ({pro.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 mb-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FiClock className="w-3 h-3" />{' '}
                      {pro.jobs.toLocaleString()} jobs
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${pro.rate}
                      <span className="text-xs font-normal text-gray-400">
                        /hr
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pro.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-50 text-gray-500 border border-gray-100"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20">
                      Book Now
                    </button>
                    <button className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPros.length === 0 && (
            <div className="text-center py-20">
              <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No professionals found
              </h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
