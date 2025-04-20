import { IUserProfile } from '../../../interfaces/user.interfaces';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { noUser } from '../../../assets';

interface UserTableProps {
    users: IUserProfile[];
    onEdit: (user: IUserProfile) => void;
    onBlock: (id: string, isBlocked: boolean) => void;
    onDelete: (id: string) => void; // Add onDelete function
}

const UserTable = ({ users, onEdit, onBlock, onDelete }: UserTableProps) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Tên người dùng</th>
                            <th className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Email</th>
                            <th className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Ảnh đại diện</th>
                            <th className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Số điện thoại</th>
                            <th className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Trạng thái</th>
                            <th className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="text-center px-4 py-2">{user.user_name}</td>
                                <td className="text-center px-4 py-2">{user.user_email}</td>
                                <td className="text-center px-4 py-2">
                                    <div className="w-12  overflow-hidden flex items-center justify-center">
                                        <img src={user?.user_avatar_url || noUser} alt={user.user_name} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                </td>
                                <td className="text-center px-4 py-2">{user.user_mobile || 'Chưa cập nhật'}</td>
                                <td className="text-center px-4 py-2">
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
                                        />
                                    </FormControl>
                                </td>
                                <td className="px-4 py-2">
                                    <button onClick={() => onEdit(user)} className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm">
                                        <EditIcon />
                                    </button>
                                    {/* Delete button */}
                                    <button onClick={() => onDelete(user._id)} className="text-red-500 hover:text-red-700 px-2 py-1 text-sm">
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
