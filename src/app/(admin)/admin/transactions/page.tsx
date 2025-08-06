import { Suspense } from "react";
import { Metadata } from "next";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionStats } from "@/components/transactions/transaction-stats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
    title: "Transaction Management | E-Residence",
    description: "Manage resident payment transactions and financial records",
};

// This page uses SSR for SEO and initial loading performance
export default async function TransactionManagementPage() {
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="space-y-6">
                {/* Stats Cards - SSR for initial data, then CSR for real-time updates */}
                <Suspense
                    fallback={
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    }
                >
                    <TransactionStats />
                </Suspense>

                {/* Transaction Table - CSR for interactive features */}
                <Suspense
                    fallback={
                        <div className="bg-white rounded-lg border p-8">
                            <div className="flex justify-center items-center">
                                <LoadingSpinner size="lg" />
                                <span className="ml-2 text-gray-600">Loading transactions...</span>
                            </div>
                        </div>
                    }
                >
                    <TransactionTable />
                </Suspense>
            </div>
        </div>
    );
}
