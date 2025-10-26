import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-full px-4 py-2 flex items-center gap-0">
                <span className="text-xl font-bold text-white">Lega</span>
                <svg width="4" height="24" viewBox="0 0 4 24" fill="none" className="mx-0.5">
                  <rect x="0" y="2" width="4" height="20" fill="#ffffff"/>
                  <polygon points="2,0 0,2 4,2" fill="#ffffff"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-600">City</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Home</button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">About</button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Services</button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contact</button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
