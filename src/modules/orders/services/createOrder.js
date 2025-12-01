import { instance } from '../../shared/api/axiosInstance';

export const createOrder = async (customerId, orderItems) => {
  try {
    console.log('Enviando orden:', { customerId, orderItems });
    const response = await instance.post('/api/orders', 
      {
        shippingAddress: "Direccion de envio de ejemplo",
        billingAddress: "Direccion de facturacion de ejemplo",
        notes: "Notas de ejemplo",
        customerId: customerId,
        orderItems: orderItems,
    });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error createOrder service:', error);
    return { data: null, error };
  }
};