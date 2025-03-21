import { useEffect } from "react";
import useAdminStore from "../store/adminStore";
import { apiGetDetailAdmin } from "../services/admin.service";
 
const useFetchDetailAdmin = () => {
    const {setAdmin}= useAdminStore()
    useEffect(() => {
        const accessToken=localStorage.getItem('ad_token');
        if(!accessToken)return;
        const fetchApiDetailUser = async () => {
            const res = await apiGetDetailAdmin(); 
            if (res.success) { 
                setAdmin(res.data);
            }
        };
        fetchApiDetailUser()
    }, [setAdmin]);
};

export default useFetchDetailAdmin;
