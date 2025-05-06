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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const getConversationStyles = (conversation: IConversation) => {
        const isSelected = selectedConversation?._id === conversation._id;
        const hasUnread = !conversation.seen;

        return [
            'flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors',
            isSelected
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-900/40 dark:to-purple-900/40'
                : hasUnread
                ? 'bg-rose-100/50 dark:bg-rose-900/30'
                : '',
            'hover:bg-gradient-to-r hover:from-blue-200/30 hover:to-purple-200/30 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30',
        ].join(' ');
    };

    return (
        <aside
            className="flex flex-col rounded-2xl border border-gray-200/30 bg-gradient-to-b from-white/90 to-blue-50/50 backdrop-blur-md dark:border-gray-700/30 dark:bg-gradient-to-b dark:from-gray-900/90 dark:to-blue-950/50 xl:w-1/3 shadow-xl"
            onClick={(e) => {
                if (!(e.target as HTMLElement).closest('[data-dropdown]')) closeMobileMenu();
            }}>
            {/* Header */}
            <header className="sticky top-0 px-4 pt-4 pb-4 sm:px-5 sm:pt-5 xl:pb-0 bg-inherit">
                <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={toggleMobileMenu}
                        className="xl:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200/30 bg-white/40 text-gray-600 dark:border-gray-700/30 dark:bg-gray-800/40 dark:text-gray-300 transition-colors hover:bg-blue-200/50 dark:hover:bg-blue-900/40"
                        aria-label="Toggle menu">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full rounded-xl border border-gray-200/30 bg-white/40 py-2.5 pl-10 pr-3 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300/50 dark:border-gray-700/30 dark:bg-gray-800/40 dark:text-white dark:placeholder-gray-400 transition-colors"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </header>

            {/* Sidebar Content */}
            <section
                className={`no-scrollbar flex flex-col overflow-auto transition-all duration-300 ${
                    isMobileMenuOpen
                        ? 'fixed inset-0 z-[9999] bg-gradient-to-b from-white/90 to-blue-50/50 backdrop-blur-md dark:bg-gradient-to-b dark:from-gray-900/90 dark:to-blue-950/50 p-4 xl:static xl:w-auto'
                        : 'hidden xl:flex'
                }`}>
                {/* Mobile Header */}
                <div className="mb-4 flex items-center justify-between xl:hidden">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">Danh sách Chat</h2>
                    <button
                        onClick={closeMobileMenu}
                        className="rounded-full p-2 text-gray-600 hover:bg-blue-200/50 dark:text-gray-300 dark:hover:bg-blue-900/40 transition-colors"
                        aria-label="Close menu">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Conversationshe Conversation List */}
                <div className="flex flex-col gap-2 px-2 sm:px-4 my-2">
                    {conversations?.map((conversation) => {
                        const isOnline = userOnline?.some((user) => user.userId === conversation.user?._id);
                        const hasUnread = !conversation.seen;

                        return (
                            <div key={conversation._id} onClick={() => onSelectChat(conversation)} className={getConversationStyles(conversation)}>
                                <div className="relative h-12 w-12 shrink-0">
                                    <img
                                        src={conversation.user?.user_avatar_url || userAvatar}
                                        alt={conversation.user?.user_name}
                                        className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200/30 dark:ring-gray-700/30"
                                    />
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-gray-900" />
                                    )}
                                    {hasUnread && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-white dark:border-gray-900" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm ${hasUnread ? 'font-bold' : 'font-medium'} text-gray-800 dark:text-white tracking-tight`}>
                                            {conversation.user?.user_name}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(conversation.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </aside>
    );
};

export default Sidebar;
