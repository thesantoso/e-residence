import RoleManagementPage from "@/components/settings/RoleManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Role Management | E-Residence Dashboard",
    description: "Kelola role dan permissions pengguna",
};

export default function RoleManagement() {
    return <RoleManagementPage />;
}
