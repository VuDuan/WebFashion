"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Products() {
    const [products, setProducts] = useState([]);
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
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
        fetchVouchers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://192.168.1.3:3000/api/prodct');
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
            const response = await fetch('http://192.168.1.3:3000/api/get-list-voucher');
            const data = await response.json();
            if (data.status === 200) {
                setVouchers(data.data);
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://192.168.1.3:3000/api/delete-product/${id}`, {
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

    const handleSubmit = async (e) => {
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
            const response = await fetch('http://192.168.1.3:3000/api/add-product', {
                method: 'POST',
                body: formDataToSend,
            });
            if (response.ok) {
                router.push('/products');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-black">Products List</h1>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isAdding ? 'Cancel' : 'Add Product'}
                    </button>
                </div>

                {isAdding ? (
                    <form onSubmit={handleSubmit} className="max-w-2xl mb-6">
                        <div className="mb-4">
                            <label className="block mb-2">Product Name</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2"
                                value={formData.product_name}
                                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full border rounded px-3 py-2"
                                onChange={(e) => setImages(Array.from(e.target.files))}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Price</label>
                            <input
                                type="number"
                                className="w-full border rounded px-3 py-2"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Voucher</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.selectedVoucher}
                                onChange={(e) => setFormData({ ...formData, selectedVoucher: e.target.value })}
                            >
                                <option value="">Select Voucher</option>
                                {vouchers.map((voucher) => (
                                    <option key={voucher._id} value={voucher._id}>
                                        {voucher.name} - {voucher.discountValue}
                                        {voucher.discountType === 'percent' ? '%' : '$'} off
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Product
                        </button>
                    </form>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded">
                            <thead className="bg-gray-100 text-black">
                                <tr>
                                    <th className="px-4 py-2">Image</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b text-black">
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
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-red-500 hover:underline"
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
                )}
            </div>
        </Layout>
    );
}