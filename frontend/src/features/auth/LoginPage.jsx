import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiLock,
  FiX,
  FiCalendar,
  FiPhone,
  FiBriefcase,
  FiTool,
  FiImage,
} from 'react-icons/fi';

export default function LoginPage() {
  const { loginWithCredentials, registerWithCredentials, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');

  // Staff-specific fields
  const [skills, setSkills] = useState([]);
  const [certificateUrl, setCertificateUrl] = useState('');

  const SKILL_OPTIONS = [
    'Plumber', 'Electrician', 'Cleaner', 'Painter',
    'Carpenter', 'HVAC Technician', 'Landscaper', 'Mover',
  ];

  // If already logged in, redirect based on role
  if (user) {
    navigate(user.role === 'staff' ? '/staff-dashboard' : '/user-home');
    console.log(user.role);
    return null;
  }

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setMobileNumber('');
    setDateOfBirth('');
    setSelectedRole('user');
    setSkills([]);
    setCertificateUrl('');
    setError('');
  };

  // ── Validation ──
  const validateForm = () => {
    if (!username.trim()) return 'Username is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (activeTab === 'signup') {
      if (!/^\+?\d{7,15}$/.test(mobileNumber.replace(/\s/g, '')))
        return 'Enter a valid mobile number (7–15 digits).';
      if (!dateOfBirth) return 'Date of birth is required.';
      if (selectedRole === 'staff') {
        if (skills.length === 0) return 'Please select at least one skill.';
        if (!certificateUrl) return 'Please upload a certificate image (PNG).';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      let userData;
      if (activeTab === 'login') {
        userData = await loginWithCredentials(username, password, selectedRole);
      } else {
        userData = await registerWithCredentials({
          username,
          password,
          phoneNumber: mobileNumber,
          dateOfBirth: new Date(dateOfBirth).toISOString(),
          role: selectedRole,
          ...(selectedRole === 'staff' && {
            skills: skills.map((s) => ({ skillId: s.skillId, level: Number(s.level) })),
            certificateUrl,
            isStaffValidated: false,
          }),
        });
      }

      // Redirect based on role
      const role = userData?.role || selectedRole;
      navigate(role === 'staff' ? '/staff-dashboard' : '/user-home');
    } catch (err) {
      console.error('Auth error:', err.response?.status, err.response?.data);
      const data = err.response?.data;
      let message;
      if (!err.response) {
        message =
          err.message ||
          `Cannot reach the server. Check that your backend is running.`;
      } else {
        message =
          (typeof data === 'string' ? data : null) ||
          data?.message ||
          data?.error ||
          data?.detail ||
          (activeTab === 'login'
            ? 'Invalid username or password.'
            : 'Registration failed. Please try again.');
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      id: 'user',
      label: 'User',
      description: 'Find & book services',
      icon: FiUser,
      activeColor: 'border-blue-500 bg-blue-50 text-blue-700',
      iconColor: 'text-blue-500',
    },
    {
      id: 'staff',
      label: 'Staff',
      description: 'Offer your services',
      icon: FiBriefcase,
      activeColor: 'border-orange-500 bg-orange-50 text-orange-700',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900" />
      <div className="fixed inset-0 bg-black/30" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Servi<span className="text-orange-500">fy</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'login'
              ? 'Welcome back!'
              : 'Create your free account today.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {['login', 'signup'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError('');
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
            <FiX className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* ── Role Selector (both tabs — determines redirect) ── */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === 'signup' ? 'I want to join as' : 'Login as'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRole(opt.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedRole === opt.id
                    ? opt.activeColor
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <opt.icon
                  className={`w-5 h-5 shrink-0 ${
                    selectedRole === opt.id ? opt.iconColor : 'text-gray-400'
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs opacity-70">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jane"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* ── Signup-only fields ── */}
          {activeTab === 'signup' && (
            <>
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
                  />
                </div>
              </div>

              {/* ── Staff-only: Skills + Certificate ── */}
              {selectedRole === 'staff' && (
                <>
                  {/* Skills — tap to toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <FiTool className="w-4 h-4 text-gray-400" />
                        Skills
                      </span>
                    </label>
                    <p className="text-xs text-gray-400 mb-2">Tap to select, then set level (1–10)</p>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map((skill) => {
                        const selected = skills.some((s) => s.skillId === skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() =>
                              setSkills(
                                selected
                                  ? skills.filter((s) => s.skillId !== skill)
                                  : [...skills, { skillId: skill, level: 5 }]
                              )
                            }
                            className={`px-3 py-1.5 text-sm font-medium rounded-xl border-2 transition-all ${
                              selected
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {selected && '✓ '}{skill}
                          </button>
                        );
                      })}
                    </div>
                    {skills.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {skills.map((skill) => (
                          <div key={skill.skillId} className="flex items-center gap-3 p-2.5 bg-orange-50/60 border border-orange-200 rounded-xl">
                            <span className="text-sm font-medium text-gray-700 min-w-[90px]">{skill.skillId}</span>
                            <input
                              type="range" min="1" max="10" value={skill.level}
                              onChange={(e) => setSkills(skills.map((s) => s.skillId === skill.skillId ? { ...s, level: Number(e.target.value) } : s))}
                              className="flex-1 accent-orange-500 h-2"
                            />
                            <span className="text-sm font-bold text-orange-600 w-8 text-center">{skill.level}/10</span>
                            <button type="button" onClick={() => setSkills(skills.filter((s) => s.skillId !== skill.skillId))} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                              <FiX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certificate PNG Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <FiImage className="w-4 h-4 text-gray-400" />
                        Certificate Image
                      </span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      certificateUrl ? 'border-orange-300 bg-orange-50/50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                      {certificateUrl ? (
                        <div className="flex items-center gap-4">
                          <img src={certificateUrl} alt="Certificate" className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-700">Certificate uploaded</p>
                            <p className="text-xs text-green-500">PNG image ready</p>
                          </div>
                          <button type="button" onClick={() => setCertificateUrl('')} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <FiImage className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Click to upload certificate</p>
                          <p className="text-xs text-gray-400 mt-1">PNG format only</p>
                          <input type="file" accept=".png,image/png" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.type !== 'image/png') { setError('Only PNG images are allowed.'); e.target.value = ''; return; }
                            const reader = new FileReader();
                            reader.onload = () => { setCertificateUrl(reader.result); setError(''); };
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : activeTab === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Toggle link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {activeTab === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            onClick={() => {
              setActiveTab(activeTab === 'login' ? 'signup' : 'login');
              resetForm();
            }}
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {activeTab === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>

        {/* Legal */}
        <p className="mt-4 text-center text-xs text-gray-400">
          By signing up you agree to our{' '}
          <a href="#" className="underline hover:text-gray-600">
            Terms
          </a>
          {' & '}
          <a href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
