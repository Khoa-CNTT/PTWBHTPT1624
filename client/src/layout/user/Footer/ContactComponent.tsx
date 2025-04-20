// import React, { memo } from "react";
// // import { textContact } from "../../utils/constant";

// const ContactComponent:React.FC = () => {
//   return (
//     <div className="bg-white   border-[7px]  border-dashed border-[#e8eefc] rounded-md shadow-md p-4 w-full flex flex-col mt-8 justify-center items-center gap-6">
//       <img
//         src={textContact.image}
//         alt="thumbnal"
//         className="w-full h-48 object-contain"
//       />
//       <p>{textContact.content}</p>
//       <div className="flex items-center justify-around w-full">
//         {textContact.contacts.map((item, index) => {
//           return (
//             <div
//               key={index}
//               className="flex flex-col items-center justify-center"
//             >
//               <span className="text-orange-500 font-semibold">{item.text}</span>
//               <span className="text-blue-900 text-[24px] font-semibold">
//                 {item.phone}
//               </span>
//               <span className="text-blue-900 text-[24px] font-semibold">
//                 {item.zalo}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//       <ButtonComponent
//         text="Gửi liên hệ"
//         className="bg-blue-60 textColor px-6"
//       />
//     </div>
//   );
// };

// export default memo(ContactComponent);
