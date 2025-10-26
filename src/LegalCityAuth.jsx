import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import AuthForm from './components/auth/AuthForm';
import Login from './components/auth/Login';

const LegalCityAuth = () => {
  const [authMode, setAuthMode] = useState('register');

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left blue sidebar */}
      <Sidebar isAuthPage={true} />

      {/* Right form area */}
      <main className="flex-1 flex items-start justify-start pt-12 pl-16 pr-16 pb-12 overflow-y-auto">
        <div className="w-full max-w-[620px]">
          {authMode === 'register' ? (
            <AuthForm onSwitchToLogin={() => setAuthMode('login')} />
          ) : (
            <Login onSwitchToRegister={() => setAuthMode('register')} />
          )}
        </div>
      </main>
    </div>
  );
};

export default LegalCityAuth;