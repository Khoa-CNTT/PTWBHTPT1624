import { useState } from 'react';

interface TabsTableProps {
    newUsers: any[];
    potentialCustomers: any[];
}

const TAB_LIST = [
    { tab: 'new_users', title: 'New Users' },
    { tab: 'potential_customers', title: 'Potential Customers' },
];

export default function TabsTable({ newUsers, potentialCustomers }: TabsTableProps) {
    const [selectedTab, setSelectedTab] = useState<string>('new_users');

    const renderTable = () => {
        if (selectedTab === 'new_users') {
            return (
                <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <table className="min-w-full table-auto mt-4 border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Tên người dùng</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Số điện thoại</th>
                                <th className="border px-4 py-2">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="border px-4 py-2">{user.user_name}</td>
                                    <td className="border px-4 py-2">{user.user_email}</td>
                                    <td className="border px-4 py-2">{user.user_mobile}</td>
                                    <td className="border px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else if (selectedTab === 'potential_customers') {
            return (
                <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <table className="min-w-full table-auto mt-4 border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Tên người dùng</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Số điện thoại</th>
                                <th className="border px-4 py-2">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {potentialCustomers.map((user) => (
                                <tr key={user._id}>
                                    <td className="border px-4 py-2">{user.user_name}</td>
                                    <td className="border px-4 py-2">{user.user_email}</td>
                                    <td className="border px-4 py-2">{user.user_mobile}</td>
                                    <td className="border px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    return (
        <div>
            <div className="flex mb-6 space-x-4">
                {TAB_LIST.map((tabItem) => (
                    <button
                        key={tabItem.tab}
                        className={`px-4 py-2 rounded-md ${
                            selectedTab === tabItem.tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => setSelectedTab(tabItem.tab)}
                    >
                        {tabItem.title}
                    </button>
                ))}
            </div>

            {renderTable()}
        </div>
    );
}
