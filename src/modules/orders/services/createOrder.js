import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (formData) => {
  console.log("Enviando orden:", formData);

  return await instance.post('/api/orders', {
    shippingAddress: 'formData.shippingAddress',
    billingAddress: 'formData.billingAddress',
    customerId: localStorage.getItem('customerId'),
    orderItems: localStorage.getItem('cart'),
  });
};