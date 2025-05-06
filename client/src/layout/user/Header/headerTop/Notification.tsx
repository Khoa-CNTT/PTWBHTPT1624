/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { apiGetUserNotifications, apiMarkNotificationAsRead } from '../../../../services/notification.service';
import useAuthStore from '../../../../store/authStore';
import { INotification } from '../../../../interfaces/notification.interfaces';
import NotExit from '../../../../components/common/NotExit';
import { Link } from 'react-router';
import useSocketStore from '../../../../store/socketStore';
import { notificationAudio } from '../../../../assets';
// import {
//     setNotifications,
//     setUnreadNotifications,
//     setUnreadNotificationsEmpty,
// } from '../../../redux/features/action/actionSlice';
// import { apiGetNotification, apiIsWatched } from '../../../services/apiNotification';
// import NotExit from '../../common/NotExit';

const Notification: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadNotification, setUnreadNotification] = useState<number>(0);
    // const dispatch = useAppDispatch();

    // const { notifications, unreadNotification, socketRef } = useAppSelector((state) => state.action);
    // const { isUserLoggedIn } = useAppSelector((state) => state.auth);
    const { isUserLoggedIn } = useAuthStore();
    // useEffect(() => {
    //     if (!socketRef) return;
    //     socketRef?.on('getNotification', (data: any) => {
    //         if (data) {
    //             dispatch(setNotifications(data));
    //             dispatch(setUnreadNotifications());
    //         }
    //     });
    // }, [socketRef]);

    useEffect(() => {
        if (!isUserLoggedIn) return;
        const fetchApi = async () => {
            const res = await apiGetUserNotifications();
            if (!res.success) return;
            setNotifications(res?.data.notifications);
            setUnreadNotification(res?.data.unreadCount);
            // res.success && dispatch(setNotifications(res.data));
            // dispatch(setUnreadNotifications());
        };
        fetchApi();
    }, [isUserLoggedIn]);

    const handleOnclick = async () => {
        await apiMarkNotificationAsRead();
        setUnreadNotification(0);
        setNotifications((prev) => prev.map((i) => ({ ...i, notification_isWatched: true })));
        setOpen(false);
    };

    const { socket, connect, isConnected } = useSocketStore();
    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);
    useEffect(() => {
        if (!socket || !isConnected || !isUserLoggedIn) return;

        const handleSetNotification = (data: INotification) => {
            console.log('📩 New notification:', data);
            setNotifications((prev) => [data, ...prev]);
            setUnreadNotification((prev) => prev + 1);
            const audio = new Audio(notificationAudio);
            audio.play().catch((err) => {
                console.warn('🔇 Không thể phát âm thanh:', err);
            });
        };
        // Lắng nghe các sự kiện
        socket.on('getNotificationAdminToUserOnline', handleSetNotification);
        socket.on('getNotificationUser', handleSetNotification);
        // Dọn dẹp khi unmount hoặc dependency thay đổi
        return () => {
            socket.off('getNotificationAdminToUserOnline', handleSetNotification);
            socket.off('getNotificationUser', handleSetNotification);
        };
    }, [socket, isConnected, isUserLoggedIn]);

    return (
        <div
            className="flex relative gap-2 text-white cursor-pointer"
            onMouseEnter={() => {
                setOpen(true);
            }}
            onMouseLeave={async () => {
                setOpen(false);
                // dispatch(setUnreadNotificationsEmpty());
                // await apiIsWatched();
            }}>
            <NotificationsNoneIcon fontSize="small" />
            <span className="tablet:hidden text-sm">Thông báo</span>
            <div className="absolute text-[13px] px-[5px]  rounded-[50%] bottom-1 left-2 h-fit bg-[#A769FD]">{unreadNotification}</div>
            {open && (
                <div
                    className="absolute top-[calc(100%+3px)]  right-0 shadow-search z-[1000] rounded-md bg-white after:border-[10px]  after:border-transparent after:border-b-white 
                    after:top-[-18px]  after:right-5 after:absolute after:z-[1000]">
                    <div className=" w-full h-full overflow-hidden ">
                        <div className="flex justify-center text-secondary py-2  ">Thông báo mới nhận</div>
                        <div className="mobile:w-[300px] mobile:h-[300px] w-[400px] h-[400px] overflow-y-scroll">
                            {notifications?.length > 0 ? (
                                notifications?.map((n) => (
                                    <Link
                                        onClick={handleOnclick}
                                        to={n.notification_link}
                                        className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                                            !n.notification_isWatched ? 'bg-green-50' : 'bg-white'
                                        }`}>
                                        <div className="w-12 h-12 flex-shrink-0">
                                            <img src={n?.notification_imageUrl} alt="Notification" className="w-full h-full object-cover rounded-md" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{n?.notification_title}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs text-gray-500   line-clamp-3">{n?.notification_subtitle}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <NotExit label="không có thông báo nào" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
