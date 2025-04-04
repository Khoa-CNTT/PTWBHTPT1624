/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IDashboard } from '../../../interfaces/dashboard.interfaces';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface DashboardTableProps {
    data: IDashboard[];
    onEdit: (item: IDashboard) => void;
    onDelete: (id: string) => void;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ data, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                                Tiêu đề
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                                Mô tả
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {data.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3">{item.title}</TableCell>
                                <TableCell className="px-5 py-3">{item.description}</TableCell>
                                <TableCell className="px-5 py-3 flex gap-3 justify-center">
                                    <button 
                                        onClick={() => onEdit(item)} 
                                        className="text-blue-500 hover:text-blue-700 transition"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(item._id)} 
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
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

export default DashboardTable;
