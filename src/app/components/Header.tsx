"use client"

import { FaBell, FaChevronDown, FaUser } from "react-icons/fa";

const Header = ({ onToggle }: any) => {
    return (
        <header className="bg-white border lg:rounded-xl border-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-50"
                    onClick={onToggle}
                >
                    <span className="sr-only">Toggle sidebar</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center space-x-2">
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
    );
};

export default Header