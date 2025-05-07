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
        <div className={`flex w-full max-w-[400px] gap-3 ${isSentByUser ? 'ml-auto flex-row-reverse' : 'mr-auto'} mb-4`}>
            {/* Avatar (only for non-user messages) */}
            {!isSentByUser && (
                <div className="h-6 w-6 flex-shrink-0">
                    <img
                        src={message?.sender?.admin_avatar_url || message?.sender?.user_avatar_url || userAvatar}
                        alt="profile"
                        className="h-full w-full rounded-full object-cover object-center transition-transform duration-200 hover:scale-105"
                    />
                </div>
            )}

            {/* Message Content */}
            <div className={`flex max-w-[300px] flex-col gap-1 ${isSentByUser ? 'items-end' : 'items-start'}`}>
                {/* Image (if exists) */}
                {message.image && (
                    <div className="mb-2 h-[300px] w-full overflow-hidden rounded-xl shadow-sm">
                        <img src={message.image} alt="chat" className="h-full w-full object-contain transition-transform duration-200 hover:scale-105" />
                    </div>
                )}

                {/* Text Message */}
                {message.text && (
                    <div
                        className={`rounded-2xl px-4 py-2 text-sm shadow-sm transition-all duration-200 ${
                            isSentByUser
                                ? 'rounded-tr-none bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                                : 'rounded-tl-none bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90'
                        }`}>
                        <p>{message.text}</p>
                    </div>
                )}

                {/* Sender Info and Timestamp */}
                <p className={`text-xs text-gray-500 dark:text-gray-400 ${isSentByUser ? 'text-right' : 'text-left'}`}>
                    {!isSentByUser && (message?.sender?.user_name || message?.sender?.admin_name) + ', '}
                    {timeAgo(message.createdAt)}
                </p>
            </div>
        </div>
    );
};

export default ChatMessage;
