/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ChatBoxAIModal from './ChatBoxAIModal';
import { apiGetPrompt } from '../../services/chatbot.service';
import useUserStore from '../../store/userStore';
import { showNotification } from '../common/showNotification';

const ChatBoxAI: React.FC = () => {
    const [isOpenBox, setIsOpenBox] = useState<boolean>(false);
    const { user } = useUserStore();
    useEffect(() => {}, [user._id]);

    return (
        // fixed bottom-1 right-5
        <div className="tablet:hidden">
            <div
                onClick={() => {
                    if (!prompt) {
                        showNotification('⏳ Mình đang xử lý, chờ một chút nhé!');
                    } else {
                        setIsOpenBox(true);
                    }
                }}
                className="flex flex-col items-center cursor-pointer justify-center  h-12  rounded-md  text-white text-sm   transition duration-200">
                <span className="mr-2">👤</span> Trợ lý
            </div>
            <ChatBoxAIModal isOpenBox={isOpenBox} setIsOpenBox={setIsOpenBox} context={''} />
        </div>
    );
};

export default ChatBoxAI;
