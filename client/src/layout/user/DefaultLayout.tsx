import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';
import { Auth } from '../../feature';
import useFetchUser from '../../hooks/useFetchUser';
import Loading from '../../components/common/Loading';
import Chat from '../../components/chat';
import ChatBoxAI from '../../components/chatBoxAI';
// import { Auth } from '../feature';
// import { apiGetDetailUser } from '../services/apiUser';
// import { setIsLoginSuccess } from '../redux/features/auth/authSlice';
// import { setDetailUser } from '../redux/features/user/userSlice';
// import { Footer, Header, Loading } from '../component';
// import { useLocation } from 'react-router-dom';
// import { path } from '../utils/const';
// import { BottomNavigate } from '../component/mobile/BottomNavigate';
// import Chat from '../component/chat';
const DefaultLayout = () => {
    useFetchUser();
    const toastContainer = (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );

    // const { mobile_ui } = useAppSelector((state) => state.action);
    return (
        <>
            <div className="flex flex-col h-full mx-auto  bg-background_primary">
                <Header />
                <main className="flex flex-col tablet:pb-20 tablet:bg-white  bg-background_primary  h-full w-full max-w-[1200px] tablet:px-0  mx-auto  ">
                    <Outlet />
                </main>
                <Footer />

                <Auth />
                <Loading />
                <div className="fixed bottom-4 right-5 bg-blue-600 rounded-lg shadow-lg p-2 flex flex-col items-center justify-center space-y-2  z-[999] ">
                    <ChatBoxAI />
                    <Chat />
                </div>
                {/* <PhoneAuth /> */}
                {/* {!mobile_ui ||!location.pathname.includes(path.PAGE_PAYPAL) &&<Footer />}
             
                <BottomNavigate /> */}
            </div>
            {toastContainer}
        </>
    );
};

export default DefaultLayout;
