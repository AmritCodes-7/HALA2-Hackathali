import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  FiSearch,
  FiMapPin,
  FiCheckCircle,
  FiShield,
  FiUser,
  FiStar,
  FiClock,
  FiArrowRight,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';

const STATS = [
  { icon: FiCheckCircle, value: '10,000+', label: 'Jobs Completed', color: 'text-emerald-500' },
  { icon: FiShield, value: '500+', label: 'Verified Pros', color: 'text-blue-500' },
  { icon: FiStar, value: '4.9★', label: 'Average Rating', color: 'text-amber-500' },
  { icon: FiClock, value: '< 60min', label: 'Avg Response Time', color: 'text-purple-500' },
];

const POPULAR_SERVICES = [
  'Leaky faucet',
  'AC repair',
  'Move-out clean',
  'Deck repair',
  'Rewiring',
];

const SERVICE_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Painting',
  'Carpentry',
  'HVAC',
  'Moving',
  'Landscaping',
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Search & Browse',
    description: 'Tell us what you need. Browse verified professionals in your area filtered by service type, rating, and availability.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    step: '02',
    title: 'Book Instantly',
    description: 'Choose your preferred pro, select a time that works for you, and book with just a few taps. No phone calls needed.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    step: '03',
    title: 'Get It Done',
    description: 'Your pro arrives on time, gets the job done right, and you only pay when the work is complete. It\'s that simple.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const FEATURED_PROS = [
  {
    name: 'Marcus Johnson',
    title: 'Master Plumber',
    rating: 4.9,
    reviews: 342,
    jobs: 856,
    rate: 65,
    badges: ['Top Rated', 'Background Checked'],
    badgeColors: ['bg-orange-50 text-orange-600', 'bg-emerald-50 text-emerald-600'],
    availability: 'Available Now',
    distance: '0.8 mi',
  },
  {
    name: 'Elena Rodriguez',
    title: 'Deep Clean Specialist',
    rating: 4.9,
    reviews: 571,
    jobs: 1204,
    rate: 45,
    badges: ['Super Pro', 'Eco Friendly'],
    badgeColors: ['bg-blue-50 text-blue-600', 'bg-emerald-50 text-emerald-600'],
    availability: 'Available Now',
    distance: '0.5 mi',
  },
  {
    name: 'Priya Sharma',
    title: 'HVAC Technician',
    rating: 4.9,
    reviews: 412,
    jobs: 934,
    rate: 80,
    badges: ['Top Rated', 'Background Checked', 'Insured'],
    badgeColors: ['bg-orange-50 text-orange-600', 'bg-emerald-50 text-emerald-600', 'bg-blue-50 text-blue-600'],
    availability: 'Available Today',
    distance: '0.9 mi',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section id="services" className="relative pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">500+ verified pros available near you</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center text-white leading-tight">
            Find Trusted Home Service
            <br />
            Pros — <span className="text-orange-400">Fast.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-center text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Book plumbers, electricians, cleaners &amp; more in minutes.
            <br className="hidden sm:block" />
            Background-checked, Insured, and rated 4.9★ by 10,000+ homeowners.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 gap-2">
              <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-gray-50">
                <FiSearch className="w-5 h-5 text-gray-400 shrink-0" />
                <select className="bg-transparent text-sm text-gray-700 font-medium w-full outline-none cursor-pointer">
                  <option>All Services</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-gray-50">
                <FiMapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your city or zip code..."
                  className="bg-transparent text-sm text-gray-700 w-full outline-none placeholder:text-gray-400"
                />
              </div>
              <button className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 shrink-0">
                Find a Pro
              </button>
            </div>

            {/* Popular tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-blue-200 text-sm">Popular:</span>
              {POPULAR_SERVICES.map((service) => (
                <button
                  key={service}
                  className="px-3 py-1.5 text-xs font-medium text-white/80 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Pro CTA */}
          <p className="mt-8 text-center text-blue-200 text-sm">
            Are you a pro?{' '}
            <Link to="/login" className="font-semibold text-white underline underline-offset-2 hover:text-orange-300 transition-colors">
              Join as a service provider →
            </Link>
          </p>
        </div>

        {/* Wave separator */}
        <div className="relative -mb-1">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 73.3C1200 80 1320 80 1380 80H1440V80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="relative bg-white py-12 -mt-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 justify-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} bg-current/10`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Getting help for your home has never been easier. Three simple steps to a job well done.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={i}
                className="relative group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PROS ═══════════════ */}
      <section id="pros" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wider mb-3">Top Professionals</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Service Pros
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Hand-picked, top-rated professionals ready to help you today.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['All', ...SERVICE_CATEGORIES.slice(0, 6)].map((cat, i) => (
              <button
                key={cat}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  i === 0
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pro Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_PROS.map((pro, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                {/* Card Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <FiUser className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Pro Image</p>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-md">
                      {pro.availability}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-600 text-xs font-medium rounded-full">
                      📍 {pro.distance}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{pro.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{pro.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-gray-900">{pro.rating}</span>
                      <span className="text-gray-400">({pro.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 mb-4">
                    <span className="text-sm text-gray-500">🔧 {pro.jobs.toLocaleString()} jobs</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${pro.rate}<span className="text-sm font-normal text-gray-400">/hr</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pro.badges.map((badge, j) => (
                      <span
                        key={j}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${pro.badgeColors[j]}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Things Done?
          </h2>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Join 10,000+ homeowners who trust FixIt to connect them with
            the best local service professionals — fast, safe, and affordable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5"
            >
              Get Started for Free <FiArrowRight className="w-5 h-5" />
            </Link>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm">
              Browse Professionals
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-300">
            No subscription. No hidden fees. Pay only when work is done.
          </p>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-gray-900 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-800">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">
                  Servi<span className="text-orange-500">fy</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                The fastest way to find trusted, background-checked home service professionals in your area.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2"><FiPhone className="w-4 h-4" /> +977 9864569197</p>
                <p className="flex items-center gap-2"><FiMail className="w-4 h-4" /> servify@info.com</p>
                <p className="flex items-center gap-2"><FiMapPin className="w-4 h-4" /> Kathmandu, Nepal</p>
              </div>
              <div className="flex gap-3 mt-4">
                {[FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                  <a
                    key={i}
                    href="http://localhost:5173/"
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              { title: 'SERVICES', links: ['Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Carpentry', 'HVAC', 'Moving', 'Landscaping'] },
              { title: 'COMPANY', links: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'] },
              { title: 'SUPPORT', links: ['Help Center', 'Safety', 'Trust & Safety', 'Cancellation Policy', 'Accessibility'] },
              { title: 'LEGAL', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-orange-500 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                🍎 App Store
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                ▶️ Google Play
              </button>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 FixIt Technologies, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
