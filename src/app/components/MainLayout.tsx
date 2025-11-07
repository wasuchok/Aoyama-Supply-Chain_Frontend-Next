"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SplashScreen from "./SplashScreen";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("survey");
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsSplashVisible(false), 1300);
        return () => clearTimeout(timer);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (menu: any) => {
        setActiveMenu(menu);
    };

    return (
        <>
            <SplashScreen isVisible={isSplashVisible} />

            <div
                className={`flex h-screen bg-white transition-all duration-500 ${isSplashVisible ? "pointer-events-none opacity-0 scale-[0.98]" : "opacity-100 scale-100"
                    }`}
            >
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
