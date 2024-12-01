// pages/vouchers/index.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/component/layout/layout';

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
    const router = useRouter();

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        const response = await fetch('http://192.168.1.3:3000/api/get-list-voucher');
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
        const url = editingId ? `http://192.168.1.3:3000/api/update-voucher/${editingId}` : 'http://192.168.1.3:3000/api/add-voucher';

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

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
            await fetch(`http://192.168.1.3:3000/api/vouchers/${id}`, {
                method: 'DELETE',
            });
            fetchVouchers();
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4 text-black">Quản Lý Voucher</h1>
                <form onSubmit={handleSubmit} className="space-y-4 mb-6 text-gray-400">
                    <input type="text" name="name" placeholder="Tên Voucher" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                    <input type="text" name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    <input type="number" name="discountValue" placeholder="Giá trị giảm giá" value={formData.discountValue} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
                    <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option value="percent">Phần trăm</option>
                        <option value="fixed">Giá cố định</option>
                    </select>
                    <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} className="w-full border rounded px-3 py-2 " />
                    <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    <input type="number" name="minimumOrderValue" placeholder="Giá tối thiểu" value={formData.minimumOrderValue} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border rounded px-3 py-2" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? 'Cập nhật Voucher' : 'Thêm Voucher'}</button>
                </form>

                <h2 className="text-xl font-bold mb-2 text-black">Danh Sách Voucher</h2>
                <table className="min-w-full bg-white shadow-md rounded text-black overflow-y-auto">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Tên</th>
                            <th className="px-4 py-2">Giá Trị Giảm Giá</th>
                            <th className="px-4 py-2">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((voucher) => (
                            <tr key={voucher._id} className="border-b">
                                <td className="px-4 py-2">{voucher.name}</td>
                                <td className="px-4 py-2">{voucher.discountValue}</td>
                                <td className="px-4 py-2">
                                    <button className="text-blue-500 hover:underline" onClick={() => handleEdit(voucher)}>Sửa</button>
                                    <button className="text-red-500 hover:underline ml-4" onClick={() => handleDelete(voucher._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}