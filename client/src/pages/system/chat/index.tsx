/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import PageMeta from '../../../components/common/PageMeta';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { getAllConversations } from '../../../services/conversation';
import { IConversation } from '../../../interfaces/conversation.interfaces';
import { apiMarkMessagesAsSeenByAdmin } from '../../../services/message.service';
import useSocketStore from '../../../store/socketStore';
import useAuthStore from '../../../store/authStore';

interface UserOnline {
    userId: string;
    socketId: string;
}

const ChatManage: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = useState<IConversation | undefined>();
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [userOnline, setUserOnline] = useState<UserOnline[]>([]);

    const { socket, connect, isConnected } = useSocketStore();
    const { isAdminLoggedIn } = useAuthStore();

    // Fetch all conversations on component mount
    useEffect(() => {
        const fetchConversations = async () => {
            const res = await getAllConversations();
            if (res.success) {
                setConversations(res.data);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);
    // Handle selecting a conversation
    const handleSelectChat = async (conversation: IConversation) => {
        await apiMarkMessagesAsSeenByAdmin(conversation._id);
        setConversations((prev) => prev.map((item) => (item._id === conversation._id ? { ...item, seen: true } : item)));
        setSelectedConversation(conversation);
    };

    // Socket event listeners
    useEffect(() => {
        if (!isConnected || !isAdminLoggedIn || !socket) return;

        // Handle 'getUserOnline' event
        const handleGetUserOnline = (users: UserOnline[]) => {
            setUserOnline(users);
        };
        // Register socket event listeners
        socket.on('getUserOnline', handleGetUserOnline);
        // Cleanup: Remove event listeners on unmount or dependency change
        return () => {
            socket.off('getUserOnline', handleGetUserOnline);
        };
    }, [isConnected, isAdminLoggedIn, socket]);

    return (
        <div className="mx-auto md:p-6">
            <PageMeta title="Quản lý nhắn tin" />
            <PageBreadcrumb pageTitle="Nhắn tin" />
            <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
                <div className="flex h-full flex-col gap-6 xl:flex-row xl:gap-5">
                    <Sidebar
                        userOnline={userOnline}
                        conversations={conversations}
                        selectedConversation={selectedConversation}
                        onSelectChat={handleSelectChat}
                    />
                    <ChatWindow userOnline={userOnline} selectedConversation={selectedConversation} />
                </div>
            </div>
        </div>
    );
};

export default ChatManage;
