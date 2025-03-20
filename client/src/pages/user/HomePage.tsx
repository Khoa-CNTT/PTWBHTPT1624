import React from 'react'
import { setOpenFeatureAuth } from '../../redux/features/action/actionSlice';
import { useAppDispatch } from '../../redux/hooks';

export const HomePage:React.FC = () => {
      const dispatch = useAppDispatch();
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'> 
        <button className='bg-blue-400' onClick={()=>{
           dispatch(setOpenFeatureAuth(true));
        }}>Đăng nhập</button>
        
        <div>
          
        Click vào đăng nhập tài khoản admin
        <p> admin2@gmail.com
        </p>
        <p>pass: 123</p>
        </div>
    </div>
  )
}
