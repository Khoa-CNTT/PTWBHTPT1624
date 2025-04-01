 
import { ICategory } from "../../../interfaces/category.interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableRow ,Table, TableBody, TableCell, TableHeader} from "../../../components/ui/table";

interface CategoryListProps {
  categories: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (id: string) => void;
}

const CategoryTable: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Code
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium  text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tên danh mục
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Hình ảnh
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {categories.map((c) => (
                <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">{c.category_code}</TableCell>
                  <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    <span className=" truncate-trailing line-clamp-1 w-[200px] font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {c.category_name}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="w-12 h-12 m-auto overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <img src={c.category_thumb} alt={c.category_name} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-center flex gap-3 justify-center">
                    <button onClick={() => onEdit(c)} className="text-blue-500 hover:text-blue-700 transition">
                      <EditIcon />
                    </button>
                    <button onClick={() => onDelete(c._id)} className="text-red-500 hover:text-red-700 transition">
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

export default CategoryTable;
