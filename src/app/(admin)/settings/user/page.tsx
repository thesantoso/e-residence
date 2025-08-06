import UserManagementPage from "@/components/settings/UserManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Management | E-Residence Dashboard",
    description: "Kelola pengguna sistem dashboard",
};

export default function UserManagement() {
    return <UserManagementPage />;
}
