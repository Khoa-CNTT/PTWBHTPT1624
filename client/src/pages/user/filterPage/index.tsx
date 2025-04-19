import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../../../components/seo';
import Breadcrumbs from './breadcrumbs';
import FilterPanel from './filterPanel';
import FilterResults from './filterResults';
import { useCategoriesStore } from '../../../store/category';
import { useBrandsStore } from '../../../store/brand';
// Memoize to prevent unnecessary re-renders
const FilterPage: React.FC = memo(() => {
    const { category_code, brand_slug } = useParams();
    const { categories } = useCategoriesStore();
    const { brands } = useBrandsStore();

    // Compute title using useMemo to avoid recalculations
    const title = React.useMemo(() => {
        const category = categories.find((c) => c.category_code === category_code);
        const brand = brands.find((b) => b.brand_slug === brand_slug);
        return category?.category_name ?? brand?.brand_name ?? '';
    }, [categories, brands, category_code, brand_slug]);

    return (
        <>
            <Seo description={title} title={title} />
            <Breadcrumbs title={title} />
            <div className="flex gap-4">
                <FilterPanel />
                <FilterResults title={title} />
            </div>
        </>
    );
});

export default FilterPage;
