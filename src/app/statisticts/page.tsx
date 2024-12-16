"use client";
import Layout from '@/component/layout/layout';
import React, { useEffect, useState } from 'react';
import CONFIG from '@/api/config';
import { Modal } from 'antd'; // Thêm Modal từ thư viện antd

interface RevenueData {
    status: number;
    message: string;
    data: {
        totalRevenue: number;
        totalOrders: number;
        orders: Array<{
            _id: string;
            createdAt: string;
            total_amount: number;
        }>;
    };
}

interface OrderDetails {
    _id: string;
    clientId: string;
    state: string;
    total_amount: number;
    order_time: string;
    products: Array<{
        productId: string;
        productName: string;
        sizeId: string;
        sizeName: string;
        quantity: number;
    }>;
}

const RevenueStatistics = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState(formatDateForInput(firstDayOfMonth));
    const [endDate, setEndDate] = useState(formatDateForInput(today));
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Hiển thị 4 đơn hàng mỗi trang
    const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function formatDateForInput(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    const fetchRevenueStatistics = async () => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            setError("startDate phải nhỏ hơn endDate");
            return;
        }

        try {
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/revenue-statistics?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
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

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/orders/${orderId}`);
            const data = await response.json();

            if (data.status === 200) {
                setSelectedOrder(data.data);
                setIsModalOpen(true);
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error('Order fetch error:', err);
            setError('Lỗi khi lấy chi tiết đơn hàng');
        }
    };

    useEffect(() => {
        const initializeFetch = async () => {
            await fetchRevenueStatistics();
            setLoading(false);
        };

        initializeFetch();
    }, [startDate, endDate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const totalPages = Math.ceil((revenueData?.data.totalOrders || 0) / itemsPerPage);
    const currentOrders = revenueData?.data.orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleOrderClick = (orderId: string) => {
        fetchOrderDetails(orderId);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Thống Kê Doanh Thu</h1>
                    <p className="text-gray-600 mt-2">Xem chi tiết doanh thu và số lượng bán hàng</p>
                </div>

                {/* Custom Date Range */}
                <form onSubmit={(e) => { e.preventDefault(); fetchRevenueStatistics(); }} className="mb-8 bg-white p-4 rounded-lg shadow">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
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
                        >
                            Áp dụng
                        </button>
                    </div>
                </form>

                {/* Revenue Overview */}
                {revenueData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Tổng quan doanh thu</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600">Tổng doanh thu</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {formatCurrency(revenueData.data.totalRevenue)}
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
                    </div>
                )}

                {/* Orders List */}
                {revenueData && currentOrders.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID Đơn Hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày Tạo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tổng Tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentOrders.map(order => (
                                        <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOrderClick(order._id)}>
                                            <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(order.total_amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span>{`Trang ${currentPage} / ${totalPages}`}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
                {/* Modal Chi Tiết Đơn Hàng */}
                <Modal
                    title="Chi Tiết Đơn Hàng"
                    open={isModalOpen}
                 onCancel={() => setIsModalOpen(false)}
                    footer={[
                        <button key="close" onClick={() => setIsModalOpen(false)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Đóng
                        </button>,
                    ]}
                >
                    {selectedOrder && (
                        <div>
                            <p>ID Đơn Hàng: {selectedOrder._id}</p>
                            <p>Tổng Tiền: {formatCurrency(selectedOrder.total_amount)}</p>
                            <p>Ngày Tạo: {new Date(selectedOrder.order_time).toLocaleString()}</p>
                            <h3 className="font-semibold mt-2">Sản phẩm:</h3>
                            <ul className="list-disc list-inside">
                                {selectedOrder.products.map(product => (
                                    <p key={product.productId}>
                                        {product.productName} - {product.sizeName} : {product.quantity}
                                    </p>
                                ))}
                            </ul>
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
};

export default RevenueStatistics;