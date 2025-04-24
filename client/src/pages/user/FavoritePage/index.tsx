import React from 'react';
import useFavoriteStore from '../../../store/favoriteStore';
import ProductItem from '../../../components/item/ProductItem';
import { NotFound } from '../../../components';

const FavoritePage: React.FC = () => {
    const { favoriteProducts } = useFavoriteStore();
    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll">
            <div className="w-full mb-4">
                <h1 className="text-xl">Sản phẩm yêu thích</h1>
                <div className="flex flex-col bg-white pb-8 gap-10 z-0">
                    {favoriteProducts?.length !== 0 ? (
                        <>
                            <div className="grid mobile:grid-cols-2  tablet:grid-cols-4  laptop:grid-cols-6 ">
                                {favoriteProducts?.map((p) => (
                                    <ProductItem key={p._id} props={p} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="px-4 pt-6">
                            <NotFound>Rất tiếc, không tìm thấy sản phẩm phù hợp với lựa chọn của bạn</NotFound>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritePage;
