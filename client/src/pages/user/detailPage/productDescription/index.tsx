import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import parse from 'html-react-parser';
import { IProductDetail } from '../../../../interfaces/product.interfaces';
const ProductDescription: React.FC<{ productDetail: IProductDetail }> = ({ productDetail }) => {
    const { product_description, product_attribute } = productDetail;
    return (
        <div>
            {product_attribute && (
                <div className="my-5 bg-white rounded-sm  px-6 py-4">
                    <h1 className="text-xl font-semibold">Thông tin chi tiết</h1>
                    <table className="w-full my-3 rounded-sm">
                        {product_attribute?.map((e, index) => (
                            <tbody key={uuidv4()} className="h-[40px] bg-primary-bg">
                                <td className="text-sm tablet:w-5/12  laptop:w-2/12 px-2 bg-[rgb(239,239,239)] ">{e.name}</td>
                                <td className={`text-sm tablet:w-7/12 laptop:w-10/12 px-3 shrink-0 ${index % 2 == 0 ? 'bg-slate-50' : ''}`}>{e.value}</td>
                            </tbody>
                        ))}
                    </table>
                </div>
            )}
            <div className="my-5 bg-white rounded-sm px-6 py-4">
                <h1 className="text-xl  font-medium">Mô tả sản phẩm</h1>
                <ul className="flex flex-col gap-1  mt-3">
                    {!product_description?.includes('<')
                        ? product_description.split(', ')?.map((item) =>
                              item === item.toUpperCase() ? (
                                  <h2 key={uuidv4()} className="text-base font-semibold mt-1">
                                      {item}
                                  </h2>
                              ) : (
                                  <li key={uuidv4()} className="text-sm">
                                      {item}
                                  </li>
                              ),
                          )
                        : parse(product_description)}
                </ul>
            </div>
        </div>
    );
};

export default ProductDescription;
