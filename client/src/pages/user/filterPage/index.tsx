import React from 'react';
// import { useParams } from 'react-router-dom';
// import Breadcrumbs from './breadcrumbs';
import FilterPanel from './filterPanel';
// import { useCategoriesStore } from '../../../store/category';

const FilterPage: React.FC = () => {
    // const { categories } = useCategoriesStore();
    // const params = useParams();
    // const title = categories.filter((c) => c.category_code === params.cid)[0]?.category_code || params?.brand_slug;
    return (
        <>
            {/* <Seo description={title || ''} title={title || ''} key={2} /> */}
            {/* <Breadcrumbs title={title} /> */}
            <div className="flex  gap-2">
                <FilterPanel />
                {/* <FilterResults /> */}
            </div>
        </>
    );
};

export default FilterPage;
