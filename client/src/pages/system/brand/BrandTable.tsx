import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IBrand } from '../../../interfaces/brand.interfaces';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';

interface BrandListProps {
    brands: IBrand[];
    onEdit: (brand: IBrand) => void;
    onDelete: (id: string) => void;
}

const BrandTable: React.FC<BrandListProps> = ({ brands, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Tên thương hiệu
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Banner
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {brands?.map((c) => (
                            <TableRow key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">{c.brand_name}</TableCell>
                                <TableCell className="px-5 py-3">
                                    <div className="w-[100px]  overflow-hidden   flex items-center justify-center">
                                        <img src={c.brand_banner} alt={c.brand_name} className="w-full h-full object-cover rounded-md" />
                                    </div>
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

export default BrandTable;
