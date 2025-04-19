import React from 'react';

import SortBar from '../../../../components/sortBar';
import RenderListProducts from './RenderListProducts';

const FilterResults: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="w-full h-full ">
            <div className="tablet:hidden flex flex-col z-1 gap-1 w-full h-full sticky top-0 right-0 bg-background_primary  pb-1  z-100">
                <div className="flex flex-col px-4 py-2  bg-white rounded-sm  mt-1 gap-3">
                    <div className="text-base font-normal">{title}</div>
                    <SortBar />
                </div>
            </div>
            <RenderListProducts />
        </div>
    );
};

export default FilterResults;
