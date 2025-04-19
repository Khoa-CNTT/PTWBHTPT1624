    /* eslint-disable react-hooks/exhaustive-deps */
    import SearchIcon from '@mui/icons-material/Search';
    import CloseIcon from '@mui/icons-material/Close';
    import { useEffect, useRef, useState } from 'react';
    import { Overlay } from '../../../../components';
    import { apiGetFeaturedProducts, getProductSuggestions } from '../../../../services/product.service';
    import useDebounce from '../../../../hooks/useDebounce';
    import { Link, useNavigate } from 'react-router';

    interface search {
        text: string;
        _id: string;
    }
    interface resultSuggest {
        _id: string;
        product_name: string;
        product_slug: string;
    }
    interface ProductSuggest extends resultSuggest {
        product_thumb: string;
    }

    const Search: React.FC = () => {
        const [searchHistories, setSearchHistories] = useState<search[]>([]);
        const [resultSuggest, setResultSuggest] = useState<resultSuggest[]>([]);
        const [productSuggest, setProductSuggest] = useState<ProductSuggest[]>([]);
        const [limitHistory, setLimitHistory] = useState<number>(4);
        const [openSearchResults, setOpenSearchResults] = useState<boolean>(false);
        const [searchValue, setSearchValue] = useState<string>('');
        const valueDebounce = useDebounce(searchValue, 200);
        const inputRef = useRef<HTMLInputElement>(null);
        const navigate = useNavigate();
        // Lấy lịch sử tìm kiếm từ localStorage khi component mount
        useEffect(() => {
            const storedHistory = localStorage.getItem('searchHistory');
            if (storedHistory) {
                setSearchHistories(JSON.parse(storedHistory));
            }
        }, []);

        // Lưu lịch sử tìm kiếm vào localStorage mỗi khi searchHistories thay đổi
        useEffect(() => {
            localStorage.setItem('searchHistory', JSON.stringify(searchHistories));
        }, [searchHistories]);

        // Xử lý khi người dùng nhập vào input
        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const title = e.target.value;
            setSearchValue(title);
            if (title.trim() !== '') {
                setOpenSearchResults(true);
            }
        };

        // Lấy gợi ý sản phẩm
        useEffect(() => {
            const fetchApi = async () => {
                const res = await getProductSuggestions(valueDebounce);
                if (res?.data?.products?.length === 0) {
                    setOpenSearchResults(false);
                }
                setResultSuggest(res?.data?.products || []);
            };
            if (valueDebounce.trim() === '') {
                setResultSuggest([]);
            } else {
                fetchApi();
            }
        }, [valueDebounce]);

        // Lấy sản phẩm nổi bật
        useEffect(() => {
            const fetchApiProductSuggest = async () => {
                const res = await apiGetFeaturedProducts({ limit: 8 });
                setProductSuggest(res?.data || []);
            };
            if (openSearchResults) {
                fetchApiProductSuggest();
                setLimitHistory(4);
            }
        }, [openSearchResults]);

        // Xử lý submit tìm kiếm
        const handleSummit = () => {
            if (searchValue.trim()) {
                const newSearch = {
                    text: searchValue,
                    _id: Date.now().toString(), // Tạo ID tạm thời
                };
                setSearchHistories((prev) => [newSearch, ...prev].slice(0, 10)); // Giới hạn 10 mục
                // Điều hướng đến trang tìm kiếm
                navigate(`/tim-kiem/${searchValue}`);
            }
            setOpenSearchResults(false);
            setSearchValue('');
        };

        // Xử lý phím Enter
        useEffect(() => {
            const handleKeyPress = (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    handleSummit();
                }
            };
            document.body.addEventListener('keydown', handleKeyPress);
            return () => document.body.removeEventListener('keydown', handleKeyPress);
        }, [searchValue]);

        // Xóa một mục lịch sử
        const handleDeleteHistory = (id: string) => {
            setSearchHistories((prev) => prev.filter((h) => h._id !== id));
        };

        // Hiển thị kết quả gợi ý
        const suggestResult =
            resultSuggest?.length > 0 &&
            resultSuggest?.map((s, i) => {
                return (
                    i < limitHistory && (
                        <Link
                            to={`/${s.product_slug}/${s._id}`}
                            onClick={() => {
                                setOpenSearchResults(false);
                                setSearchValue('');
                            }}
                            key={s._id}
                            className="flex gap-3 hover:bg-hover cursor-pointer py-2 px-5">
                            <SearchIcon style={{ color: 'rgb(128, 128, 137)' }} />
                            <span className="text-sm">{s?.product_name}</span>
                        </Link>
                    )
                );
            });

        // Hiển thị lịch sử tìm kiếm và sản phẩm nổi bật
        const searchRecent = (
            <div>
                {searchHistories?.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h1 className="text-sm font-medium px-[20px]">Tìm kiếm gần đây</h1>
                        <ul className="flex flex-col">
                            {searchHistories?.map((s, i) => {
                                return (
                                    i < limitHistory && (
                                        <Link
                                            to={`/tim-kiem/${s.text}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenSearchResults(false);
                                            }}
                                            key={s._id}
                                            className="flex gap-3 justify-between hover:bg-hover cursor-pointer py-2 px-5">
                                            <div>
                                                <SearchIcon style={{ color: 'rgb(128, 128, 137)' }} />
                                                <span className="text-sm">{s?.text}</span>
                                            </div>
                                            <div
                                                className="text-secondary w-[50px] text-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteHistory(s._id);
                                                }}>
                                                <CloseIcon fontSize="small" />
                                            </div>
                                        </Link>
                                    )
                                );
                            })}
                        </ul>
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    <h1 className="font-medium text-base px-[20px]">Sản phẩm nổi bật</h1>
                    <ul className="grid mobile:grid-cols-2 grid-cols-4 gap-1">
                        {productSuggest?.map((s) => {
                            return (
                                <Link
                                    to={`/${s.product_slug}/${s._id}`}
                                    key={s._id}
                                    onClick={() => setOpenSearchResults(false)}
                                    className="flex flex-col w-full hover:shadow-search items-center py-1 px-3 cursor-pointer gap-2">
                                    <img className="w-1/2 rounded-md" src={s?.product_thumb} alt={s?.product_name} />
                                    <span className="w-full text-xs truncate">{s?.product_name}</span>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );

        return (
            <div className="flex justify-between tablet:w-full w-8/12">
                <div className="flex flex-col gap-2 w-full">
                    <div className="bg-white flex rounded-[2px] w-full h-search z-50">
                        <div id="search" className="relative flex items-center w-full h-full tablet:p-0 pr-4">
                            <button className="laptop:hidden outline-none h-full px-2" onClick={handleSummit}>
                                <img className="w-6 h-6" src="https://salt.tikicdn.com/ts/upload/34/62/0c/6ae13efaff83c66f810c4c63942cf6c0.png" alt="Search" />
                            </button>
                            <input
                                style={{ outline: 'none' }}
                                onFocus={() => setOpenSearchResults(true)}
                                ref={inputRef}
                                onChange={handleInput}
                                value={searchValue}
                                type="text"
                                className="w-full px-3 rounded-[2px] text-[14px] text-black border-none"
                                placeholder="Tìm sản phẩm, danh mục hay thương hiệu mong muốn ..."
                            />
                            {searchValue !== '' && (
                                <span onClick={() => setSearchValue('')} className="flex items-center">
                                    <CloseIcon fontSize="small" style={{ color: 'rgb(128, 128, 137)' }} />
                                </span>
                            )}
                            {openSearchResults && (
                                <div className="absolute w-full top-[100%] right-0 bg-white shadow-search   rounded-b-md">
                                    <div className="max-h-[400px] overflow-y-auto p-4 my-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border-gray-200 rounded-md">
                                        {resultSuggest?.length > 0 ? suggestResult : searchRecent}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="tablet:hidden outline-none bg-[rgb(9,115,69)] w-[150px] h-[40px] text-white rounded-r-[2px]" onClick={handleSummit}>
                            <SearchIcon /> <span>Tìm kiếm</span>
                        </button>
                    </div>
                    {openSearchResults && <Overlay onClick={() => setOpenSearchResults(false)} className="z-20" />}
                </div>
            </div>
        );
    };

    export default Search;
