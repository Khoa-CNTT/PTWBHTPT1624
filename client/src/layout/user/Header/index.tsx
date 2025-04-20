/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from 'react';
import { useEffect } from 'react';

// import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { getCategories } from '../../services/apiCategory';
// import { setCategories } from '../../redux/features/category/categorySlice';

// import { setUserOnline } from '../../redux/features/auth/authSlice';
import HeaderTop from './headerTop';
import HeaderBottom from './headerBottom';
import { apiGetAllCategories } from '../../../services/category.service';
import { useCategoriesStore } from '../../../store/categoryStore';
import { apiGetAllBrands } from '../../../services/brand.service';
import { useBrandsStore } from '../../../store/brandStore';
// eslint-disable-next-line react-refresh/only-export-components
const Header: React.FC = () => {
    // const currenUser = useAppSelector((state) => state.user);
    // const { socketRef } = useAppSelector((state) => state.action);
    // useEffect(() => {
    //     if (socketRef) {
    //         socketRef.emit('addUser', currenUser._id);
    //         socketRef.on('getUser', (e) => {
    //             dispatch(setUserOnline(e));
    //         });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [socketRef, currenUser]);
    const { setCategories } = useCategoriesStore();
    const { setBrands } = useBrandsStore();
    useEffect(() => {
        const fetchCategory = async () => {
            const resCategory = await apiGetAllCategories();
            const resBrand = await apiGetAllBrands();
            const dataCategory = resCategory?.data;
            const dataBrand = resBrand?.data;
            if (resCategory.success && dataCategory.length > 0) setCategories(dataCategory);
            if (resBrand.success && dataBrand.length > 0) setBrands(dataBrand);
        };
        fetchCategory();
    }, []);
    return (
        <header className="h-auto w-full px-2 tablet:bg-transparent tablet:bg-[url(https://salt.tikicdn.com/ts/banner/0f/65/5a/cc78315d8fe4d78ac876e8f9005a5cbb.png)] tablet:pb-2 background_header_mobile  ">
            <div className="w-full h-full flex flex-col   max-w-[1280px] m-auto  ">
                <HeaderTop />
                <HeaderBottom />
            </div>
        </header>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(Header);
