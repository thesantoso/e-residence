"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatCurrency } from "@/utils/format";
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";

export function TransactionStats() {
    // Mock data for demonstration
    const stats = {
        totalRevenue: 15750000,
        revenueGrowth: 12.5,
        pendingAmount: 2250000,
        pendingCount: 15,
        completedCount: 145,
        failedCount: 3,
    };

    const statCards = [
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            description: `+${stats.revenueGrowth.toFixed(1)}% from last month`,
            color: "text-green-600",
            bgColor: "bg-green-50",
            trend: "up",
        },
        {
            title: "Pending Payments",
            value: formatCurrency(stats.pendingAmount),
            icon: Clock,
            description: `${stats.pendingCount} pending transactions`,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Completed",
            value: stats.completedCount.toString(),
            icon: CheckCircle,
            description: "Successful transactions",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Failed/Overdue",
            value: stats.failedCount.toString(),
            icon: XCircle,
            description: "Failed or overdue",
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                            {stat.trend && (
                                <div className="mt-4 flex items-center">
                                    <TrendingUp
                                        className={`h-4 w-4 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {stat.description}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Monthly Revenue Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">November 2024</span>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(14500000)}</p>
                                    <p className="text-xs text-gray-500">125 transactions</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">December 2024</span>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(16250000)}</p>
                                    <p className="text-xs text-gray-500">138 transactions</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">January 2025</span>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(15750000)}</p>
                                    <p className="text-xs text-gray-500">145 transactions</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recent Transactions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Budi Santoso</p>
                                    <p className="text-xs text-gray-500">A-12</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(150000)}</p>
                                    <Badge className="text-xs bg-green-100 text-green-800">
                                        PAID
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Siti Aminah</p>
                                    <p className="text-xs text-gray-500">B-08</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(75000)}</p>
                                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                        PENDING
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Ahmad Rahman</p>
                                    <p className="text-xs text-gray-500">C-15</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(200000)}</p>
                                    <Badge className="text-xs bg-green-100 text-green-800">
                                        PAID
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
