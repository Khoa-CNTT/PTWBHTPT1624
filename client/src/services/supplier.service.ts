import { adminClient } from '../config/httpRequest';

// API thêm nhà cung cấp mới (Admin Only)
const apiCreateSupplier = async (supplierData: object) => {
    try {
        const res = await adminClient.post('/v1/api/supplier/add', supplierData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy tất cả nhà cung cấp
const apiGetAllSuppliers = async (queries?: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get('/v1/api/supplier/all', {
            params: queries,
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy thông tin chi tiết nhà cung cấp theo ID
const apiGetSupplierById = async (id: string) => {
    try {
        const res = await adminClient.get(`/v1/api/supplier/${id}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin nhà cung cấp theo ID (Admin Only)
const apiUpdateSupplier = async (id: string, supplierData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/supplier/${id}`, supplierData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa nhà cung cấp theo ID (Admin Only)
const apiDeleteSupplier = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/supplier/${id}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API tìm kiếm nhà cung cấp theo tên (không phân biệt dấu)
const apiSearchSupplier = async (name: string) => {
    try {
        const res = await adminClient.get('/v1/api/supplier/search', {
            params: { name }, // Truyền tên nhà cung cấp cần tìm
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export { apiSearchSupplier,apiCreateSupplier, apiGetAllSuppliers, apiGetSupplierById, apiUpdateSupplier, apiDeleteSupplier };
