"use client"

import { FaClipboardList, FaSlidersH, FaUser } from "react-icons/fa";

const Sidebar = ({ isOpen, onToggle, activeMenu, onMenuClick }: any) => {
    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f2f6fc] border border-[#d7e2f3] lg:rounded-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}
        >
            <div className="flex items-center justify-center px-6 py-4 bg-gradient-to-b from-[#eef3fb] to-[#e4edf9] border-b border-[#d7e2f3] lg:rounded-t-xl">
                <img
                    src="/logo1.png"
                    alt="Logo"
                    className="h-14 w-auto object-contain drop-shadow-sm"
                />
            </div>
            <nav className="mt-8 px-3 space-y-3">
                <div className="text-[#6b7a94] text-sm font-semibold">MAIN MENU</div>
                <hr className="border-[#d7e2f3]" />
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onMenuClick('survey'); }}
                    className={`flex items-center px-3 py-3 text-base rounded-md transition-all duration-200 group ${activeMenu === 'survey'
                        ? 'bg-[#e5eefb] text-[#1f4b99] border-l-4 border-[#2c5fb8] shadow-sm'
                        : 'text-slate-700 hover:bg-[#e5eefb] hover:text-[#1f4b99]'
                        }`}
                >
                    <FaClipboardList className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${activeMenu === 'survey' ? 'text-[#1f4b99]' : 'text-[#7b8aa6] group-hover:text-[#1f4b99]'
                        }`} />
                    Survey
                </a>
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onMenuClick('manage'); }}
                    className={`flex items-center px-3 py-3 text-base rounded-md transition-all duration-200 group ${activeMenu === 'manage'
                        ? 'bg-[#e5eefb] text-[#1f4b99] border-l-4 border-[#2c5fb8] shadow-sm'
                        : 'text-slate-700 hover:bg-[#e5eefb] hover:text-[#1f4b99]'
                        }`}
                >
                    <FaSlidersH className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${activeMenu === 'manage' ? 'text-[#1f4b99]' : 'text-[#7b8aa6] group-hover:text-[#1f4b99]'
                        }`} />
                    Manage
                </a>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#d7e2f3] bg-[#e9f0fb]">
                <div className="flex items-center space-x-2 hover:bg-[#f8fbff] hover:rounded p-1 transition-colors cursor-pointer">
                    <div className="w-7 h-7 bg-[#1f4b99] rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="text-xs min-w-0">
                        <p className="font-medium text-[#1b2a41] truncate">Wasuchok Jainam</p>
                        <p className="text-[#5b6b86]">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Sidebar
