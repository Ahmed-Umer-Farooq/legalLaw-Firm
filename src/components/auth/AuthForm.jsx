import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthForm = ({ onSwitchToLogin }) => {
  const [userType, setUserType] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', username: '', address: '', city: '', state: '', zipCode: '',
    country: '', mobileNumber: '', email: '', password: '',
    registrationId: '', firm: '', specialty: '', acceptTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.username.trim()) newErrors.username = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.state.trim()) newErrors.state = 'Required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Required';
    if (!formData.country.trim()) newErrors.country = 'Required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Required';
    
    if (userType === 'lawyer') {
      if (!formData.registrationId.trim()) newErrors.registrationId = 'Required';
      if (!formData.firm.trim()) newErrors.firm = 'Required';
      if (!formData.specialty.trim()) newErrors.specialty = 'Required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Registration submitted:', { userType, ...formData });
      alert(`${userType === 'user' ? 'User' : 'Lawyer'} Registration successful!`);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} signup will be connected later.`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>

        {/* User Type Toggle */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              checked={userType === 'user'}
              onChange={() => setUserType('user')}
              className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
            />
            <span className="text-sm font-medium text-gray-700">User</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              checked={userType === 'lawyer'}
              onChange={() => setUserType('lawyer')}
              className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
            />
            <span className="text-sm font-medium text-gray-700">Lawyer</span>
          </label>
        </div>
      </div>

      {/* USER FORM */}
      {userType === 'user' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Zip Code</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Mobile Number</label>
            <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="6+ characters"
                className="w-full px-3 py-2.5 text-sm pr-10 bg-gray-200 border-0 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" id="terms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange}
              className="w-4 h-4 mt-0.5 text-[#0EA5E9] focus:ring-[#0EA5E9] rounded"/>
            <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
              Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
            </label>
          </div>

          <button onClick={handleSubmit} disabled={!formData.acceptTerms}
            className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded text-sm transition-all mt-2">
            Create Account
          </button>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">OR</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => handleSocialLogin('Google')}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 20 20">
                <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
              </svg>
              <span className="font-medium text-gray-700 text-xs">Sign up with Google</span>
            </button>
            
            <button type="button" onClick={() => handleSocialLogin('Facebook')}
              className="p-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs">
              Already a member?{' '}
              <button onClick={onSwitchToLogin} type="button"
                className="text-[#0EA5E9] font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      {/* LAWYER FORM - CUSTOM ASYMMETRIC LAYOUT */}
      {userType === 'lawyer' && (
        <div>
          <div className="space-y-3">
            {/* Row 1: Name & Username */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
            </div>

            {/* Row 2: Address (Full Width) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
            </div>

            {/* Row 3: City & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
            </div>

            {/* Row 4: Zip Code & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Zip Code</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
            </div>

            {/* Row 5: Mobile Number (narrow) & Registration ID (wider) */}
            <div className="grid grid-cols-[1fr_1.5fr] gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Registration ID</label>
                <input type="text" name="registrationId" value={formData.registrationId} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
            </div>

            {/* Row 6: Email (narrow) & Law Firm (wider) */}
            <div className="grid grid-cols-[1fr_1.5fr] gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Law Firm</label>
                <input type="text" name="firm" value={formData.firm} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
            </div>

            {/* Row 7: Password (narrow) & Specialty (wider) */}
            <div className="grid grid-cols-[1fr_1.5fr] gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="6+ characters"
                    className="w-full px-3 py-2.5 text-sm pr-10 bg-gray-200 border-0 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Specialty</label>
                <input type="text" name="specialty" value={formData.specialty} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms-lawyer" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 text-[#0EA5E9] focus:ring-[#0EA5E9] rounded"/>
              <label htmlFor="terms-lawyer" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
              </label>
            </div>

            <button onClick={handleSubmit} disabled={!formData.acceptTerms}
              className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded text-sm transition-all">
              Create Account
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">OR</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => handleSocialLogin('Google')}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <svg width="16" height="16" viewBox="0 0 20 20">
                  <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                  <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                  <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                  <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
                </svg>
                <span className="font-medium text-gray-700 text-xs">Sign up with Google</span>
              </button>
              
              <button type="button" onClick={() => handleSocialLogin('Facebook')}
                className="p-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-gray-500 text-xs">
                Already a member?{' '}
                <button onClick={onSwitchToLogin} type="button"
                  className="text-[#0EA5E9] font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;