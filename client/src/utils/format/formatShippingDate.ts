/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');
export const formatShippingDate = (date?: any): string => {
    return moment(date).format('dddd, DD/MM/yyy');
};
