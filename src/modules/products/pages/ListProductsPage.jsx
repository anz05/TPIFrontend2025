import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import CardContent from '../../shared/components/CardContent';
import { getProducts } from '../services/list';
import ResponsiveText from '../../shared/components/ResponsiveText';
import StructuredCard from '../../shared/components/StructuredCard';
import Pagination from '../../shared/components/Pagination';
import SelectStatus from '../../shared/components/SelectStatus';

const productStatus = {
  ALL: 'all',
  ENABLED: 'active',
  DISABLED: 'inactive',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      setTotal(data.total ?? data.totalCount ?? 0);
      setProducts(data.productItems ?? data.products ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    await fetchProducts();
  };

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <ResponsiveText className="sm:text-2xl text-2xl font-bold">
            Productos
          </ResponsiveText>
          <Button
            className='h-13 w-13 rounded-2xl sm:hidden'
            onClick={() => navigate('/admin/products/create')}
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="#000000"></path> <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="#000000"></path> </g></svg>
          </Button>

          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex items-center gap-3'>
            <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-[1.32rem] w-full h-15' />
            <Button className='sm:h-15 sm:w-15 h-15 w-15 rounded-2xl' onClick={handleSearch}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </Button>
          </div>
          <SelectStatus
            value={status}
            onChange={setStatus}
            options={[
              { value: productStatus.ALL, label: "Todos" },
              { value: productStatus.ENABLED, label: "Habilitados" },
              { value: productStatus.DISABLED, label: "Inhabilitados" }
            ]}
          />
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-0.5'>
        {
          loading
            ? <span>Buscando datos...</span>
            : products.map(product => (
              <StructuredCard
                key={product.sku}
                className="hover:bg-gray-50 text-sm p-2"
                title={
                  <>
                    <span className="font-bold text-base">
                      {product.sku} - {product.name}
                    </span>
                  </>
                }
                content={
                  <>
                    Stock: {product.stockQuantity} – ${product.currentUnitPrice} –
                    {product.isActive ? 'Activado' : 'Desactivado'}
                  </>
                }
                actions={
                  <Button className="hidden md:block text-xs px-2 py-1">Ver</Button>
                }
                titleClassName="font-bold text-sm"
              />

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

export default ListProductsPage;
