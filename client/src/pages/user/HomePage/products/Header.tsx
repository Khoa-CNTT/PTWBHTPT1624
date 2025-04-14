import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Skeleton } from '@mui/material';
import { SEARCH_UTILITY } from '../../../../utils/const';

interface PropsInterface {
    setOptionTab: React.Dispatch<React.SetStateAction<number>>;
    optionTab: number;
    isLoading: boolean;
}

const Header: React.FC<PropsInterface> = ({ setOptionTab, optionTab, isLoading = false }) => {
    // Tạo mảng Skeleton placeholder, giữ số lượng tương ứng với slidesPerView
    const skeletonSlides = Array.from({ length: 4 }); // Giả sử hiển thị 6 slides

    return (
        <div className="flex flex-col sticky top-0 right-0 gap-1 w-full h-full mt-[-15px] z-10 bg-background_primary pt-4 pb-1">
            {!isLoading ? (
                <div className="px-4 py-2 rounded-sm text-xl font-normal bg-white">Gợi ý hôm nay</div>
            ) : (
                <Skeleton variant="text" width={'200px'} height={'60px'} />
            )}
            <div className="w-full">
                <Swiper
                    allowTouchMove={false}
                    mousewheel={true}
                    loop={false} // Tắt loop để tránh căn giữa
                    spaceBetween={10}
                    slidesPerView="auto" // Sử dụng "auto" để căn trái
                    breakpoints={{
                        1: {
                            slidesPerView: 2,
                            slidesPerGroup: 1,
                            allowTouchMove: true,
                        },
                        740: {
                            slidesPerView: 6,
                            slidesPerGroup: 2,
                        },
                        1024: {
                            slidesPerView: 10,
                            slidesPerGroup: 3,
                        },
                    }}
                    className="flex justify-end" // Đảm bảo Swiper căn trái
                >
                    {isLoading
                        ? skeletonSlides.map((_, index) => (
                              <SwiperSlide key={`skeleton-${index}`} className="w-auto">
                                  <div className="flex flex-col gap-1 p-1 bg-white  ">
                                      <Skeleton variant="rounded" className="w-[100px]  " />
                                      <Skeleton variant="text" className="text-sm w-[60px] h-[20px]" />
                                  </div>
                              </SwiperSlide>
                          ))
                        : SEARCH_UTILITY.map((e) => (
                              <SwiperSlide key={uuidv4()} className="w-auto">
                                  <div
                                      onClick={() => setOptionTab(e.id)}
                                      className={`flex flex-col gap-1 p-1 ${
                                          optionTab === e.id ? 'bg-bgSecondary border-primary' : 'bg-white'
                                      } rounded-[4px] justify-center items-center cursor-pointer border-[1px] border-transparent border-solid hover:border-primary`}>
                                      <img className="w-[50px]" src={e.image} alt={e.title} />
                                      <span className="text-sm text-primary truncate-trailing line-clamp-1">{e.title}</span>
                                  </div>
                              </SwiperSlide>
                          ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Header;
