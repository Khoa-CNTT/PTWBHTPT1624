import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import useFetchDetailUser from '../../hooks/useFetchDetailUser';
import Header from './Header';
import Footer from './Footer/index';
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
    useFetchDetailUser();

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
    // const location = useLocation();
    // const { mobile_ui } = useAppSelector((state) => state.action);
    return (
        <>
            <div className="flex flex-col w-screen h-full mx-auto  bg-background_primary">
                {/* {!location.pathname.includes(path.PAGE_PAYMENT) && <Header />} */}
                <Header />
                <main className="flex flex-col tablet:pb-20 tablet:bg-white  bg-background_primary  h-full w-full max-w-[1280px] tablet:px-0 px-5  mx-auto  ">
                    <Outlet />
                </main>
                <Footer />
                {/* <Auth /> */}
                {/* {!mobile_ui ||!location.pathname.includes(path.PAGE_PAYPAL) &&<Footer />}
                <Auth />
                <Loading />
                <Chat />
                <BottomNavigate /> */}
            </div>
            {toastContainer}
        </>
    );
};

export default DefaultLayout;
