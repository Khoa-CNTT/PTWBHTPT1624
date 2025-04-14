/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import { IUserProfile } from '../../../interfaces/user.interfaces';
import { userAvatar } from '../../../assets';
import { Checkbox, FormControl, FormControlLabel, Typography } from '@mui/material';

interface UserListProps {
    users: IUserProfile[];
    onBlock: (id: string, isBlocked: boolean) => void;
}

const UserTable: React.FC<UserListProps> = ({ users, onBlock }) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Tên người dùng
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Hình đại diện
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Email
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Số điện thoại
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {users?.map((user) => (
                            <TableRow key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="px-5 py-3 text-gray-700 dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-2 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {user.user_name || 'N/A'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <div className="w-12 h-12 m-auto overflow-hidden rounded-lg flex items-center justify-center">
                                        <img
                                            src={user.user_avatar_url || userAvatar}
                                            alt={`Hình đại diện của ${user.user_name || 'người dùng'}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-2 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {user.user_email || 'N/A'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-gray-700 text-center dark:text-gray-300">
                                    <span className="truncate-trailing line-clamp-2 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {user.user_mobile || 'N/A'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-3 text-center align-center flex gap-3 justify-center">
                                    <FormControl>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={user.user_isBlocked || false}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        const confirmMsg = isChecked
                                                            ? `Bạn có chắc chắn muốn **CHẶN** người dùng "${user.user_name || 'này'}"?`
                                                            : `Bạn có chắc chắn muốn **BỎ CHẶN** người dùng "${user.user_name || 'này'}"?`;

                                                        if (window.confirm(confirmMsg)) {
                                                            onBlock(user._id, isChecked);
                                                        }
                                                    }}
                                                />
                                            }
                                            label={<Typography sx={{ fontSize: '12px' }}>Chặn</Typography>}
                                            aria-label={`Chặn người dùng ${user.user_name || 'này'}`}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserTable;
