/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { IConversation } from '../../../interfaces/conversation.interfaces';
import { timeAgo } from '../../../utils/format/timeAgo';
import { userAvatar } from '../../../assets';

interface UserOnline {
    userId: string;
    socketId: string;
}

interface SidebarProps {
    conversations: IConversation[];
    onSelectChat: (conversation: IConversation) => void;
    userOnline: UserOnline[];
    selectedConversation: IConversation | any;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, onSelectChat, userOnline, selectedConversation }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    return (
        <div
            className="flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 xl:flex xl:w-1/3"
            onClick={(e: React.MouseEvent) => {
                if (!(e.target as HTMLElement).closest('[data-dropdown]')) setIsMobile(false);
            }}>
            {/* Header */}
            <div className="sticky px-4 pt-4 pb-4 sm:px-5 sm:pt-5 xl:pb-0">
                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={() => setIsMobile(!isMobile)}
                        className="xl:hidden flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Search Input */}
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow focus:border-indigo-400 focus:ring focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* Sidebar content */}
            <div
                className={`no-scrollbar flex-col overflow-auto transition-all duration-200 ${
                    isMobile ? 'fixed top-0 left-0 z-[9999] flex h-full w-full bg-white dark:bg-gray-900 p-4 xl:static xl:w-auto' : 'hidden xl:flex'
                }`}>
                {/* Mobile Header */}
                <div className="mb-4 flex items-center justify-between xl:hidden">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Danh sách Chat</h2>
                    <button
                        onClick={() => setIsMobile(false)}
                        className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Conversation List */}
                <div className="flex flex-col gap-2 px-2 sm:px-4 my-2">
                    {conversations?.map((c) => {
                        const isSelected = selectedConversation?._id === c._id;
                        const isOnline = userOnline?.some((user) => user?.userId === c?.user?._id);
                        return (
                            <div
                                key={c._id}
                                onClick={() => onSelectChat(c)}
                                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                    isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : c.seen ? '' : 'bg-green-50'
                                }`}>
                                <div className="relative h-12 w-12 shrink-0">
                                    <img
                                        src={c?.user?.user_avatar_url || userAvatar}
                                        alt={c?.user?.user_name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{c?.user?.user_name}</p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(c?.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
