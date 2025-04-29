/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import MessageIcon from '@mui/icons-material/Message';
import useAuthStore from '../../store/authStore';
import { useActionStore } from '../../store/actionStore';
import ChatModal from './chatModal';
import { apiCreateConversation } from '../../services/conversation';
import { apiGetUnreadMessagesCount } from '../../services/message.service';

const Chat: React.FC = () => {
    // const { socketRef } = useAppSelector((state) => state.action);
    const { isUserLoggedIn } = useAuthStore();
    const [conversationId, setConversationId] = useState<string>('');
    const [unreadMessages, SetUnreadMessages] = useState<number>(0);
    const { setIsOpenChat, setOpenFeatureAuth } = useActionStore();

    useEffect(() => {
        if (!conversationId) return;
        const fetchApi = async () => {
            const res = await apiGetUnreadMessagesCount(conversationId);
            console.log(res);
            if (res?.success) {
                SetUnreadMessages(res?.data?.unreadCount);
            }
        };
        fetchApi();
    }, [conversationId]);

    useEffect(() => {
        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
            return;
        }
        const fetchApi = async () => {
            const res = await apiCreateConversation();
            if (res?.success) {
                setConversationId(res?.data?._id);
            }
        };
        fetchApi();
    }, []);
    const handleAddConversation = () => {
        setIsOpenChat(true);
    };
    return (
        <div className="tablet:hidden fixed bottom-1 right-5 z-[999] ">
            <div
                className="relative flex items-center justify-center p-3 bg-blue-500 rounded-full text-white cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => {
                    if (!isUserLoggedIn) {
                        setOpenFeatureAuth(true);
                        return;
                    }
                    handleAddConversation();
                }}>
                <MessageIcon fontSize="large" />
                {isUserLoggedIn && unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadMessages}</span>
                )}
            </div>
            <ChatModal conversationId={conversationId} SetUnreadMessages={SetUnreadMessages} />
        </div>
    );
};

export default Chat;
