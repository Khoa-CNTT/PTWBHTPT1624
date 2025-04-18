import { IUserProfile } from "../../../interfaces/user.interfaces";
import EditIcon from '@mui/icons-material/Edit';
import { FormControl, FormControlLabel, Checkbox, Typography } from '@mui/material';

interface UserTableProps {
    users: IUserProfile[];
    onEdit: (user: IUserProfile) => void;
    onBlock: (id: string, isBlocked: boolean) => void;
}

const UserTable = ({ users, onEdit, onBlock }: UserTableProps) => {
    return (
        <div className="overflow-hidden rounded-xl my-4 border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Tên người dùng</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Ảnh đại diện</th>
                            <th className="px-4 py-2 text-left">Số điện thoại</th>
                            <th className="px-4 py-2 text-left">Trạng thái</th>
                            <th className="px-4 py-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-4 py-2">{user.user_name}</td>
                                <td className="px-4 py-2">{user.user_email}</td>
                                <td className="px-4 py-2">
                                    <div className="w-[100px] overflow-hidden flex items-center justify-center">
                                        {user.user_avatar_url ? (
                                            <img
                                                src={user.user_avatar_url}
                                                alt={user.user_name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-white rounded-md">
                                                N/A
                                            </div>
                                        )}
                                    </div>
                                </td>
                                
                                <td className="px-4 py-2">{user.user_mobile}</td>
                                <td className="px-4 py-2">
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
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm"
                                    >
                                        <EditIcon />
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
