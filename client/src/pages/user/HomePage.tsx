import React from 'react'
import { setOpenFeatureAuth } from '../../redux/features/action/actionSlice';
import { useAppDispatch } from '../../redux/hooks';

export const HomePage:React.FC = () => {
      const dispatch = useAppDispatch();
  return (
    <div> 
        <button className='bg-blue-400' onClick={()=>{
           dispatch(setOpenFeatureAuth(true));
        }}>Đăng nhập</button>
    </div>
  )
}
