/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useActionStore } from '../../store/actionStore';
import ChatModal from './chatModal';
import { apiCreateConversation } from '../../services/conversation';
import { apiGetUnreadMessagesCount } from '../../services/message.service';
import MessageIcon from '@mui/icons-material/Message';
import useSocketStore from '../../store/socketStore';
import { cuoiAudio } from '../../assets';

const Chat: React.FC = () => {
    // const { socketRef } = useAppSelector((state) => state.action);
    const { isUserLoggedIn } = useAuthStore();
    const [conversationId, setConversationId] = useState<string>('');
    const [unreadMessages, SetUnreadMessages] = useState<number>(0);
    const { setIsOpenChat, setOpenFeatureAuth } = useActionStore();

    const { socket, connect, isConnected } = useSocketStore();
    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);
    useEffect(() => {
        if (!isConnected || !isUserLoggedIn) return;

        // Handle 'getMessage' event to increment unread messages
        const handleSetUnreadMessages = () => {
            SetUnreadMessages((prev) => prev + 1);
            const audio = new Audio(cuoiAudio);
            audio.play().catch((err) => {
                console.warn('🔇 Không thể phát âm thanh:', err);
            });
        };
        // Register socket event listener
        socket.on('getMessage', handleSetUnreadMessages);
        // Cleanup: Remove event listener on unmount or dependency change
        return () => {
            socket.off('getMessage', handleSetUnreadMessages);
        };
    }, [isConnected, isUserLoggedIn, socket]);
    useEffect(() => {
        if (!conversationId) return;
        const fetchApi = async () => {
            const res = await apiGetUnreadMessagesCount(conversationId);
            if (res?.success) {
                SetUnreadMessages(res?.data?.unreadCount);
            }
        };
        fetchApi();
    }, [conversationId]);

    useEffect(() => {
        if (!isUserLoggedIn) return;
        const fetchApi = async () => {
            const res = await apiCreateConversation();
            if (res?.success) {
                setConversationId(res?.data?._id);
            }
        };
        fetchApi();
    }, [isUserLoggedIn]);
    const handleAddConversation = () => {
        setIsOpenChat(true);
    };
    return (
        // fixed bottom-1 right-5
        <div className="tablet:hidden z-[999] ">
            <div
                onClick={() => {
                    if (!isUserLoggedIn) {
                        setOpenFeatureAuth(true);
                        return;
                    }
                    handleAddConversation();
                }}
                className="flex flex-col  items-center  cursor-pointer justify-center  h-12 text-white rounded-md text-sm   relative transition duration-200">
                <span className="mr-2">
                    <MessageIcon />
                </span>
                Tin mới
                {isUserLoggedIn && unreadMessages > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessages}
                    </span>
                )}
            </div>
            <ChatModal conversationId={conversationId} SetUnreadMessages={SetUnreadMessages} />
        </div>
    );
};

export default Chat;
