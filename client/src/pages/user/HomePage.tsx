import React from 'react'
import { Link } from 'react-router'
import { PATH } from '../../utils/const'

 const HomePage:React.FC = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'> 
      <Link to={PATH.ADMIN_LOGIN} >Đăng nhập</Link>
      admin@gmail.com  -- 
      123456
    </div>
  )
}
export default HomePage