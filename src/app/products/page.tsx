"use client";

import { useState, useEffect, Key } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/component/layout/layout';
import CONFIG from '@/api/config';
import { Table, Pagination } from 'antd';

interface List {
    _id: Key | null | undefined;
    product_name: string,
    price: string,
    quantity: string,
    description: string,
    state: 'active',
    id_producttype: string,
    id_suppliers: string,
    selectedVoucher: string,
    sizeQuantities: [],
}

export default function Products() {
    const [products, setProducts] = useState<List[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Số sản phẩm trên mỗi trang
    const [vouchers, setVouchers] = useState([]);
    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        quantity: '',
        description: '',
        state: 'active',
        id_producttype: '',
        id_suppliers: '',
        selectedVoucher: '',
        sizeQuantities: [],
    });
    const [images, setImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
        fetchVouchers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/prodct`);
            const data = await response.json();
            if (data.status === 200) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchVouchers = async () => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/get-list-voucher`);
            const data = await response.json();
            if (data.status === 200) {
                setVouchers(data.data);
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    const handleDelete = async (id: any) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/delete-product/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        images.forEach((image) => {
            formDataToSend.append('image', image);
        });
        Object.keys(formData).forEach(key => {
            if (key === 'sizeQuantities') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const url = isEditing
                ? `${CONFIG.API_BASE_URL}/update-product/${currentProductId}`
                : `${CONFIG.API_BASE_URL}/add-product`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                body: formDataToSend,
            });
            if (response.ok) {
                fetchProducts();
                closeModal();
            }
        } catch (error) {
            console.error('Error adding/updating product:', error);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setFormData({
                product_name: product.product_name,
                price: product.price,
                quantity: product.quantity,
                description: product.description,
                state: product.state,
                id_producttype: product.id_producttype,
                id_suppliers: product.id_suppliers,
                selectedVoucher: '',
                sizeQuantities: product.sizeQuantities || [],
            });
            setCurrentProductId(product._id);
            setIsEditing(true);
        } else {
            setFormData({
                product_name: '',
                price: '',
                quantity: '',
                description: '',
                state: 'active',
                id_producttype: '',
                id_suppliers: '',
                selectedVoucher: '',
                sizeQuantities: [],
            });
            setCurrentProductId(null);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setImages([]);
    };

    // Tính toán sản phẩm trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = products.slice(startIndex, startIndex + pageSize);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Products List</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Add Product
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded shadow-lg p-6 w-1/2">
                            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.product_name}
                                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-gray-700">Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setImages(Array.from(e.target.files))}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='justify-center items-center'>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                    >
                                        {isEditing ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Price</th>
                                <th className="px-4 py-2 text-left">Quantity</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-100 transition duration-200">
                                    <td className="px-4 py-2">
                                        <img
                                            src={product.image[0]}
                                            alt={product.product_name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{product.product_name}</td>
                                    <td className="px-4 py-2">${product.price}</td>
                                    <td className="px-4 py-2">{product.quantity}</td>
                                    <td className="px-4 py-2">
                                        <div className="grid space-y-2">
                                            <button
                                                className="w-[90px] border rounded px-3 py-2 focus:outline-none focus:ring-2  bg-yellow-500-500"
                                                onClick={() => openModal(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="w-[90px] border rounded px-3 py-2 focus:outline-none focus:ring-2 bg-red-500"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Thêm phân trang */}
                <div className="flex justify-center mt-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={products.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </Layout>
    );
}