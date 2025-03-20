import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { apiGetDetailUser } from '../services/apiUser';
import { setIsLoginSuccess } from '../redux/features/auth/authSlice';
import { setDetailUser } from '../redux/features/user/userSlice';
 

const useFetchDetailUser = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const accessToken=localStorage.getItem('access_token');
        if(!accessToken)return;
        const fetchApiDetailUser = async () => {
            const res = await apiGetDetailUser();
            console.log(res)
            if (res.success) {
                dispatch(setIsLoginSuccess(true));
                dispatch(setDetailUser(res.data));
            }
        };
        fetchApiDetailUser()
    }, [dispatch]);
};

export default useFetchDetailUser;
