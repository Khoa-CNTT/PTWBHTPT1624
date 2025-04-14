const VoucherService = require('../services/voucher.service');

const VoucherController = {
    // Thêm voucher mới
    createVoucher: async (req, res) => {
        const voucher = await VoucherService.createVoucher(req.body);
        res.status(201).json({
            success: true,
            data: voucher,
            message: 'Tạo voucher mới thành công!',
        });
    },

    // Lấy danh sách tất cả voucher
    getAllVouchers: async (req, res) => {
        const vouchers = await VoucherService.getAllVouchers(req.query);
        res.status(200).json({
            success: true,
            data: vouchers,
            message: 'Lấy danh sách voucher thành công!',
        });
    },

    // Lấy chi tiết voucher theo ID
    getVoucherById: async (req, res) => {
        const voucher = await VoucherService.getVoucherById(req.params.id);
        res.status(200).json({
            success: true,
            data: voucher,
            message: 'Lấy thông tin voucher thành công!',
        });
    },

    // Cập nhật voucher theo ID
    updateVoucher: async (req, res) => {
        const updatedVoucher = await VoucherService.updateVoucher(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedVoucher,
            message: 'Cập nhật voucher thành công!',
        });
    },

    // Xóa voucher theo ID
    deleteVoucher: async (req, res) => {
        await VoucherService.deleteVoucher(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa voucher thành công!',
        });
    },

    // Tìm voucher theo tên
    searchVoucherByName: async (req, res) => {
        const vouchers = await VoucherService.searchVoucherByName(req.query.name);
        res.status(200).json({
            success: true,
            data: vouchers,
            message: 'Tìm kiếm voucher theo tên thành công!',
        });
    },

    // Áp dụng voucher
    applyVoucher: async (req, res) => {
        const { code, orderValue } = req.body;
        // Gọi dịch vụ để áp dụng voucher
            const result = await VoucherService.applyVoucher({ code, orderValue });
            // Trả về kết quả khi áp dụng voucher thành công
            return res.status(200).json({
                success: true,
                message: 'Áp dụng mã thành công',
                data: result,
            });
    }
};

module.exports = VoucherController;
