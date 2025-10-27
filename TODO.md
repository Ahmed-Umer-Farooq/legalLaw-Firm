# TODO: Legal City Full Authentication System - Frontend Integration

## Frontend Implementation
- [x] Create legalLaw-Firm/src/api.js with Axios instance configured for backend
- [x] Create legalLaw-Firm/src/pages/Register.js for user/lawyer registration
- [x] Create legalLaw-Firm/src/pages/Login.js for authentication
- [x] Create legalLaw-Firm/src/pages/ForgotPassword.js for password reset request
- [x] Create legalLaw-Firm/src/pages/VerifyEmail.js for email verification
- [x] Create legalLaw-Firm/src/pages/ResetPassword.js for password reset
- [x] Create legalLaw-Firm/src/pages/Dashboard.js for user profile management
- [x] Create legalLaw-Firm/src/context/AuthContext.js for auth state management
- [x] Update AuthForm.jsx to call register API and handle success (switch to verify mode)
- [x] Update Login.jsx to call login API, store token, redirect to dashboard
- [x] Update ForgotPasswordForm.jsx to call forgot password API
- [x] Update LegalCityAuth.jsx to use auth context and handle all modes (register, login, forgot, verify, reset, dashboard)
- [x] Install axios if not present

## Testing
- [x] Start backend server (node server.js in backend/)
- [x] Start frontend server (npm start in legalLaw-Firm/)
- [ ] Test registration → verification → login → dashboard CRUD
- [ ] Test forgot/reset password
- [ ] Test OAuth (requires .env setup)
