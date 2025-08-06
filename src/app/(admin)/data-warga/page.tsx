import ResidentManagement from "@/components/residents/ResidentManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Warga | E-Residence Dashboard",
    description: "Kelola data warga dan statistik perumahan",
};

export default function DataWargaPage() {
    return <ResidentManagement />;
}
