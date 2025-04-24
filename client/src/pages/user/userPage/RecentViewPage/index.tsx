import React from 'react';
import ProductItem from '../../../../components/item/ProductItem';
import { NotFound } from '../../../../components';
import useRecentViewStore from '../../../../store/recentViewStore';

const RecentViewPage: React.FC = () => {
    const { recentViewedProducts } = useRecentViewStore();
    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll">
            <div className="w-full mb-4">
                <h1 className="text-xl">Sản phẩm đã xem</h1>
                <div className="flex flex-col bg-white pb-8 gap-10 z-0">
                    {recentViewedProducts?.length !== 0 ? (
                        <>
                            <div className="grid mobile:grid-cols-2  tablet:grid-cols-4  laptop:grid-cols-6 ">
                                {recentViewedProducts?.map((p) => (
                                    <ProductItem key={p._id} props={p} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="px-4 pt-6">
                            <NotFound>Không tìm thấy sản phẩm đã xem gần đây</NotFound>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentViewPage;
