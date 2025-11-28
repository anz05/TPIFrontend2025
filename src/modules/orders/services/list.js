import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
    const queryString = new URLSearchParams({
        search,
        status,
        pageNumber,
        pageSize,
    });
    const response = await instance.get(`api/orders/admin?${queryString}`);
    return { data: response.data, error: null };
};

export const getOrdersCount = async (status = null) => {
    try {
        const params = new URLSearchParams();

        if (status && status !== 'all') params.set('status', status);

        params.set('pageNumber', 1);
        params.set('pageSize', 1);

        const response = await instance.get(`api/orders/admin?${params}`);

        const total = response.data?.total ?? response.data?.totalCount ?? null;

        return { data: total, error: null };
    } catch (error) {
    return { data: null, error };
    }
};
