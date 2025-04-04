/* eslint-disable @typescript-eslint/no-explicit-any */
const validate = (valueForm: Record<string, any>, setInvalidFields: (fields: Array<{ name: string; message: string }>) => void) => {
    let isValid = true;
    const invalidFields: Array<{ name: string; message: string }> = [];
    console.log(valueForm);
    Object.entries(valueForm).forEach(([key, value]) => {
        if (value === '') {
            invalidFields.push({
                name: key,
                message: 'Bạn không được bỏ trống!',
            });
            isValid = false;
        }

        // Kiểm tra tất cả các trường có chứa "email" trong tên
        if (key.includes('email')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                invalidFields.push({
                    name: key,
                    message: 'Email không hợp lệ',
                });
                isValid = false;
            }
        }

        // Kiểm tra số điện thoại (10 hoặc 11 số)
        if (key.includes('phone') || key.includes('mobile')) {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(value)) {
                invalidFields.push({
                    name: key,
                    message: 'Số điện thoại phải có 10 hoặc 11 số và chỉ chứa chữ số',
                });
                isValid = false;
            }
        }

        switch (key) {
            case 'password': {
                if (typeof value === 'string' && value.length < 6) {
                    invalidFields.push({
                        name: key,
                        message: 'Mật khẩu phải nhiều hơn 6 ký tự',
                    });
                    isValid = false;
                }
                break;
            }
            case 'confirm_password': {
                if (value !== valueForm['password']) {
                    invalidFields.push({
                        name: key,
                        message: 'Mật khẩu xác nhận không giống',
                    });
                    isValid = false;
                }
                break;
            }
            default:
                break;
        }
    });

    setInvalidFields(invalidFields);
    return isValid;
};

export default validate;
