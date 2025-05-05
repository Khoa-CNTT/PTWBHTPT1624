/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import ChatBoxAIModel from './ChatBoxAIModel';

const ChatBoxAI: React.FC = () => {
    const [isOpenBox, setIsOpenBox] = useState<boolean>(false);

    return (
        // fixed bottom-1 right-5
        <div className="tablet:hidden">
            <div
                onClick={() => setIsOpenBox(true)}
                className="flex flex-col items-center cursor-pointer justify-center  h-12  rounded-md  text-white text-sm   transition duration-200">
                <span className="mr-2">👤</span> Trợ lý
            </div>
            <ChatBoxAIModel isOpenBox={isOpenBox} setIsOpenBox={setIsOpenBox} />
        </div>
    );
};

export default ChatBoxAI;
