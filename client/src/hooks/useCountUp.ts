import { useEffect, useState } from 'react';

// Hàm hook tùy chỉnh để tạo hiệu ứng đếm số tăng dần
const useCountUp = (end: number, duration: number, start: boolean) => {
    // Khởi tạo state `count` với giá trị ban đầu là 0, dùng để lưu giá trị số hiện tại trong quá trình đếm
    const [count, setCount] = useState(0);

    // Sử dụng useEffect để chạy logic animation khi `start`, `end`, hoặc `duration` thay đổi
    useEffect(() => {
        // Nếu `start` là false, không chạy animation (để kiểm soát khi nào bắt đầu đếm)
        if (!start) return;

        // Biến `startTime` lưu thời điểm bắt đầu animation, khởi tạo là null
        let startTime: number | null = null;

        // Hàm `step` được gọi bởi requestAnimationFrame để cập nhật giá trị đếm mỗi khung hình
        const step = (timestamp: number) => {
            // Nếu `startTime` là null, gán nó bằng timestamp hiện tại (thời điểm bắt đầu)
            if (!startTime) startTime = timestamp;

            // Tính tỷ lệ tiến độ animation (progress) từ 0 đến 1
            // `timestamp - startTime` là thời gian đã trôi qua, chia cho `duration` để được tỷ lệ
            // `Math.min` đảm bảo progress không vượt quá 1 (100%)
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Áp dụng hàm easing (sin) để tạo hiệu ứng mượt mà (bắt đầu chậm, tăng tốc, rồi chậm lại)
            // Công thức: sin(progress * π/2) tạo ra đường cong từ 0 đến 1
            const easedProgress = Math.sin((progress * Math.PI) / 2); // Hiệu ứng ease-in-out

            // Cập nhật state `count` với giá trị hiện tại
            // `easedProgress * end` tính giá trị số tại thời điểm hiện tại
            // `Math.floor` đảm bảo số là số nguyên (không có thập phân)
            setCount(Math.floor(easedProgress * end));
            // Nếu animation chưa hoàn thành (progress < 1), tiếp tục gọi requestAnimationFrame
            // Điều này tạo ra vòng lặp animation mượt mà, chạy khoảng 60 khung hình/giây
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        // Bắt đầu animation bằng cách gọi requestAnimationFrame với hàm `step`
        // requestAnimationFrame đảm bảo animation đồng bộ với khung hình của trình duyệt
        requestAnimationFrame(step);
    }, [start, end, duration]); // Phụ thuộc vào start, end, duration để chạy lại effect khi cần

    // Trả về giá trị `count` hiện tại để component sử dụng (hiển thị số đang đếm)
    return count;
};

export default useCountUp;
