import React from 'react';
import { Overlay } from '..';
import ReactLoading from 'react-loading';
import { useActionStore } from '../../store/actionStore';
const Loading: React.FC = () => {
    const { isLoading } = useActionStore();
    return (
        <>
            {isLoading && (
                <Overlay className="z-[1000]">
                    <ReactLoading type="cylon" color="rgb(0,247,0)" />
                </Overlay>
            )}
        </>
    );
};

export default Loading;
