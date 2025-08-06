import { Metadata } from "next";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionStats } from "@/components/transactions/transaction-stats";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Transaksi Iuran | E-Residence",
    description: "Kelola transaksi iuran warga perumahan",
};

const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Manajemen Iuran", link: "/iuran" },
    { title: "Transaksi Iuran", link: "/iuran/transactions" },
];

export default function IuranTransactionsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Transaksi Iuran</h2>
            </div>

            {/* <Breadcrumb items={breadcrumbItems} /> */}
            <PageBreadcrumb pageTitle="Transaksi Iuran" />

            <div className="space-y-4">
                <div className="grid gap-4">
                    {/* Stats Section */}
                    <div className="grid gap-4 md:grid-cols-1">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Statistik Iuran</h3>
                            </div>
                            <div className="rounded-lg border bg-card">
                                <div className="p-6">
                                    <TransactionStats />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Daftar Transaksi Iuran</h3>
                        </div>
                        <div className="rounded-lg border bg-card">
                            <div className="p-6">
                                <TransactionTable />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
