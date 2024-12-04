"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/component/layout/layout';
import CONFIG from '@/api/config';
export default function EvaluatePage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const [evaluates, setEvaluates] = useState([]);

    useEffect(() => {
        if (productId) {
            fetchEvaluates();
        }
    }, [productId]);

    const fetchEvaluates = async () => {
        const response = await fetch(`${CONFIG.API_BASE_URL}/evaluate?productId=${productId}`);
        const data = await response.json();
        if (data.status === 200) {
            setEvaluates(data.data);
        } else {
            console.error(data.message);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Danh Sách Đánh Giá</h1>
                {evaluates.length === 0 ? (
                    <p className="text-gray-500">Không có đánh giá nào.</p>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">ID Khách Hàng</th>
                                <th className="px-4 py-2">Đánh Giá</th>
                                <th className="px-4 py-2">Nhận Xét</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evaluates.map((evaluate) => (
                                <tr key={evaluate._id} className="border-b">
                                    <td className="px-4 py-2">{evaluate.id_client}</td>
                                    <td className="px-4 py-2">{evaluate.rate}</td>
                                    <td className="px-4 py-2">{evaluate.chat}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}