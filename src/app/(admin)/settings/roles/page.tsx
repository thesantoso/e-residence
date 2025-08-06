import RoleManagementPage from "@/components/settings/RoleManagementPage";
import AdminProtectedPage from "@/components/common/AdminProtectedPage";

export default function RoleManagementRoute() {
    return (
        <AdminProtectedPage>
            <RoleManagementPage />
        </AdminProtectedPage>
    );
}