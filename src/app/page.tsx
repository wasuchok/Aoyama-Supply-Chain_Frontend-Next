"use client"

import { useState } from 'react';
import { FaBell, FaChevronDown, FaClipboardList, FaSlidersH, FaUser } from 'react-icons/fa';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (menu: any) => {
    setActiveMenu(menu);
  };

  return (
    <div className="flex h-screen bg-white">

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border lg:rounded-xl border-gray-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-center h-16 px-5 bg-white border lg:rounded-xl border-gray-100">

          <img
            src="/Picture1.jpg"
            alt="Logo"
            className="p-16 rounded-full"
          />
        </div>
        <nav className="mt-8 px-3 space-y-3">
          <div className='text-gray-400 text-sm font-semibold'>MAIN MENU</div>
          <hr />
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleMenuClick('dashboard'); }}
            className={`flex items-center px-3 py-3 text-base rounded-md hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group ${activeMenu === 'dashboard'
              ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600 shadow-sm'
              : 'text-gray-600 hover:shadow-md'
              }`}
          >
            <FaClipboardList className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${activeMenu === 'dashboard' ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
            Survey
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleMenuClick('analytics'); }}
            className={`flex items-center px-3 py-3 text-base rounded-md hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group ${activeMenu === 'analytics'
              ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600 shadow-sm'
              : 'text-gray-600 hover:shadow-md'
              }`}
          >
            <FaSlidersH className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${activeMenu === 'analytics' ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
            Manage
          </a>

        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-2 hover:bg-white hover:rounded p-1 transition-colors cursor-pointer">
            <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FaUser className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-xs min-w-0">
              <p className="font-medium text-gray-900 truncate">Wasuchok Jainam</p>
              <p className="text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>


      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}


      <div className="flex-1 flex flex-col overflow-hidden lg:mx-16 lg:mt-4">

        <header className="bg-white border lg:rounded-xl border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">

            <button
              className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-50"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>





            <div className="flex  items-center space-x-2">
              <button className="relative p-1.5 text-gray-500 hover:bg-gray-50 rounded">
                <FaBell className="w-4 h-4" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-1 ring-white"></span>
              </button>
              <div className="flex items-center space-x-1.5 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center">
                  <FaUser className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">wasuchok jainam</span>
                <FaChevronDown className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 ">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">12,000</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <span className="text-primary-600 text-lg">👥</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$45,000</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 text-lg">💰</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="p-3 bg-success-50 rounded-lg">
                  <span className="text-success-600 text-lg">📦</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Views</p>
                  <p className="text-2xl font-bold text-gray-900">56,789</p>
                </div>
                <div className="p-3 bg-accent-50 rounded-lg">
                  <span className="text-accent-600 text-lg">👁️</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded border border-gray-100">
            <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                <span>User logged in</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                <span>New order placed</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;