import SystemSettingsPage from "@/components/settings/SystemSettingsPage";
import AdminProtectedPage from "@/components/common/AdminProtectedPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "System Settings | E-Residence Dashboard",
    description: "Konfigurasi pengaturan sistem dashboard",
};

export default function SystemSettings() {
    return (
        <AdminProtectedPage>
            <SystemSettingsPage />
        </AdminProtectedPage>
    );
}
