"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authStorage } from "@/utils/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        const token = authStorage.getToken();
        if (!token) {
            router.replace("/login");
            return;
        }
        setCanRender(true);
    }, [router]);

    if (!canRender) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white text-primary-600">
                Checking session...
            </div>
        );
    }

    return <>{children}</>;
}
