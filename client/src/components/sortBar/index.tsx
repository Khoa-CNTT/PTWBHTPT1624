import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useBrandsStore } from '../../store/brand';
import { ButtonOutline } from '..';
import { formatMoney } from '../../utils/formatMoney';
import { SORT_BAR } from '../../utils/const';
import { IBrand } from '../../interfaces/brand.interfaces';
interface QueryParams {
    star?: string;
    pricefrom?: string;
    priceto?: string;
    brand?: string | string[];
    sort?: string;
}
interface SortBarItem {
    label: string;
    sortBy: { sort: string };
}
// Memoize component to prevent unnecessary re-renders
const SortBar: React.FC = memo(() => {
    const { cid } = useParams<{ cid?: string }>();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const { brands } = useBrandsStore();

    // Parse query params
    const queries = useMemo(() => queryString.parse(search) as QueryParams, [search]);
    const { star, pricefrom, priceto, brand, sort } = queries;

    // Manage sort state
    const [sortBy, setSortBy] = React.useState<string>(sort ?? '');

    // Reset sortBy when cid changes
    useEffect(() => {
        setSortBy('');
    }, [cid]);

    // Update URL when sortBy changes
    useEffect(() => {
        const updatedQueries = { ...queries, sort: sortBy || undefined };
        const newQuery = queryString.stringify(updatedQueries, { skipNull: true, skipEmptyString: true });
        navigate(`?${newQuery}`, { replace: true });
    }, [sortBy, queries, navigate]);

    // Memoized brand name lookup
    const getBrandName = useCallback((brandId: string) => brands.find((b: IBrand) => b._id === brandId)?.brand_name ?? brandId, [brands]);

    // Handle sort selection
    const handleSortClick = useCallback((sort: string) => {
        setSortBy(sort);
    }, []);

    // Clear all filters
    const handleClearFilters = useCallback(() => {
        navigate(pathname, { replace: true });
    }, [navigate, pathname]);

    // Check for active filters
    const hasFilters = !!(star || pricefrom || priceto || brand);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-100">
                <span className="text-sm font-normal shrink-0">Sắp xếp theo</span>
                <div className="flex overflow-x-auto gap-3">
                    {SORT_BAR.map((item: SortBarItem) => (
                        <button
                            key={item.sortBy.sort}
                            type="button"
                            onClick={() => handleSortClick(item.sortBy.sort)}
                            className={`text-sm shrink-0 font-normal py-2 px-4 rounded-sm cursor-pointer transition-colors ${
                                item.sortBy.sort === sortBy ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-gray-50'
                            }`}>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            {hasFilters && (
                <div className="flex flex-wrap gap-3">
                    {star && <ButtonOutline className="rounded-full text-sm py-1 px-4 font-normal bg-blue-50 hover:bg-blue-100">Từ {star} sao</ButtonOutline>}
                    {pricefrom && priceto && (
                        <ButtonOutline className="rounded-full text-sm py-1 px-4 font-normal bg-blue-50 hover:bg-blue-100">
                            Từ {formatMoney(Number(pricefrom))} đến {formatMoney(Number(priceto))}
                        </ButtonOutline>
                    )}
                    {brand && (
                        <>
                            {Array.isArray(brand) ? (
                                brand.map((b) => (
                                    <ButtonOutline key={b} className="rounded-full text-sm py-1 px-4 font-normal bg-blue-50 hover:bg-blue-100">
                                        {getBrandName(b)}
                                    </ButtonOutline>
                                ))
                            ) : (
                                <ButtonOutline className="rounded-full text-sm py-1 px-4 font-normal bg-blue-50 hover:bg-blue-100">
                                    {getBrandName(brand)}
                                </ButtonOutline>
                            )}
                        </>
                    )}
                    <ButtonOutline
                        className="rounded-full text-sm py-1 px-4 font-normal bg-transparent border-none hover:text-red-600"
                        onClick={handleClearFilters}>
                        Xóa tất cả
                    </ButtonOutline>
                </div>
            )}
        </div>
    );
});

export default SortBar;
