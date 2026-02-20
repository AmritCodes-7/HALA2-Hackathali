import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  FiCheck,
  FiUploadCloud,
  FiToggleLeft,
  FiToggleRight,
  FiArrowRight,
  FiArrowLeft,
  FiTool,
  FiX,
} from 'react-icons/fi';

const SKILL_CATEGORIES = [
  { id: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { id: 'electrical', label: 'Electrical', emoji: '⚡' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'painting', label: 'Painting', emoji: '🎨' },
  { id: 'carpentry', label: 'Carpentry', emoji: '🪚' },
  { id: 'hvac', label: 'HVAC', emoji: '❄️' },
  { id: 'moving', label: 'Moving', emoji: '📦' },
  { id: 'landscaping', label: 'Landscaping', emoji: '🌿' },
  { id: 'roofing', label: 'Roofing', emoji: '🏠' },
  { id: 'flooring', label: 'Flooring', emoji: '🪵' },
  { id: 'appliance', label: 'Appliance Repair', emoji: '🔌' },
  { id: 'locksmith', label: 'Locksmith', emoji: '🔑' },
];

export default function ProOnboarding() {
  const { updateRole, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [certFile, setCertFile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experience, setExperience] = useState('');

  const toggleSkill = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((s) => s !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateRole('pro', {
        skills: selectedSkills,
        bio,
        hourlyRate: Number(hourlyRate),
        experience,
        isAvailable,
        certificationUploaded: !!certFile,
        onboardingCompleted: true,
        onboardedAt: new Date().toISOString(),
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedStep1 = selectedSkills.length > 0;
  const canProceedStep2 = true; // Certification is optional
  const canSubmit = canProceedStep1 && canProceedStep2;

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium mb-4">
              <FiTool className="w-4 h-4" />
              Pro Onboarding — Step {step} of {totalSteps}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set Up Your Pro Profile
            </h1>
            <p className="text-gray-500">
              Tell us about your skills so customers can find you.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i + 1 <= step
                        ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span className={step >= 1 ? 'text-orange-500' : ''}>Skills</span>
              <span className={step >= 2 ? 'text-orange-500' : ''}>Credentials</span>
              <span className={step >= 3 ? 'text-orange-500' : ''}>Availability</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {/* ── STEP 1: Skills ── */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  What services do you offer?
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Select all categories that apply. You can update these later.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SKILL_CATEGORIES.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-500/10'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{skill.emoji}</span>
                        <span className={`text-sm font-medium ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
                          {skill.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedSkills.length > 0 && (
                  <p className="mt-4 text-sm text-gray-500">
                    {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {/* ── STEP 2: Credentials ── */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Credentials & Experience
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Help customers trust you with your qualifications.
                </p>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Professional Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell customers about your experience, specialties, and what makes you stand out..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none placeholder:text-gray-400"
                  />
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Years of Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                {/* Hourly Rate */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>

                {/* Certification Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Certification Upload <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      certFile
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50/30'
                    }`}
                  >
                    {certFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FiCheck className="w-6 h-6 text-emerald-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">{certFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(certFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => setCertFile(null)}
                          className="ml-2 p-1 rounded-full hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FiUploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-semibold text-orange-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG (max. 10MB)</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Availability ── */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Set Your Availability
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  Let customers know when you're ready to take on jobs.
                </p>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Work Availability
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {isAvailable
                        ? 'You will appear in search results and receive job requests.'
                        : 'You will be hidden from search results.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAvailable(!isAvailable)}
                    className="shrink-0 transition-all"
                  >
                    {isAvailable ? (
                      <FiToggleRight className="w-12 h-12 text-emerald-500" />
                    ) : (
                      <FiToggleLeft className="w-12 h-12 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  {isAvailable ? 'Available for Work' : 'Not Available'}
                </div>

                {/* Summary */}
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-3">Profile Summary</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>
                      <span className="font-medium">Skills:</span>{' '}
                      {selectedSkills.map((s) => SKILL_CATEGORIES.find((c) => c.id === s)?.label).join(', ') || 'None'}
                    </p>
                    {bio && <p><span className="font-medium">Bio:</span> {bio.slice(0, 80)}...</p>}
                    {hourlyRate && <p><span className="font-medium">Rate:</span> ${hourlyRate}/hr</p>}
                    {experience && <p><span className="font-medium">Experience:</span> {experience} years</p>}
                    <p><span className="font-medium">Certification:</span> {certFile ? 'Uploaded' : 'Not uploaded'}</p>
                    <p><span className="font-medium">Status:</span> {isAvailable ? 'Available' : 'Unavailable'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                <FiArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !canProceedStep1}
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Next <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Setup <FiCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
