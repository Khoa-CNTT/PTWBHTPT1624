import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../../../assets';

const Header: React.FC = () => {
    return (
        <div className="flex items-center gap-3 h-[100px] bg-white px-6">
            <Link to={'/'}>
                <img src={logo} className="w-[150px]" />
            </Link>
            <h1 className="text-2xl px-4 border-l-[1px] border-solid border-primary text-primary">Thanh Toán</h1>
        </div>
    );
};

export default Header;
