"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { User, Calendar, CreditCard, Hash, DollarSign } from "lucide-react";

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

interface TransactionDetailProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

const statusColors = {
    PAID: "bg-green-100 text-green-800 border-green-200",
    UNPAID: "bg-red-100 text-red-800 border-red-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    OVERDUE: "bg-red-100 text-red-800 border-red-200",
};

const methodColors = {
    CASH: "bg-blue-100 text-blue-800 border-blue-200",
    TRANSFER: "bg-green-100 text-green-800 border-green-200",
    QRIS: "bg-purple-100 text-purple-800 border-purple-200",
    BANK: "bg-orange-100 text-orange-800 border-orange-200",
};

export function TransactionDetail({ isOpen, onClose, transaction }: TransactionDetailProps) {
    if (!transaction) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Transaction Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">
                                        #{transaction.nomorUrut || transaction.id.slice(-6)}
                                    </CardTitle>
                                    <p className="text-gray-600 mt-1">
                                        {new Date(transaction.tanggalBayar).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className={statusColors[transaction.statusPembayaran as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}>
                                        {transaction.statusPembayaran}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Transaction Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Transaction Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-semibold text-lg">
                                        {formatCurrency(transaction.jumlahNominal)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-medium">{transaction.kategori?.namaKategori || 'N/A'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <Badge className={methodColors[transaction.metodePembayaran as keyof typeof methodColors] || methodColors.CASH}>
                                        {transaction.metodePembayaran}
                                    </Badge>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span>{transaction.periode}</span>
                                </div>

                                {transaction.tanggalJatuhTempo && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Due Date:</span>
                                        <span>{new Date(transaction.tanggalJatuhTempo).toLocaleDateString('id-ID')}</span>
                                    </div>
                                )}

                                {transaction.keterangan && (
                                    <div>
                                        <span className="text-gray-600 block mb-2">Description:</span>
                                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                                            {transaction.keterangan}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Resident Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Resident Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {transaction.resident ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">{transaction.resident.namaWarga}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">House Number:</span>
                                            <span>{transaction.resident.nomorRumah}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Resident ID:</span>
                                            <span className="font-medium">{transaction.residentId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created By:</span>
                                            <span>{transaction.profileId}</span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
