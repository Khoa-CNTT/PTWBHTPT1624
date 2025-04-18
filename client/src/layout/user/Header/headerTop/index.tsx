import React from 'react';
import Notification from './Notification';
// import User from './User';
// import Cart from '../../cart';

const HeaderTop: React.FC = () => {
    // const { mobile_ui } = useAppSelector((state) => state.action);
    return (
        <div className="flex w-full justify-end items-center py-[6px] px-6  ">
            <div className="flex items-center gap-6 ">
                <Notification />
                {/* {mobile_ui ? <Cart /> : <User />} */}
            </div>
        </div>
    );
};

export default HeaderTop;
