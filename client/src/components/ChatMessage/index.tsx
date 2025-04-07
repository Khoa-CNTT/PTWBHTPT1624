import React from 'react';
import { IMessage } from '../../interfaces/messages.interfaces';
import { userAvatar } from '../../assets';
import { timeAgo } from '../../utils/format/timeAgo';

interface ChatMessageProps {
    message: IMessage;
    isSentByUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSentByUser }) => {
    return (
        <div className={`max-w-[350px] ${isSentByUser ? 'ml-auto text-right' : ''}`}>
            {isSentByUser ? (
                <>
                    {message.text && (
                        <div className="ml-auto max-w-max rounded-lg rounded-tr-sm bg-brand-500 px-3 py-2 dark:bg-brand-500">
                            <p className="text-sm text-white dark:text-white/90">{message.text}</p>
                        </div>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{timeAgo(message.createdAt)}</p>
                </>
            ) : (
                <div className="flex items-start gap-4">
                    <div className="h-10 w-full max-w-10 rounded-full">
                        <img
                            src={message.sender.admin_avatar_url || message.sender.user_avatar_url || userAvatar}
                            alt="profile"
                            className="h-full w-full overflow-hidden rounded-full object-cover object-center"
                        />
                    </div>
                    <div>
                        {message.image && (
                            <div className="mb-2 w-full max-w-[270px] overflow-hidden rounded-lg">
                                <img src={message.image} alt="chat" />
                            </div>
                        )}
                        {message.text && (
                            <div className="max-w-max rounded-lg rounded-tl-sm bg-gray-100 px-3 py-2 dark:bg-white/5">
                                <p className="text-sm text-gray-800 dark:text-white/90">{message.text}</p>
                            </div>
                        )}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {message.sender.user_name || message.sender.admin_name}, {timeAgo(message.createdAt)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
