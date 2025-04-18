import React, { memo } from 'react';
import { useEffect } from 'react';

// import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { getCategories } from '../../services/apiCategory';
// import { setCategories } from '../../redux/features/category/categorySlice';

// import { setUserOnline } from '../../redux/features/auth/authSlice';
import HeaderTop from './headerTop';
import HeaderBottom from './headerBottom';
import { apiGetAllCategories } from '../../../services/category.service';
import { useCategoriesStore } from '../../../store/category';

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
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await apiGetAllCategories();
            const data = res?.data;
            if (res.success && data.length > 0) setCategories(data);
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
