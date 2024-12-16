"use client";
import Layout from '@/component/layout/layout';
import React, { useState, useEffect } from 'react';
import CONFIG from '@/api/config';
import Image from 'next/image';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 max-w-md mx-auto transition-transform transform scale-95 hover:scale-100">
                <h2 className="text-xl font-bold mb-4">Xác nhận đã giao</h2>
                <p>Bạn có chắc chắn muốn hoàn thành đơn hàng này?</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderDetailModal = ({ isOpen, onClose, order }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!isOpen) return null;

    const handleNextImage = () => {
        if (order && order.products.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % order.products[0].productId.image.length);
        }
    };

    const handlePrevImage = () => {
        if (order && order.products.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + order.products[0].productId.image.length) % order.products[0].productId.image.length);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 max-w-md mx-auto transition-transform transform scale-95 hover:scale-100">
                <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng #{order?._id}</h2>
                <p>Tên người dùng: {order?.name_user}</p>
                <p>Số điện thoại: {order?.phone_user}</p>
                <p>Địa chỉ: {order?.address_user}</p>
                <p>Ngày đặt: {new Date(order?.createdAt).toLocaleDateString('vi-VN')}</p>
                <p>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.total_amount)}</p>
                <h3 className="font-bold mt-4">Sản phẩm:</h3>
                <ul>
                    {order?.products.map((item, index) => (
                        <li key={index} className="grid justify-between">
                            <div className="grid items-center">
                                <img
                                    src={item.productId?.image[currentImageIndex]}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="ml-4">
                                    <span>{item.productId?.product_name} - {item.quantity} x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                                </div>
                                <span className='ml-4'>Size: {item.sizeId?.name}</span>
                            </div>


                        </li>
                    ))}
                </ul>
                <div className="flex m-4">
                    <button onClick={handlePrevImage}>
                        <Image src="/icons/image/1.png" alt='' className="w-4 h-4 mr-2" width={20} height={20} />
                    </button>
                    <button onClick={handleNextImage}>
                        <Image src="/icons/image/2.png" alt='' className="w-4 h-4 mr-2" width={20} height={20} />
                    </button>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedState, setSelectedState] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null); // State để lưu đơn hàng đã chọn

    const orderStates = {
        0: 'Chờ xử lý',
        1: 'Đang giao',
        2: 'Đã giao',
        3: 'Hủy'
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${CONFIG.API_BASE_URL}/get-list-orders`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 200) {
                setOrders(data.data);
                setError(null);
            } else {
                setOrders([]);
                setError(data.messenger);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePayment = (orderId) => {
        setIsModalOpen(true);
        setCurrentOrderId(orderId);
    };

    const handleConfirmPayment = async () => {
        if (!currentOrderId) return;

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/update-order/${currentOrderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state: 2 })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 200) {
                fetchOrders();
            } else {
                throw new Error(data.messenger);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert(`Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng: ${err.message}`);
        } finally {
            setIsModalOpen(false);
            setCurrentOrderId(null);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newState) => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/update-order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state: newState })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 200) {
                fetchOrders();
            } else {
                throw new Error(data.messenger);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert(`Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng: ${err.message}`);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 text-center">
                <p>Đã xảy ra lỗi: {error}</p>
                <button
                    onClick={fetchOrders}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <Layout>
            <div className="p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
                    <div className="flex flex-wrap gap-2 overflow-auto">
                        {Object.entries(orderStates).map(([state, label]) => (
                            <button
                                key={state}
                                onClick={() => setSelectedState(Number(state))}
                                className={`px-4 py-2 rounded-lg ${selectedState === Number(state)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {!orders || orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Không có đơn hàng nào
                    </div>
                ) : (
                    <div className="space-y-4 overflow-auto">
                        {orders.filter(order => order.state === selectedState).map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow p-6 cursor-pointer"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-bold">Mã đơn: #{order._id}</h3>
                                        <p className="text-sm text-gray-500">
                                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        {order.state === 0 && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order._id, 1)}
                                                className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                                            >
                                                Đang giao
                                            </button>
                                        )}
                                        {order.state === 1 && (
                                            <button
                                                onClick={() => {
                                                    setCurrentOrderId(order._id); // Set ID của đơn hàng hiện tại
                                                    setIsModalOpen(true); // Mở modal xác nhận
                                                }}
                                                className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                            >
                                                Đã giao
                                            </button>
                                        )}
                                        {order.state === 2 && (
                                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                                Đã giao
                                            </span>
                                        )}
                                        {order.state === 3 && (
                                            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                                                Đã hủy
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 overflow-auto">
                                    {order.products.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4 border-b pb-4">
                                            <img
                                                src={item.productId?.image[0]}
                                                className="w-20 h-20 object-cover rounded cursor-pointer"
                                                onClick={() => setSelectedOrder(order)}
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.productId?.product_name}</h4>
                                                <p className="text-sm text-gray-500">
                                                    Số lượng: {item.quantity}
                                                </p>
                                                <p className="text-blue-600">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Tổng tiền:</span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {formatPrice(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <OrderDetailModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPayment}
            />
        </Layout>
    );
};

export default OrderList;