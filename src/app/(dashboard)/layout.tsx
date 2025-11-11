import AuthGuard from "../components/AuthGuard";
import MainLayout from "../components/MainLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <MainLayout>{children}</MainLayout>
        </AuthGuard>
    );
}
