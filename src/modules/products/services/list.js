import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};

export const getProductsCount = async (status = null) => {
  try {
    const params = new URLSearchParams();

    if (status) params.set('status', status);

    params.set('pageNumber', 1);
    params.set('pageSize', 1);

    const response = await instance.get(`api/products/admin?${params}`);

    const total = response.data?.total ?? response.data?.totalCount ?? null;

    return { data: total, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getGeneralProducts = async (search = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};