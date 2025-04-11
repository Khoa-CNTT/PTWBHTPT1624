import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../../interfaces/category.interfaces';

// eslint-disable-next-line react-refresh/only-export-components
const CategoryItem: React.FC<{ props: ICategory }> = ({ props }) => {
    const { category_name, category_code, category_thumb, category_slug } = props;
    return (
        <Link
            to={`/danh-muc/${category_slug}/${category_code}`}
            className="flex flex-col gap-2 w-full h-full  px-3  items-center cursor-pointer hover:translate-y-[-4px] duration-500">
            <div className="w-2/3">
                <img className="w-full h-full  px-3 rounded-lg object-fill" src={category_thumb} />
            </div>
            <p className="text-xs px-2 text-center truncate-trailing line-clamp-2 ">{category_name}</p>
        </Link>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(CategoryItem);
