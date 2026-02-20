import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FiUser, FiTool, FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function RoleSelection() {
  const { user, updateRole } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;

    setIsLoading(true);
    try {
      if (selected === 'customer') {
        await updateRole('customer');
        navigate('/dashboard');
      } else {
        // Pro users need to complete onboarding first
        navigate('/onboarding/pro');
      }
    } catch (error) {
      console.error('Role selection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'customer',
      icon: FiUser,
      title: 'I Need Help',
      subtitle: 'Customer',
      description: 'Find and book trusted service professionals for your home repairs, maintenance, and more.',
      features: [
        'Browse verified professionals',
        'Book services instantly',
        'Secure payments',
        'Real-time tracking',
      ],
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/20',
      borderColor: 'border-blue-500',
      bgAccent: 'bg-blue-50',
      textAccent: 'text-blue-600',
    },
    {
      id: 'pro',
      icon: FiTool,
      title: 'I Offer Services',
      subtitle: 'Service Pro',
      description: 'Join our network of professionals. Get discovered by thousands of customers and grow your business.',
      features: [
        'Grow your client base',
        'Flexible scheduling',
        'Secure & fast payouts',
        'Professional profile',
      ],
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/20',
      borderColor: 'border-orange-500',
      bgAccent: 'bg-orange-50',
      textAccent: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium mb-6">
            <FiShield className="w-4 h-4" />
            Welcome{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : user?.name ? `, ${user.name.split(' ')[0]}` : ''}! One more step.
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How will you use Fix<span className="text-orange-500">It</span>?
          </h1>
          <p className="text-lg text-gray-500">
            Choose your role to get started. You can always switch later.
          </p>
        </div>

        {/* Role Cards */}
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-10">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                selected === role.id
                  ? `${role.borderColor} ${role.bgAccent} shadow-xl ${role.shadowColor} scale-[1.02]`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Selected indicator */}
              {selected === role.id && (
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}>
                    <FiCheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-5 shadow-lg ${role.shadowColor}`}>
                <role.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${role.textAccent}`}>
                {role.subtitle}
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">{role.description}</p>

              {/* Features */}
              <ul className="space-y-2.5">
                {role.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <FiCheckCircle className={`w-4 h-4 shrink-0 ${role.textAccent}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="max-w-3xl mx-auto text-center">
          <button
            onClick={handleContinue}
            disabled={!selected || isLoading}
            className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-white transition-all ${
              selected
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5'
                : 'bg-gray-300 cursor-not-allowed'
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
