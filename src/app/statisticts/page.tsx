"use client";
import Layout from '@/component/layout/layout';
import React, { useEffect, useState } from 'react';
import CONFIG from '@/api/config';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface ProductSales {
    productName: string;
    quantity: number;
}

interface RevenueData {
    status: number;
    message: string;
    data: {
        totalRevenue: number;
        totalOrders: number;
        dailyRevenue?: { date: string; revenue: number }[];
    };
}

interface SalesData {
    status: number;
    message: string;
    data: {
        [key: string]: ProductSales;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RevenueStatistics = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState(formatDateForInput(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDateForInput(today));
    const [activeTimeRange, setActiveTimeRange] = useState('month');

    function formatDateForInput(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    const handleTimeRangeChange = (range: string) => {
        const today = new Date();
        let start = new Date();

        switch (range) {
            case 'week':
                start = new Date(today.setDate(today.getDate() - 7));
                break;
            case 'month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'year':
                start = new Date(today.getFullYear(), 0, 1);
                break;
            case 'today': // Thêm trường hợp cho ngày hôm nay
                start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
        }

        setActiveTimeRange(range);
        setStartDate(formatDateForInput(start));
        setEndDate(formatDateForInput(new Date()));
    };

    const fetchRevenueStatistics = async () => {
        try {
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/revenue-statistics?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch revenue statistics');
            }

            const result = await response.json();
            setRevenueData(result);
        } catch (err) {
            console.error('Revenue fetch error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await Promise.all([fetchRevenueStatistics()]);
        } catch (err) {
            console.error('Submit error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeFetch = async () => {
            try {
                await Promise.all([fetchRevenueStatistics()]);
            } catch (err) {
                console.error('Initial fetch error:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        initializeFetch();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    const prepareChartData = () => {
        if (!salesData?.data) return [];
        return Object.values(salesData.data).map(item => ({
            name: item.productName,
            value: item.quantity
        }));
    };

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Thống Kê Doanh Thu</h1>
                    <p className="text-gray-600 mt-2">Xem chi tiết doanh thu và số lượng bán hàng</p>
                </div>

                {/* Time Range Selector */}
                <div className="mb-6 flex space-x-4">
                    {['today', 'week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => handleTimeRangeChange(range)}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTimeRange === range
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Custom Date Range */}
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Áp dụng'}
                        </button>
                    </div>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Revenue Overview */}
                        {revenueData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-lg font-semibold mb-4">Tổng quan doanh thu</h3>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600">Tổng doanh thu</p>
                                            <p className="text-3xl font-bold text-blue-600">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(revenueData.data.totalRevenue)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Số đơn hàng</p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {revenueData.data.totalOrders}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={prepareChartData()}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label
                                            >
                                                {prepareChartData().map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Products Sales List */}
                        {salesData && (
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">Chi tiết bán hàng</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sản phẩm
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Số lượng bán
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {Object.entries(salesData.data).map(([id, product]) => (
                                                <tr key={id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {product.productName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {product.quantity} sản phẩm
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RevenueStatistics;