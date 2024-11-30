"use client";

import Layout from "@/component/layout/layout";
import React, { useState } from "react";

const product = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTypeProduct, setSelectedTypeProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: null
    });

    React.useEffect(() => {
        fetchTypeProducts();
    }, []);

    const fetchTypeProducts = async () => {
        try {
            const response = await fetch('http://192.168.1.36:3000/api/typeproduct');
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

    const handleEdit = (typeProduct: any) => {
        setSelectedTypeProduct(typeProduct);
        setFormData({
            name: typeProduct.name,
            image: null
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            image: null
        });
        setIsEditing(false);
        setSelectedTypeProduct(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const url = isEditing
                ? `http://192.168.1.36:3000/api/update-typeproduct/${selectedTypeProduct._id}`
                : 'http://192.168.1.36:3000/api/add-type';

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.status === 200) {
                alert(result.message);
                resetForm();
                fetchTypeProducts();
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

    const handleDelete = async (id: any) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại sản phẩm này không?')) {
            try {
                const response = await fetch(`http://192.168.1.36:3000/api/delete-typeproduct-by-id/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (result.status === 200) {
                    alert(result.messenger);
                    fetchTypeProducts();
                } else {
                    alert('Xóa thất bại: ' + result.messenger);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa loại sản phẩm');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Layout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Loại Sản Phẩm</h1>
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
                        {showForm ? 'Đóng' : 'Thêm Loại Sản Phẩm'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Cập nhật loại sản phẩm' : 'Thêm loại sản phẩm mới'}
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên loại sản phẩm</label>
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
                                Hủy
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Image</th>
                                <th className="py-3 px-6 text-left">Tên</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {data.map((typeProduct) => (
                                <tr key={typeProduct._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">
                                        <img src={typeProduct.image} alt={typeProduct.name} className="w-16 h-16 object-cover rounded-md" />
                                    </td>
                                    <td className="py-3 px-6 text-left">{typeProduct.name}</td>
                                    <td className="py-3 px-6 text-left">
                                        <button
                                            onClick={() => handleEdit(typeProduct)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            onClick={() => handleDelete(typeProduct._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded ml-2"
                                        >
                                            Xóa
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

export default product;