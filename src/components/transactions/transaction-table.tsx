"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Eye, Edit, Trash2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { TransactionModal } from "./transaction-modal";

interface Transaction {
    id: string;
    nomorUrut?: number;
    kategoriId: string;
    residentId: string;
    periode: string;
    jumlahNominal: number;
    metodePembayaran: string;
    statusPembayaran: string;
    tanggalBayar: string;
    tanggalJatuhTempo?: string;
    keterangan?: string;
    profileId: string;
    resident?: {
        namaWarga: string;
        nomorRumah: string;
    };
    kategori?: {
        namaKategori: string;
    };
}

interface TransactionTableProps {
    className?: string;
}

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
    UNPAID: "bg-red-100 text-red-800 border-red-200",
    OVERDUE: "bg-red-100 text-red-800 border-red-200",
};

const methodColors = {
    CASH: "bg-blue-100 text-blue-800 border-blue-200",
    TRANSFER: "bg-green-100 text-green-800 border-green-200",
    QRIS: "bg-purple-100 text-purple-800 border-purple-200",
    BANK: "bg-orange-100 text-orange-800 border-orange-200",
};

export function TransactionTable({ className }: TransactionTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState<SimpleTransaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<SimpleTransaction | null>(null);    // Mock data for now
    const mockTransactions: SimpleTransaction[] = [
        {
            id: "1",
            nomorUrut: 1001,
            kategoriId: "kat1",
            residentId: "res1",
            periode: "01/2025",
            jumlahNominal: 150000,
            metodePembayaran: "TRANSFER",
            statusPembayaran: "PAID",
            tanggalBayar: "2025-01-15",
            keterangan: "Iuran bulanan",
            profileId: "profile1",
            resident: {
                namaWarga: "Budi Santoso",
                nomorRumah: "A-12",
            },
            kategori: {
                namaKategori: "Iuran Bulanan",
            },
        },
        {
            id: "2",
            nomorUrut: 1002,
            kategoriId: "kat2",
            residentId: "res2",
            periode: "01/2025",
            jumlahNominal: 75000,
            metodePembayaran: "CASH",
            statusPembayaran: "PENDING",
            tanggalBayar: "2025-01-16",
            keterangan: "Iuran kebersihan",
            profileId: "profile2",
            resident: {
                namaWarga: "Siti Aminah",
                nomorRumah: "B-08",
            },
            kategori: {
                namaKategori: "Iuran Kebersihan",
            },
        },
    ];

    const filteredTransactions = mockTransactions.filter((transaction) => {
        const matchesSearch =
            transaction.resident?.namaWarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.resident?.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.kategori?.namaKategori.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || transaction.statusPembayaran === statusFilter;
        const matchesMethod = methodFilter === "all" || transaction.metodePembayaran === methodFilter;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    const handleEdit = (transaction: SimpleTransaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = (transaction: SimpleTransaction) => {
        if (confirm(`Yakin ingin menghapus transaksi ${transaction.nomorUrut}?`)) {
            console.log("Delete transaction:", transaction.id);
        }
    };

    const handleExport = () => {
        console.log("Export transactions");
    };

    const handleAddNew = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    }; return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
                    <p className="text-gray-600 mt-1">
                        Manage and monitor all payment transactions
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button
                        onClick={handleAddNew}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="UNPAID">Unpaid</SelectItem>
                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Method Filter */}
                        <Select value={methodFilter} onValueChange={setMethodFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Methods" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="CASH">Cash</SelectItem>
                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                <SelectItem value="QRIS">QRIS</SelectItem>
                                <SelectItem value="BANK">Bank</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Reset Filters */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                setMethodFilter("all");
                            }}
                            className="w-full"
                        >
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <LoadingSpinner />
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No transactions found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Resident</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                {transaction.nomorUrut || transaction.id.slice(-6)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(transaction.tanggalBayar).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{transaction.resident?.namaWarga}</p>
                                                    <p className="text-sm text-gray-500">{transaction.resident?.nomorRumah}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {transaction.kategori?.namaKategori || 'Uncategorized'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={methodColors[transaction.metodePembayaran as keyof typeof methodColors] || methodColors.CASH}>
                                                    {transaction.metodePembayaran}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(transaction.jumlahNominal)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[transaction.statusPembayaran as keyof typeof statusColors] || statusColors.PENDING}>
                                                    {transaction.statusPembayaran}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(transaction)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(transaction)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(transaction)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transaction Modal */}
            <SimpleTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </div>
    );
}
