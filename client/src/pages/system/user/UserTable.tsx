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
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left">Tên người dùng</th>
                        <th className="px-4 py-2 text-left">Email</th>
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
    );
};

export default UserTable;
