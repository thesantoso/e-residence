import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Laporan Pembayaran | E-Residence",
    description: "Laporan pembayaran iuran warga perumahan",
};

const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Manajemen Iuran", link: "/iuran" },
    { title: "Laporan Pembayaran", link: "/iuran/reports" },
];

export default function IuranReportsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Laporan Pembayaran</h2>
            </div>

            <PageBreadcrumb pageTitle="Laporan Pembayaran" />

            <div className="space-y-4">
                <div className="rounded-lg border bg-card">
                    <div className="p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-medium text-muted-foreground">
                                    Laporan Pembayaran
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Fitur laporan pembayaran akan dikembangkan selanjutnya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
