import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table/index";
import Badge from "../ui/badge/Badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { TransactionIuran } from "@/lib/types";

// Props interface for the component
interface RecentTransactionProps {
  isDashboard?: boolean; // true = dashboard view (ringkas), false = full page
  showActions?: boolean; // show action buttons (Edit, Delete, etc)
  maxRows?: number; // limit number of rows to display
  data?: TransactionIuran[]; // external data source
}

export default function RecentTransaction({
  isDashboard = true,
  showActions = false,
  maxRows = 5,
  data
}: RecentTransactionProps) {
  // Sample data fallback (same as before)
  const sampleTransactionData: TransactionIuran[] = [
    {
      no: 1,
      namaWarga: "Ahmad Santoso",
      nomorRumah: "A/1",
      alamatLengkap: "Jl. Melati No. 1 Blok A",
      kategoriPembayaran: "Iuran Rutin",
      periode: "Agustus 2025",
      jumlahNominal: 150000,
      metodePembayaran: "Transfer",
      statusPembayaran: "Paid",
      tanggalBayar: "2025-08-01",
      catatan: "Pembayaran tepat waktu",
      dibuatOleh: "Admin Sari"
    },
    {
      no: 2,
      namaWarga: "Siti Nurhaliza",
      nomorRumah: "B/2",
      kategoriPembayaran: "Sampah",
      periode: "Agustus 2025",
      jumlahNominal: 50000,
      metodePembayaran: "Cash",
      statusPembayaran: "Paid",
      tanggalBayar: "2025-08-03",
      dibuatOleh: "Admin Budi"
    },
    {
      no: 3,
      namaWarga: "Rizky Pratama",
      nomorRumah: "C/5",
      kategoriPembayaran: "Keamanan",
      periode: "Agustus 2025",
      jumlahNominal: 100000,
      metodePembayaran: "QRIS",
      statusPembayaran: "Pending",
      tanggalBayar: "2025-08-05",
      catatan: "Menunggu konfirmasi",
      dibuatOleh: "Admin Sari"
    },
    {
      no: 4,
      namaWarga: "Maya Sari",
      nomorRumah: "A/3",
      kategoriPembayaran: "Iuran Rutin",
      periode: "Juli 2025",
      jumlahNominal: 150000,
      metodePembayaran: "Bank",
      statusPembayaran: "Unpaid",
      tanggalBayar: "2025-07-28",
      catatan: "Terlambat 1 minggu",
      dibuatOleh: "Admin Budi"
    },
    {
      no: 5,
      namaWarga: "Budi Setiawan",
      nomorRumah: "D/1",
      kategoriPembayaran: "Iuran Rutin",
      periode: "Agustus 2025",
      jumlahNominal: 150000,
      metodePembayaran: "Transfer",
      statusPembayaran: "Paid",
      tanggalBayar: "2025-08-02",
      catatan: "Bayar untuk 2 bulan sekaligus",
      dibuatOleh: "Admin Sari"
    },
  ];

  // Use external data if provided, otherwise fall back to sample data
  const sourceData = data || sampleTransactionData;
  const displayData = sourceData.slice(0, maxRows);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date helper
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {isDashboard ? "Transaksi Iuran Terbaru" : "Tabel Transaksi Iuran"}
          </h3>
          {isDashboard && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {displayData.length} transaksi terbaru
            </p>
          )}
        </div>

        {!isDashboard && (
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <svg
                className="stroke-current fill-white dark:fill-gray-800"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.29004 5.90393H17.7067"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.7075 14.0961H2.29085"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  fill=""
                  stroke=""
                  strokeWidth="1.5"
                />
              </svg>
              Filter
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              Export
            </button>
          </div>
        )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {!isDashboard && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  No
                </TableCell>
              )}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama Warga
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Blok/No. Rumah
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kategori
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Periode
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Jumlah
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Metode
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              {!isDashboard && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal Bayar
                </TableCell>
              )}
              {!isDashboard && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Dibuat Oleh
                </TableCell>
              )}
              {showActions && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Aksi
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayData.map((transaction) => (
              <TableRow key={transaction.no} className="">
                {!isDashboard && (
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {transaction.no}
                  </TableCell>
                )}
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {transaction.namaWarga}
                    </p>
                    {transaction.alamatLengkap && !isDashboard && (
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {transaction.alamatLengkap}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-theme-xs font-medium">
                    {transaction.nomorRumah}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-theme-xs font-medium ${transaction.kategoriPembayaran === "Iuran Rutin"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : transaction.kategoriPembayaran === "Sampah"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    }`}>
                    {transaction.kategoriPembayaran}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {transaction.periode}
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {formatCurrency(transaction.jumlahNominal)}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-theme-xs font-medium ${transaction.metodePembayaran === "Cash"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : transaction.metodePembayaran === "Transfer"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : transaction.metodePembayaran === "QRIS"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}>
                    {transaction.metodePembayaran}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      transaction.statusPembayaran === "Paid"
                        ? "success"
                        : transaction.statusPembayaran === "Pending"
                          ? "warning"
                          : "error"
                    }
                  >
                    {transaction.statusPembayaran === "Paid" ? "Lunas" :
                      transaction.statusPembayaran === "Pending" ? "Pending" : "Belum Bayar"}
                  </Badge>
                </TableCell>
                {!isDashboard && (
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(transaction.tanggalBayar)}
                  </TableCell>
                )}
                {!isDashboard && (
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {transaction.dibuatOleh}
                  </TableCell>
                )}
                {showActions && (
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-green-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isDashboard && (
        <div className="mt-4 text-center">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Lihat Semua Transaksi
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>

  );
}
