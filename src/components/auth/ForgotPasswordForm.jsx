import React, { useState } from 'react';

const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Forgot password submitted:', { email });
      setIsSubmitted(true);
      alert('Password reset link sent to your email!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#0284C7] rounded-full px-6 py-3 shadow-lg inline-flex">
              <span className="text-white font-bold text-3xl">Legal</span>
            </div>
            <span className="text-[#0284C7] font-bold text-3xl">City</span>
          </div>
          <p className="text-[#0284C7] text-sm font-semibold tracking-wider uppercase">
            " Legal for the people "
          </p>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <button
            onClick={onSwitchToLogin}
            className="w-full py-3.5 bg-[#0891B2] hover:bg-[#0284C7] text-white font-semibold rounded-md transition-colors text-base shadow-md"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[#0284C7] rounded-full px-6 py-3 shadow-lg inline-flex">
            <span className="text-white font-bold text-3xl">Legal</span>
          </div>
          <span className="text-[#0284C7] font-bold text-3xl">City</span>
        </div>
        <p className="text-[#0284C7] text-sm font-semibold tracking-wider uppercase">
          " Legal for the people "
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password?</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-[#0891B2] hover:bg-[#0284C7] text-white font-semibold rounded-md transition-colors text-base shadow-md mt-6"
        >
          Send Reset Link
        </button>

        {/* Back to Login Link */}
        <div className="text-center">
          <button
            onClick={onSwitchToLogin}
            type="button"
            className="text-[#0284C7] font-semibold hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;