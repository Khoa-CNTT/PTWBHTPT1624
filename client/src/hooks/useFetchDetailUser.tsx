import { useEffect } from 'react';
import { apiGetDetailUser } from '../services/user.service';
import useUserStore from '../store/userStore';

const useFetchDetailUser = () => {
    const { setUser } = useUserStore();

    useEffect(() => {
        console.log('Sdddss');
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        const fetchApiDetailUser = async () => {
            const res = await apiGetDetailUser();
            if (res.success) {
                setUser(res.data);
            }
        };
        fetchApiDetailUser();
    }, [setUser]);
};

export default useFetchDetailUser;
