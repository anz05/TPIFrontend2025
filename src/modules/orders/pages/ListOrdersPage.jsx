import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import CardContent from '../../shared/components/CardContent';
import { getOrders } from '../services/list';
import StructuredCard from '../../shared/components/StructuredCard';
import Pagination from '../../shared/components/Pagination';
import SearchBar from '../../shared/components/SearchBar';
import ResponsiveText from '../../shared/components/ResponsiveText';

const orderStatus = {
  ALL: 'all',
  PENDING: 'pending',
  PROCESSING: 'processing',   
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',   
};

function ListOrdersPage() {
  const navigate = useNavigate();

  const [ searchTerm, setSearchTerm ] = useState('');
  const [ status, setStatus ] = useState(orderStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const [ total, setTotal ] = useState(0);
  const [ orders, setOrders ] = useState([]);

  const [loading, setLoading] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);

  const handleClicked = (id) => {
    setOpenOrderId(prev => prev === id ? null : id);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusToSend = status === orderStatus.ALL ? null : status;
      const { dataOrders, errorOrders } = await getOrders(searchTerm, statusToSend, pageNumber, pageSize);

      if (errorOrders) throw errorOrders;

      setTotal(dataOrders.totalFiltered ?? 0); 
      
      setOrders(Array.isArray(dataOrders.orderItems) 
        ? dataOrders.orderItems 
        : (Array.isArray(dataOrders.orders) 
            ? dataOrders.orders 
            : (Array.isArray(dataOrders.Orders) ? dataOrders.Orders : [])
          )
      );
    } catch (errerrorOrdersor) {
      console.error(errorOrders);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchOrders();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    await fetchOrders();
  };

  return (
    <div>
      <StructuredCard
        className="mb-4 p-4"
        title="Ordenes"
        actions={
          <>
            <div
            className='flex items-center gap-3'
            >
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              ></SearchBar>
            </div>
            <select onChange={evt => setStatus(evt.target.value)} className='text-[1.3rem]'>
              <option value={orderStatus.ALL}>Todas</option>
              <option value={orderStatus.PENDING}>Pendientes</option>
              <option value={orderStatus.PROCESSING}>En Proceso</option>
              <option value={orderStatus.SHIPPED}>Enviadas</option>
              <option value={orderStatus.DELIVERED}>Entregadas</option>
            </select>
          </>
        }
        actionsClassName={"flex flex-row justify-between flex-wrap"}

        ></StructuredCard>


      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ? <ResponsiveText>Buscando datos...</ResponsiveText>
            : orders.map(order => (
              <StructuredCard
                key={order.Guid}
                className="flex flex-col"
                title={`Orden #${order.id} - ${order.customerName}`}
                content={
                  <><ResponsiveText as='p'>Estado: {order.status} | Total: ${order.totalAmount}</ResponsiveText>
                    {openOrderId === order.id && (
                      <div className='flex flex-wrap'>
                        <ol className='p-1'>
                          <li><ResponsiveText>Fecha: {order.date.slice(0,10)}</ResponsiveText></li>
                          <li><ResponsiveText>Direccion de entrega: {order.shippingAddress}</ResponsiveText></li>
                          <li><ResponsiveText>Direccion de facturacion: {order.billingAddress}</ResponsiveText></li>
                          <li><ResponsiveText>Notas: {order.notes}</ResponsiveText></li>
                          <li><ResponsiveText>Items:</ResponsiveText></li>
                          <li>
                            {order.orderItems?.map((item) => (
                              <div key={item.productId}>
                                <ResponsiveText>- {item.name} | {item.quantity}</ResponsiveText>
                              </div>
                              ))}
                          </li>
                        </ol>
                      </div>
                    )}
                  </>
                }
                actions={
                  <>
                    <Button onClick={() => handleClicked(order.id)}>
                      {!openOrderId
                          ? "Ver"
                          : openOrderId === order.id
                            ? "Ocultar"
                            : "Ver"
                      }
                    </Button>
                  </>
                }
                titleClassName={'font-semibold text-xl'}
                contentClassName={'text-xs'}
              ></StructuredCard>
            ))
        }
      </div>

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
      />
    </div>

  );
};

export default ListOrdersPage;
