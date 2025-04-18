import Logo from '../../../../components/logo';
import Search from './Search';
// import Cart from '../../cart';

const HeaderBottom = () => {
    // const { mobile_ui } = useAppSelector((state) => state.action);

    return (
        <div className="flex w-full h-full items-start tablet:py-[5px] py-[10px] px-4 ">
            <Logo />
            <Search />
            {/* {!mobile_ui && <Cart />} */}
        </div>
    );
};

export default HeaderBottom;
