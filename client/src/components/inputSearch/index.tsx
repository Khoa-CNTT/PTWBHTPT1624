import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

type InputSearchProps = {
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearch: () => void;
};

const InputSearch: React.FC<InputSearchProps> = ({ searchQuery, handleSearchChange, handleSearch }) => {
    return (
        <div className="relative w-1/3">
            <input
                type="text"
                placeholder="Tìm kiếm ..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-4 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
            <button onClick={handleSearch} className="absolute top-0 right-0 px-3 py-2 bg-primary text-white rounded-r-lg">
                <SearchIcon />
            </button>
        </div>
    );
};

export default InputSearch;
