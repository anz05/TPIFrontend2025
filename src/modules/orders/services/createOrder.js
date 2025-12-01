import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (customerId, orderItems, shippingAddress, billingAddress, notes) => {
  try {
    console.log('Enviando orden:', { customerId, orderItems });
    const response = await instance.post('/api/orders', 
      {
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        notes: notes,
        customerId: customerId,
        orderItems: orderItems,
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error createOrder service:', error);
    return { data: null, error };
  }
};