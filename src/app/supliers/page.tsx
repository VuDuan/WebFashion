"use client";
import Layout from '@/component/layout/layout';
import React, { useEffect, useState } from 'react';

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

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://192.168.1.4:3000/api/suppliers');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const req = await response.json();
            setData(req.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleEdit = (supplier) => {
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

    const handleSubmit = async (e) => {
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
                ? `http://192.168.1.4:3000/api/update-supplier/${selectedSupplier._id}`
                : 'http://192.168.1.4:3000/api/add-supplier';

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.status === 200) {
                alert(result.message);
                resetForm();
                fetchSuppliers();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này không?')) {
            try {
                const response = await fetch(`http://192.168.1.4:3000/api/delete-supplier-by-id/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (result.status === 200) {
                    alert(result.messenger);
                    fetchSuppliers();
                } else {
                    alert('Xóa thất bại: ' + result.messenger);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa nhà cung cấp');
            }
        }
    };

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
                                resetForm();
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
                                onClick={resetForm}
                                className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancle
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Image</th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Description</th>
                                <th className="py-3 px-6 text-left">Phone</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {data.map((supplier) => (
                                <tr key={supplier._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">
                                        <img src={supplier.image} alt={supplier.name} className="w-16 h-16 object-cover rounded-md" />
                                    </td>
                                    <td className="py-3 px-6 text-left">{supplier.name}</td>
                                    <td className="py-3 px-6 text-left">{supplier.description}</td>
                                    <td className="py-3 px-6 text-left">{supplier.phone}</td>
                                    <td className="py-3 px-6 text-left">{supplier.email}</td>
                                    <td className="py-3 px-6 text-left">
                                        <button
                                            onClick={() => handleEdit(supplier)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(supplier._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Suppliers;