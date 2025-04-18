import React from 'react';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ListCategory from '../../../../components/listCategory';
import SearchByRating from '../../../../components/searchBy/SearchByRating';
import SearchByPrice from '../../../../components/searchBy/SearchByPrice';
import SearchByBrand from '../../../../components/searchBy/SearchByBrand';

const FilterPanel: React.FC = () => {
    return (
        <div className="tablet:hidden w-2/12 pr-2 bg-white mt-1">
            <div className="w-full h-full  py-2 pl-4 ">
                <div className="flex items-center gap-1">
                    <FilterAltOutlinedIcon fontSize="small" />
                    <h1 className="uppercase font-medium text-base"> Bộ lọc tìm kiếm</h1>
                </div>
                <ListCategory />
                <SearchByRating />
                <SearchByPrice />
                <SearchByBrand />
            </div>
        </div>
    );
};

export default FilterPanel;
