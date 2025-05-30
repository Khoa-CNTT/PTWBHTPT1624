/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatDate(data: any) {
    const date = new Date(data);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}
