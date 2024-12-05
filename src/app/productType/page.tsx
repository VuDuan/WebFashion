"use client";
import CONFIG from "@/api/config";
import Layout from "@/component/layout/layout";
import React, { useState, useEffect } from "react";
interface Size {
    _id: string;
    name: string
}
interface ProductType {
    _id: string;
    name: string;
    image: string;
}
const Product = () => {
    const [data, setData] = useState<ProductType[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]); // Danh sách kích cỡ
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTypeProduct, setSelectedTypeProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        id_size: ''
    });

    useEffect(() => {
        fetchTypeProducts();
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/get-list-size`);
            const req = await response.json();
            setSizes(req.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTypeProducts = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/typeproduct`);
            const req = await response.json();
            setData(req.data);
        } catch (error) {
            console.error(error);
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

    const handleSizeChange = (e: any) => {
        const selectedSizes = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            id_size: selectedSizes.join(',') // Lưu ID kích cỡ dưới dạng chuỗi
        }));
    };

    const handleEdit = (typeProduct: any) => {
        setSelectedTypeProduct(typeProduct);
        setFormData({
            name: typeProduct.name,
            image: null,
            id_size: typeProduct.id_size.map((size: { _id: any; }) => size._id).join(','), // Chuyển đổi ID kích cỡ thành chuỗi
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            image: null,
            id_size: ''
        });
        setIsEditing(false);
        setSelectedTypeProduct(null);
        setShowModal(false);
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
            formDataToSend.append('id_size', formData.id_size);

            const url = isEditing
                ? `${CONFIG.API_BASE_URL}/update-typeproduct/${selectedTypeProduct._id}`
                : `${CONFIG.API_BASE_URL}/add-type`;

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
                const response = await fetch(`${CONFIG.API_BASE_URL}/delete-typeproduct-by-id/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (result.status === 200) {
                    alert(result.message);
                    fetchTypeProducts();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error deleting type product:', error);
                alert('Có lỗi xảy ra khi xóa loại sản phẩm');
            }
        }
    };

    return (
        <Layout>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Loại Sản Phẩm</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Thêm Loại Sản Phẩm
                    </button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <h2 className="text-xl font-bold mb-4">
                                {isEditing ? 'Cập nhật loại sản phẩm' : 'Thêm loại sản phẩm mới'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                    <label className="block text-sm font-medium text-gray-700">Kích cỡ</label>
                                    <select
                                        multiple
                                        onChange={handleSizeChange}
                                        value={formData.id_size.split(',')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        {sizes.map(size => (
                                            <option key={size._id} value={size._id}>{size.name}</option>
                                        ))}
                                    </select>
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
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto mt-6">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Tên</th>
                                <th className="py-3 px-6 text-left">Kích cỡ</th>
                                <th className="py-3 px-6 text-left">Hình ảnh</th>
                                <th className="py-3 px-6 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {data.map((typeProduct) => (
                                <tr key={typeProduct._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{typeProduct.name}</td>
                                    <td className="py-3 px-6 text-left">{typeProduct.id_size.map(size => size.name).join(', ')}</td>
                                    <td className="py-3 px-6 text-left">
                                        <img src={typeProduct.image} alt={typeProduct.name} className="w-16 h-16 object-cover rounded-md" />
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <button
                                            onClick={() => handleEdit(typeProduct)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded transition duration-300"
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            onClick={() => handleDelete(typeProduct._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded ml-2 transition duration-300"
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

export default Product;