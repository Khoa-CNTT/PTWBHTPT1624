import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Right from './Right/Right';
import Register from './left/Register';
import { useActionStore } from '../../store/actionStore';
import { Overlay } from '../../components';
import Login from './left/Login';
import Forgot from './left/forgot';

const Auth: React.FC = () => {
    const { setOpenFeatureAuth, openFeatureAuth, setFeatureAuth, featureAuth } = useActionStore();
    const handleClose = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setOpenFeatureAuth(false);
        setFeatureAuth(0);
    };
    const handleOpen = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setOpenFeatureAuth(true);
    };
    return (
        <>
            {openFeatureAuth && (
                <Overlay className="z-[1000]" onClick={handleClose}>
                    <div onClick={handleOpen} className="relative w-[800px] h-auto ">
                        <div className="flex w-full h-full bg-white m-auto rounded-lg items-center overflow-hidden">
                            <div className="flex flex-col gap-2 mobile:w-full w-4/6 p-10 ">
                                {featureAuth == 0 ? <Register /> : featureAuth == 1 ? <Login /> : <Forgot />}
                            </div>
                            <Right />
                        </div>
                        {/* -------------- */}
                        <div
                            onClick={handleClose}
                            className="absolute right-[-13px] top-[-13px] shadow-search w-10 h-10 flex justify-center items-center rounded-full bg-primary text-white">
                            <CloseIcon fontSize="medium" />
                        </div>
                    </div>
                </Overlay>
            )}
        </>
    );
};

export default Auth;
