import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import { IBanner } from "../../../interfaces/banner.interfaces";
import { formatDate } from "../../../utils/format/formatDate";

interface BannerListProps {
  banners: IBanner[];
  onEdit: (banner: IBanner) => void;
  onDelete: (id: any) => void;
}

const BannerTable: React.FC<BannerListProps> = ({ banners, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tiêu đề
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Hình ảnh
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Mô tả
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Liên kết
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Ngày bắt đầu
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Ngày kết thúc
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {banners?.map((c) => (
              <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {c.banner_title}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3">
                  <div className="w-[200px] h-[100px] overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <img
                      src={c.banner_imageUrl}
                      alt={c.banner_imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  <span className="truncate-trailing line-clamp-1 w-[100px] font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {c.banner_description}
                  </span>
                </TableCell>
                <TableCell className="px-5 text-gray-700 text-center dark:text-gray-300">
                  <a
                    href={c.banner_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[100px] underline truncate-trailing line-clamp-1 font-medium text-blue-500 text-theme-sm"
                  >
                    {c.banner_link}
                  </a>
                </TableCell>
                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                  <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {formatDate(c.banner_startDate)}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                  <span className="truncate-trailing line-clamp-1 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {formatDate(c.banner_endDate)}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3 text-center flex gap-3 justify-center">
                  <button onClick={() => onEdit(c)} className="text-blue-500 hover:text-blue-700 transition">
                    <EditIcon />
                  </button>
                  <button onClick={() => onDelete(c?._id)} className="text-red-500 hover:text-red-700 transition">
                    <DeleteIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BannerTable;
