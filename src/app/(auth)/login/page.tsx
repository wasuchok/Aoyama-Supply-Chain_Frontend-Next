"use client";

import { apiPublic } from "@/services/httpClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [isCheckUser, setIsCheckUser] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [employeeCode, setEmployeeCode] = useState("");
    const [isShowingPassword, setIsShowingPassword] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [passwordCode, setPasswordCode] = useState(""); // ✅ OTP Password

    const { handleSubmit } = useForm();

    // 🔹 ดึงข้อมูลพนักงาน
    const fetchUser = async (code: string) => {
        try {
            setIsLoadingUser(true);
            const { data, status } = await apiPublic.get(
                `/spc-part-employee/employee/${code}`
            );

            if (status === 200 || status === 201) {
                if (!data?.resultData) {
                    toast.error("Employee not found. Please check your code.");
                    setIsCheckUser(false);
                    setIsShowingPassword(false);
                    return;
                }

                setIsCheckUser(true);

                // ถ้า role = manage → แสดงช่อง password (OTP 6 ช่อง)
                if (data.resultData.role === "manage") {
                    setTimeout(() => {
                        setIsShowingPassword(true);
                        setFadeIn(true);
                    }, 100);
                } else {
                    setIsShowingPassword(false);
                }
            }
        } catch (error) {
            console.log("❌ Error fetching user:", error);
            toast.error("Unable to verify employee.");
            setIsCheckUser(false);
            setIsShowingPassword(false);
        } finally {
            setIsLoadingUser(false);
        }
    };

    // 🔹 เมื่อกรอกรหัสครบ 6 ตัว
    useEffect(() => {
        if (employeeCode.length === 6) {
            fetchUser(employeeCode);
        } else {
            setIsCheckUser(false);
            setIsShowingPassword(false);
        }
    }, [employeeCode]);

    const handleLogin = () => {
        console.log("Login with:", { employeeCode, passwordCode });
    };

    return (
        <div className="min-h-screen flex">
            {/* 🔹 Left Section */}
            <div className="hidden md:flex w-1/2 items-center justify-center bg-primary-600 text-white p-8">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-4xl font-bold">Welcome Back</h1>
                    <p className="text-sm opacity-90">
                        Manage your supply chain efficiently and securely.
                    </p>
                    <img
                        src="Good team-bro.png"
                        alt="Login Illustration"
                        className="w-full max-w-2xl mx-auto drop-shadow-xl"
                    />
                </div>
            </div>

            {/* 🔹 Right Section */}
            <div className="flex flex-col justify-center w-full md:w-1/2 bg-white px-8 md:px-16">
                <div className="max-w-md w-full mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800">Employee Login</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter your 6-digit employee code
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleLogin)}>
                        {/* Employee Code */}
                        <div className="flex justify-center">
                            <OtpInput
                                value={employeeCode}
                                onChange={setEmployeeCode}
                                numInputs={6}
                                inputType="number"
                                shouldAutoFocus
                                containerStyle="flex gap-3 justify-center"
                                inputStyle={{
                                    width: "3rem",
                                    height: "3.5rem",
                                }}
                                renderInput={(props) => (
                                    <input
                                        {...props}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="text-center rounded-lg border border-gray-300 text-xl font-semibold text-primary-600 outline-none
                    focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition-all duration-150
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                )}
                            />
                        </div>

                        {/* Password OTP (แสดงแบบ Smooth) */}
                        {isShowingPassword && (
                            <div
                                className={`transition-all duration-500 ease-out overflow-hidden ${fadeIn
                                        ? "opacity-100 translate-y-0 mt-5"
                                        : "opacity-0 -translate-y-3"
                                    }`}
                            >
                                <p className="text-sm text-gray-500 mb-3 text-center">
                                    Enter your 6-digit password
                                </p>
                                <div className="flex justify-center">
                                    <OtpInput
                                        value={passwordCode}
                                        onChange={setPasswordCode}
                                        numInputs={6}
                                        inputType="password" // ✅ ซ่อนตัวเลข
                                        containerStyle="flex gap-3 justify-center"
                                        inputStyle={{
                                            width: "3rem",
                                            height: "3.5rem",
                                        }}
                                        renderInput={(props) => (
                                            <input
                                                {...props}
                                                className="text-center rounded-lg border border-gray-300 text-xl font-semibold text-gray-900 outline-none
                        focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition-all duration-150
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Checking Loading */}
                        {isLoadingUser && (
                            <p className="text-sm text-primary-600 text-center mt-3 animate-pulse">
                                Checking employee...
                            </p>
                        )}

                        {/* Login Button */}
                        {isCheckUser && !isLoadingUser && (
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 transition"
                            >
                                LOGIN
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
