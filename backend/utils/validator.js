const validateRegistration = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || data.password.length < 6 || !/\d/.test(data.password)) {
    errors.password = 'Password must be at least 6 characters and include a number';
  }

  if (!['user', 'lawyer'].includes(data.role)) {
    errors.role = 'Role must be user or lawyer';
  }

  if (data.role === 'lawyer' && (!data.registration_id || data.registration_id.trim().length === 0)) {
    errors.registration_id = 'Registration ID is required for lawyers';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = {};

  // Allow login with either email or registration_id
  if ((!data.email || !/\S+@\S+\.\S+/.test(data.email)) && (!data.registration_id || data.registration_id.trim().length === 0)) {
    errors.email = 'Valid email or registration ID is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateRegistration, validateLogin };
