"use client";
import Layout from '@/component/layout/layout';
import React, { useEffect, useState } from 'react';
import CONFIG from '@/api/config';
import { Modal, Table } from 'antd';
import toast from 'react-hot-toast';

const Suppliers = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        description: '',
        image: null
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false); // Trạng thái modal huỷ

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/suppliers`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const req = await response.json();
            setData(req.data);
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: any) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleEdit = (supplier: any) => {
        setSelectedSupplier(supplier);
        setFormData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
            description: supplier.description,
            image: null
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            description: '',
            image: null
        });
        setIsEditing(false);
        setSelectedSupplier(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('description', formData.description);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const url = isEditing
                ? `${CONFIG.API_BASE_URL}/update-supplier/${selectedSupplier._id}`
                : `${CONFIG.API_BASE_URL}/add-supplier`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                body: formDataToSend,
            });
            const result = await response.json();

            if (result.status === 200) {
                toast.success(result.message);
                resetForm();
                fetchSuppliers();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (supplier: any) => {
        setSelectedSupplier(supplier);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/delete-supplier-by-id/${selectedSupplier._id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.status === 200) {
                toast.success(result.messenger);
                fetchSuppliers();
            } else {
                toast.error('Xóa thất bại: ' + result.messenger);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Có lỗi xảy ra khi xóa nhà cung cấp');
        }
    };

    const handleCancelClick = () => {
        setShowCancelModal(true); // Mở modal xác nhận huỷ
    };

    const handleConfirmCancel = () => {
        resetForm(); // Đặt lại form
        setShowCancelModal(false); // Đóng modal
    };

    const handleCancel = () => {
        setShowCancelModal(false); // Đóng modal nếu nhấn "Không"
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (text: any, record: any) => (
                <img src={record.image} alt={record.name} className="w-16 h-16 object-cover rounded-md" />
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Actions',
            render: (text: any, supplier: any) => (
                <>
                    <button
                        onClick={() => handleEdit(supplier)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => handleDelete(supplier)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                    >
                        Delete
                    </button>
                </>
            )
        }
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Layout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Suppliers</h1>
                    <button
                        onClick={() => {
                            if (showForm) {
                                handleCancelClick();
                            } else {
                                setShowForm(true);
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showForm ? 'Đóng' : 'Add Suppliers'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {isEditing ? 'Cập nhật hình ảnh (không bắt buộc)' : 'Hình ảnh'}
                            </label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="mt-1 block w-full"
                                accept="image/*"
                                required={!isEditing}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Huỷ
                            </button>
                        </div>
                    </form>
                )}

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />

                <Modal
                    title="Xóa nhà cung cấp"
                    open={showDeleteModal}
                    onOk={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                >
                    <p>Bạn có chắc chắn muốn xóa nhà cung cấp này không?</p>
                </Modal>

                <Modal
                    title="Xác nhận Huỷ"
                    open={showCancelModal}
                    onOk={handleConfirmCancel}
                    onCancel={handleCancel}
                >
                    <p>Bạn có chắc chắn muốn huỷ không?</p>
                </Modal>
            </div>
        </Layout>
    );
};

export default Suppliers;