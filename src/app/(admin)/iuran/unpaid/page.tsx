import { Metadata } from "next";
// import { Breadcrumb } from "@/components/common/breadcrumb";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Warga Belum Bayar | E-Residence",
    description: "Daftar warga yang belum membayar iuran",
};

const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Manajemen Iuran", link: "/iuran" },
    { title: "Warga Belum Bayar", link: "/iuran/unpaid" },
];

export default function IuranUnpaidPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Warga Belum Bayar</h2>
            </div>

            {/* <Breadcrumb items={breadcrumbItems} /> */}
            <PageBreadcrumb pageTitle="Warga Belum Bayar" />

            <div className="space-y-4">
                <div className="rounded-lg border bg-card">
                    <div className="p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-medium text-muted-foreground">
                                    Daftar Warga Belum Bayar
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Fitur daftar warga belum bayar akan dikembangkan selanjutnya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
