"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";



export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('survey');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
    };
    return (
        <>
            <div className="flex h-screen bg-white">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={toggleSidebar}
                    activeMenu={activeMenu}
                    onMenuClick={handleMenuClick}
                />

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                <div className="flex-1 flex flex-col overflow-hidden lg:mx-16 lg:mt-4">
                    <Header onToggle={toggleSidebar} />
                    {children}
                </div>
            </div>
        </>
    );
}