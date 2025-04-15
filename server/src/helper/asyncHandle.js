/**
 * asyncHandle - Một hàm bọc (wrapper) cho các hàm async (promise)
 * trong Express, giúp tự động bắt lỗi bằng .catch(next)
 */
const asyncHandle = (fn) => {
    return (req, res, next) => {
        console.log('Checking fn:', fn);  // Log để kiểm tra giá trị của fn
        if (typeof fn !== 'function') {
            console.error('fn is not a function');
            return next(new Error('fn is not a function'));
        }
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandle;
