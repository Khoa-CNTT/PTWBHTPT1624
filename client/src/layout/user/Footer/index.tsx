import React, { useEffect, useRef, useState } from 'react';
import useCountUp from '../../../hooks/useCountUp';
import { apiGetProductStats } from '../../../services/dashboard.service'; // Đảm bảo đã import đúng API

// Interface for statistic items
interface StatisticItem {
    id: string;
    value: number;
    name: string;
}

// Interface for contact items
interface ContactItem {
    id: string;
    text: string;
    value: string;
    type: 'phone' | 'email' | 'zalo';
}

// Interface for footer props
interface FooterProps {
    statistics?: StatisticItem[];
    contacts?: ContactItem[];
}

// Static data for contacts
const DEFAULT_CONTACTS: ContactItem[] = [
    { id: 'phone', text: 'Hotline', value: '0328430561', type: 'phone' },
    { id: 'zalo', text: 'Zalo', value: '0328430561', type: 'zalo' },
    { id: 'email', text: 'Email', value: 'support@bachhoaxanh.com', type: 'email' },
];

// Custom hook for counting animation

// Sub-component for rendering individual statistic with animation
const StatisticCard: React.FC<{ stat: StatisticItem; isVisible: boolean }> = ({ stat, isVisible }) => {
    const count = useCountUp(stat.value, 2000, isVisible); // 2-second animation
    return (
        <div className="flex flex-col items-center justify-center p-2">
            <h4 className="text-xl font-semibold tracking-tight text-blue-700 transition-colors duration-300 md:text-2xl">{count.toLocaleString()}</h4>
            <p className="text-base font-medium leading-normal text-gray-600 md:text-lg">{stat.name}</p>
        </div>
    );
};

// Sub-component for rendering individual contact
const ContactCard: React.FC<{ contact: ContactItem }> = ({ contact }) => {
    const href = contact.type === 'phone' ? `tel:${contact.value}` : contact.type === 'zalo' ? `https://zalo.me/${contact.value}` : `mailto:${contact.value}`;
    return (
        <div className="flex flex-col items-center justify-center p-2">
            <span className="text-base font-semibold leading-tight text-orange-500 md:text-lg">{contact.text}</span>
            <a
                href={href}
                className="text-lg font-medium leading-normal text-blue-800 hover:underline md:text-xl"
                aria-label={`${contact.text}: ${contact.value}`}>
                {contact.value}
            </a>
        </div>
    );
};

const Footer: React.FC<FooterProps> = ({ contacts = DEFAULT_CONTACTS }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [statistics, setStatistics] = useState<StatisticItem[]>([]);
    const statsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Fetch product stats from API
        const fetchStats = async () => {
            const result = await apiGetProductStats();
            if (result.success) {
                setStatistics([
                    { id: 'sold', value: result.data.sold, name: 'Sản phẩm đã bán' },
                    { id: 'customers', value: result.data.customers, name: 'Khách hàng' },
                    { id: 'products', value: result.data.products, name: 'Sản phẩm đa dạng' },
                    { id: 'visits', value: result.data.visits, name: 'Lượt truy cập' },
                ]);
            } else {
                console.error('Failed to fetch stats:', result.message);
            }
        };

        fetchStats();

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Run animation only once
                }
            },
            { threshold: 0.3 }, // Trigger when 30% of the section is visible
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <footer className=" mt-4 h-full w-full border-t-4 border-dashed border-blue-100 bg-white  p-4 shadow-lg" aria-labelledby="footer-title">
            {/* Header Image */}
            <div className="mx-auto h-full w-full max-w-[1200px]  ">
                <img src="https://phongtro123.com/images/support-bg.jpg" alt="Hỗ trợ khách hàng" className="h-48 w-full rounded-md object-contain" />

                {/* Title and Description */}
                <h3 id="footer-title" className="mt-6 text-center text-2xl font-bold  text-gray-900 ">
                    Về cửa hàng của chúng tôi
                </h3>
                <p className="mx-auto mt-2 max-w-3xl text-center text-base font-normal leading-relaxed text-gray-600 md:text-lg">
                    Chào mừng bạn đến với cửa hàng của chúng tôi! Chúng tôi cung cấp các sản phẩm chất lượng cao và dịch vụ tận tâm, mang đến trải nghiệm mua
                    sắm tuyệt vời nhất cho bạn.
                </p>

                {/* Statistics */}
                <div ref={statsRef} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {statistics.map((stat) => (
                        <StatisticCard key={stat.id} stat={stat} isVisible={isVisible} />
                    ))}
                </div>

                {/* Contact Information */}
                <div className="mt-8">
                    <h4 className="mb-4 text-center text-xl font-semibold tracking-tight text-gray-900">Liên hệ với chúng tôi</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {contacts.map((contact) => (
                            <ContactCard key={contact.id} contact={contact} />
                        ))}
                    </div>
                </div>
                {/* Copyright */}
                <p className="mt-6 text-center text-sm leading-relaxed text-gray-500">
                    © {new Date().getFullYear()} Cửa hàng của chúng tôi. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
