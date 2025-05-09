import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link, useParams } from 'react-router-dom';
import { useCategoriesStore } from '../../store/categoryStore';

const ListCategory: React.FC = () => {
    const { categories } = useCategoriesStore();
    const params = useParams();
    const [showAll, setShowAll] = useState(false);

    const visibleCategories = showAll ? categories : categories?.slice(0, 5);

    return (
        <div className="flex flex-col gap-3 border-b-[1px] border-solid border-b-slate-200 py-6">
            <h3 className="text-sm font-medium">Danh mục</h3>
            <ul className="flex flex-col gap-2">
                {visibleCategories?.map((c) => (
                    <Link
                        to={`/danh-muc/${c?.category_slug}/${c?.category_code}`}
                        key={uuidv4()}
                        className={`text-sm text-zinc-600 cursor-pointer hover:opacity-70 ${c?.category_code === params.category_code ? 'text-primary' : ''}`}>
                        {c.category_name}
                    </Link>
                ))}
            </ul>
            {categories && categories.length > 5 && (
                <button onClick={() => setShowAll((prev) => !prev)} className="text-primary m-auto text-[14px] hover:underline self-start">
                    {showAll ? 'Thu gọn' : 'Xem thêm'}
                </button>
            )}
        </div>
    );
};

export default ListCategory;
