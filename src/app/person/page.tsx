"use client";
import { useState, useEffect } from 'react';
import Layout from '@/component/layout/layout';
import { Pagination } from 'antd';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../configfibase/config";

interface List {
    userId: string | null | undefined;
    address: string;
    avatar: string;
    email: string;
    name: string;
    phone: string;
}

async function getUsers(setPerson: React.Dispatch<React.SetStateAction<List[]>>) {
    try {
        // // Truy vấn collection 'Client'
        // const querySnapshot = await getDocs(collection(db, "Client"));

        // // Duyệt qua các tài liệu trong collection
        // querySnapshot.forEach((doc) => {
        //     console.log("ID:", doc.id, "Dữ liệu:", doc.data()); // In ID và dữ liệu của mỗi document
        // });
        // Truy vấn collection 'Client'
        const querySnapshot = await getDocs(collection(db, "Client"));
        const userList: List[] = [];

        // Duyệt qua các tài liệu trong collection và lưu vào mảng
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            userList.push({
                userId: doc.id,
                address: data.address,
                avatar: data.avatar,
                email: data.email,
                name: data.name,
                phone: data.phone,
            });
        });

        // Cập nhật state với dữ liệu nhận được
        setPerson(userList);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
}

export default function Person() {


    const [persons, setPerson] = useState<List[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        getUsers(setPerson); // Gọi hàm getUsers khi component render
    }, []);

    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = persons.slice(startIndex, startIndex + pageSize);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Client List</h1>
                </div>

                <div className="overflow-y-auto h-[620px]">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Image</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Address</th>
                                <th className="px-4 py-2 text-left">Phone</th>
                                <th className="px-4 py-2 text-left">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((persons) => (
                                <tr key={persons.userId} className="border-b hover:bg-gray-100 transition duration-200">
                                    <td className="px-4 py-2">
                                        <img
                                            src={persons.avatar
                                                ? `data:image/png;base64,${persons.avatar}`
                                                : "/icons/image/1.png"}
                                            alt={persons.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        {/* <td className="px-4 py-2">{persons.userId}</td> */}
                                    </td>
                                    <td className="px-4 py-2">{persons.name}</td>
                                    <td className="px-4 py-2">{persons.address}</td>
                                    <td className="px-4 py-2">{persons.phone}</td>
                                    <td className="px-4 py-2 ">
                                        {persons.email}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={persons.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </Layout>
    );
}
