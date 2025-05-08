/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ChatBoxAIModal from './ChatBoxAIModal';
import { apiGetPrompt } from '../../services/chatbot.service';

const ChatBoxAI: React.FC = () => {
    const [isOpenBox, setIsOpenBox] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetPrompt();
            setPrompt(res.context);
        };
        fetchApi();
    }, []);

    return (
        // fixed bottom-1 right-5
        <div className="tablet:hidden">
            <div
                onClick={() => setIsOpenBox(true)}
                className="flex flex-col items-center cursor-pointer justify-center  h-12  rounded-md  text-white text-sm   transition duration-200">
                <span className="mr-2">👤</span> Trợ lý
            </div>
            <ChatBoxAIModal isOpenBox={isOpenBox} setIsOpenBox={setIsOpenBox} context={prompt} />
        </div>
    );
};

export default ChatBoxAI;
