import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface DateProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | any;  // Nhận giá trị ISO 8601
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (date: string | any, type: string) => void;
  label: string;
  type: string;
}

const DateComponent: React.FC<DateProps> = ({ value, onChange, label, type }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value).isValid() ? dayjs(value) : null : null} // Chuyển đổi chỉ khi giá trị hợp lệ
        onChange={(date: Dayjs | null) => onChange(date ? date.toISOString() : null, type)} // Chuyển đổi lại thành ISO 8601
        slotProps={{ textField: { fullWidth: true } }}
      />
    </LocalizationProvider>
  );
};

export default DateComponent;
