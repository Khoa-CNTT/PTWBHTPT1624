import React, { memo, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { generateGeminiResponse } from '../../services/gemini.service';

interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
}

interface ChatBoxAIModalProps {
    isOpenBox: boolean;
    setIsOpenBox: (open: boolean) => void;
}

const ChatBoxAIModal: React.FC<ChatBoxAIModalProps> = ({ isOpenBox, setIsOpenBox }) => {
    const [prompt, setPrompt] = useState('');
    const [close, setClose] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: crypto.randomUUID(),
            role: 'bot',
            content: 'Chào bạn! Tôi là ChatBoxAI – trợ lý tư vấn tại cửa hàng thực phẩm. Bạn cần hỗ trợ gì, cứ nói nhé!',
        },
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to latest message
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle open/close animation
    useEffect(() => {
        if (isOpenBox) {
            setClose(true);
        } else {
            setTimeout(() => setClose(false), 299);
        }
    }, [isOpenBox]);

    const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: prompt.trim(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setPrompt('');

        try {
            const reply = await generateGeminiResponse(prompt);
            const botMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'bot',
                content: reply,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'bot',
                    content: 'Đã xảy ra lỗi khi gửi yêu cầu!',
                },
            ]);
            console.error(err);
        }
    };

    if (!close) return null;

    return (
        <div
            className={`tablet:fixed tablet:top-0 tablet:right-0 tablet:left-0 tablet:w-full tablet:h-full absolute bottom-0 right-0 w-auto h-[460px] bg-white shadow-search rounded-md duration-1000 origin-bottom-right z-[1000] ${
                isOpenBox ? 'laptop:animate-active-openChat' : 'laptop:animate-active-openChatOff'
            }`}>
            <div className="flex h-full w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {/* Header */}
                <div className="sticky flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 xl:px-6">
                    <div className="flex w-full items-center gap-3">
                        <div className="relative h-12 w-12 rounded-full">
                            <img
                                src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png"
                                alt="AI Avatar"
                                className="h-full w-full rounded-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-[1.5px] border-white bg-success-500"></span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Trợ lý AI</h5>
                    </div>
                    <button className="text-secondary" onClick={() => setIsOpenBox(!isOpenBox)}>
                        <ExpandMoreIcon fontSize="large" />
                    </button>
                </div>

                {/* Chat messages */}
                <div className="custom-scrollbar flex-1 overflow-auto p-5 space-y-6 xl:p-6 xl:space-y-8">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg.id}
                            ref={idx === messages.length - 1 ? scrollRef : null}
                            className={`flex w-full max-w-[400px] gap-3 ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'} mb-4`}>
                            {msg.role === 'bot' && (
                                <img
                                    src="https://photo.salekit.com/uploads/fchat_5b4872d13803896dd77125af/logo1.png"
                                    alt="Bot Avatar"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            )}
                            <div className={`flex max-w-[300px] flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-none'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90 rounded-tl-none'
                                    }`}>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input box */}
                <div className="sticky bottom-0 border-t border-gray-200 p-3 dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <div className="w-full relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM10.0001 9.23256C10.0001 8.5422 9.44042 7.98256 8.75007 7.98256C8.05971 7.98256 7.50007 8.5422 7.50007 9.23256C7.50007 9.92301 8.05971 10.4827 8.75007 10.4827C9.44042 10.4827 10.0001 9.92301 10.0001 9.23256ZM15.2499 7.98256C15.9403 7.98256 16.4999 8.5422 16.4999 9.23256C16.4999 9.92301 15.9403 10.4827 15.2499 10.4827C14.5596 10.4827 13.9999 9.92301 13.9999 9.23256C13.9999 8.5422 14.5596 7.98256 15.2499 7.98256ZM9.23014 13.7116C8.97215 13.3876 8.5003 13.334 8.17625 13.592C7.8522 13.85 7.79865 14.3219 8.05665 14.6459C8.97846 15.8037 10.4026 16.5481 12 16.5481C13.5975 16.5481 15.0216 15.8037 15.9434 14.6459C16.2014 14.3219 16.1479 13.85 15.8238 13.592C15.4998 13.334 15.0279 13.3876 14.7699 13.7116C14.1205 14.5274 13.1213 15.0481 12 15.0481C10.8788 15.0481 9.87961 14.5274 9.23014 13.7116Z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleSubmit(e);
                                    }
                                }}
                                placeholder="Nhập tin nhắn"
                                className="h-9 w-full bg-transparent pl-12 pr-5 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 outline-none"
                            />
                        </div>
                        <button type="submit" className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600">
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default memo(ChatBoxAIModal);
