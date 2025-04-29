import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import PageMeta from '../../../components/common/PageMeta';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { getAllConversations } from '../../../services/conversation';
import { IConversation } from '../../../interfaces/conversation.interfaces';
import { apiMarkMessagesAsSeenByAdmin } from '../../../services/message.service';

const ChatManage: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = useState<IConversation>();

    const [conversations, setConversations] = useState<IConversation[]>([]);
    const handleSelectChat = async (conversation: IConversation) => {
        await apiMarkMessagesAsSeenByAdmin(conversation._id);
        setConversations((prev) => prev.map((i) => (i._id === conversation._id ? { ...i, seen: true } : i)));
        setSelectedConversation(conversation);
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await getAllConversations();
            if (!res.success) return;
            const data = res.data;
            setConversations(data);
        };
        fetchApi();
    }, []);

    return (
        <div className="mx-auto md:p-6">
            <PageMeta title="Quản lý nhắn tin" />
            <PageBreadcrumb pageTitle="Nhắn tin" />
            <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
                <div className="flex h-full flex-col gap-6 xl:flex-row xl:gap-5">
                    <Sidebar conversations={conversations} onSelectChat={handleSelectChat} />
                    <ChatWindow selectedConversation={selectedConversation} />
                </div>
            </div>
        </div>
    );
};

export default ChatManage;
