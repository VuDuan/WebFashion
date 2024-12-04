"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/component/layout/layout';
import CONFIG from '@/api/config';
import { Pagination } from 'antd';

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        discountValue: '',
        discountType: 'percent',
        validFrom: '',
        validUntil: '',
        minimumOrderValue: '',
    });
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Số lượng voucher trên mỗi trang
    const router = useRouter();

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        const response = await fetch(`${CONFIG.API_BASE_URL}/get-list-voucher`);
        const data = await response.json();
        if (data.status === 200) {
            setVouchers(data.data);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('image', image);
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${CONFIG.API_BASE_URL}/update-voucher/${editingId}` : `${CONFIG.API_BASE_URL}/add-voucher`;

        const response = await fetch(url, {
            method: method,
            body: formDataToSend,
        });

        if (response.ok) {
            setFormData({
                name: '',
                description: '',
                discountValue: '',
                discountType: 'percent',
                validFrom: '',
                validUntil: '',
                minimumOrderValue: '',
            });
            setImage(null);
            setEditingId(null);
            fetchVouchers();
        }
    };

    const handleEdit = (voucher) => {
        setFormData({
            name: voucher.name,
            description: voucher.description,
            discountValue: voucher.discountValue,
            discountType: voucher.discountType,
            validFrom: voucher.validFrom.split('T')[0],
            validUntil: voucher.validUntil.split('T')[0],
            minimumOrderValue: voucher.minimumOrderValue,
        });
        setEditingId(voucher._id);
    };

    // Tính toán sản phẩm trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const currentVouchers = vouchers.slice(startIndex, startIndex + pageSize);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản Lý Voucher</h1>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Tên Voucher" value={formData.name} onChange={handleChange} required className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="number" name="discountValue" placeholder="Giá trị giảm giá" value={formData.discountValue} onChange={handleChange} required className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <select name="discountType" value={formData.discountType} onChange={handleChange} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="percent">Phần trăm</option>
                            <option value="fixed">Giá cố định</option>
                        </select>
                        <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="number" name="minimumOrderValue" placeholder="Giá tối thiểu" value={formData.minimumOrderValue} onChange={handleChange} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">{editingId ? 'Cập nhật Voucher' : 'Thêm Voucher'}</button>
                </form>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Danh Sách Voucher</h2>
                <table className="min-w-full bg-white shadow-md rounded-lg text-black">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Tên</th>
                            <th className="px-4 py-2 text-left">Giá Trị Giảm Giá</th>
                            <th className="px-4 py-2 text-left">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVouchers.map((voucher) => (
                            <tr key={voucher._id} className="border-b hover:bg-gray-100 transition duration-200">
                                <td className="px-4 py-2">{voucher.name}</td>
                                <td className="px-4 py-2">{voucher.discountValue}</td>
                                <td className="px-4 py-2">
                                    <button className="w-[90px] border rounded px-3 py-2 focus:outline-none focus:ring-2  bg-yellow-500"
                                        onClick={() => handleEdit(voucher)}>Sửa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Thêm phân trang */}
                <div className="flex justify-center mt-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={vouchers.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </Layout>
    );
}