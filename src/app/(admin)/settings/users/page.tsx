import UserManagementPage from "@/components/settings/UserManagementPage";
import AdminProtectedPage from "@/components/common/AdminProtectedPage";

export default function UserManagementRoute() {
    return (
        <AdminProtectedPage>
            <UserManagementPage />
        </AdminProtectedPage>
    );
}