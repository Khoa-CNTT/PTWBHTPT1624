import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useCategoriesStore } from '../../../../store/category';

const ListCategories: React.FC = () => {
    // const { categories } = useAppSelector((state) => state.category);
    const { categories } = useCategoriesStore();
    return (
        <div className="flex item-center gap-4 tablet:hidden">
            {categories?.map(
                (c, i) =>
                    i < 5 && (
                        <Link to={`/danh-muc/${c?.category_slug}/${c?.category_code}`} key={uuidv4()} className="text-[13px] text-white cursor-pointer">
                            {c.category_name}
                        </Link>
                    ),
            )}
        </div>
    );
};

export default ListCategories;
