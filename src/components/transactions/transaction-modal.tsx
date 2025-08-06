"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
}

const transactionSchema = z.object({
    residentId: z.string().min(1, "Resident is required"),
    kategoriId: z.string().min(1, "Category is required"),
    periode: z.string().min(1, "Period is required"),
    jumlahNominal: z.number().min(1, "Amount must be greater than 0"),
    metodePembayaran: z.enum(["CASH", "TRANSFER", "QRIS", "BANK"]),
    statusPembayaran: z.enum(["PAID", "UNPAID", "PENDING", "OVERDUE"]),
    keterangan: z.string().optional(),
    tanggalJatuhTempo: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            residentId: "",
            kategoriId: "",
            periode: "",
            jumlahNominal: 0,
            metodePembayaran: "CASH",
            statusPembayaran: "UNPAID",
            keterangan: "",
            tanggalJatuhTempo: "",
        },
    });

    // Reset form when transaction changes
    useEffect(() => {
        if (transaction) {
            form.reset({
                residentId: transaction.residentId,
                kategoriId: transaction.kategoriId,
                periode: transaction.periode,
                jumlahNominal: transaction.jumlahNominal,
                metodePembayaran: transaction.metodePembayaran as any,
                statusPembayaran: transaction.statusPembayaran as any,
                keterangan: transaction.keterangan || "",
                tanggalJatuhTempo: transaction.tanggalJatuhTempo ? new Date(transaction.tanggalJatuhTempo).toISOString().split('T')[0] : "",
            });
        } else {
            form.reset({
                residentId: "",
                kategoriId: "",
                periode: "",
                jumlahNominal: 0,
                metodePembayaran: "CASH",
                statusPembayaran: "UNPAID",
                keterangan: "",
                tanggalJatuhTempo: "",
            });
        }
    }, [transaction, form]);

    const onSubmit = async (data: TransactionFormData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            console.log("Submit transaction:", data);

            // Here you would call your API
            await new Promise(resolve => setTimeout(resolve, 1000));

            onClose();
        } catch (error) {
            console.error('Error saving transaction:', error);
            alert('Failed to save transaction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock data for demo
    const mockResidents = [
        { id: "1", namaWarga: "Budi Santoso", nomorRumah: "A-12" },
        { id: "2", namaWarga: "Siti Aminah", nomorRumah: "B-08" },
        { id: "3", namaWarga: "Ahmad Rahman", nomorRumah: "C-15" },
    ];

    const mockCategories = [
        { id: "1", namaKategori: "Iuran Bulanan" },
        { id: "2", namaKategori: "Iuran Kebersihan" },
        { id: "3", namaKategori: "Iuran Keamanan" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="residentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resident *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select resident" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mockResidents.map((resident) => (
                                                    <SelectItem key={resident.id} value={resident.id}>
                                                        {resident.namaWarga} - {resident.nomorRumah}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kategoriId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mockCategories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.namaKategori}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="periode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Period *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 01/2025" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="jumlahNominal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="metodePembayaran"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CASH">Cash</SelectItem>
                                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                                <SelectItem value="QRIS">QRIS</SelectItem>
                                                <SelectItem value="BANK">Bank</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="statusPembayaran"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PAID">Paid</SelectItem>
                                                <SelectItem value="UNPAID">Unpaid</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="OVERDUE">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tanggalJatuhTempo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="keterangan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional notes..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <LoadingSpinner className="mr-2" />}
                                {transaction ? 'Update Transaction' : 'Create Transaction'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
