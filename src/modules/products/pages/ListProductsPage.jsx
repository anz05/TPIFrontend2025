import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import { getProducts } from '../services/list';
import ResponsiveText from '../../shared/components/ResponsiveText';
import StructuredCard from '../../shared/components/StructuredCard';
import Pagination from '../../shared/components/Pagination';
import SelectStatus from '../../shared/components/SelectStatus';
import SearchBar from '../../shared/components/SearchBar';
import { motion } from "framer-motion";

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
  const [openProductId, setOpenProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;
      setTotal(data.totalFiltered ?? 0);
      setProducts(data.products ?? []);
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

  const handleClicked = (sku) => {
    setOpenProductId(prev => prev === sku ? null : sku);
  };

  return (
    <div>
      <StructuredCard
        className="mb-4 p-4"
        content={
          <>
            <ResponsiveText as="h2" className={'text-2xl font-semibold'}>Productos</ResponsiveText>
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
          </>
        }
        actions={
          <>
            <div className='flex items-center gap-3'>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
              ></SearchBar>
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
          </>
        }
        actionsClassName={"flex flex-row justify-between flex-wrap"}
        contentClassName={"flex flex-row justify-between"}
        ></StructuredCard>

      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ?<ResponsiveText>Buscando datos...</ResponsiveText>
            : products.map(product => (
                <motion.div
                  key={product.sku}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, ease: "easeOut"}}
                >
                  <StructuredCard
                  key={product.sku}
                  className="hover:bg-gray-50 p-2 flex flex-row justify-between items-center"
                  title={
                    <>
                      {product.sku} - {product.name}
                    </>
                  }
                  content={
                    <>
                      Stock: {product.stockQuantity} – {product.isActive ? 'Activado' : 'Desactivado'} 
                      
                      {openProductId === product.sku && 
                      <div className='mt-2.5 pt-2 border-t-1 border-dashed'> 
                        Precio: ${product.currentUnitPrice}
                      </div>
                      }
                    </>
                  }
                  actions={
                    <Button onClick={()=>handleClicked(product.sku)} className="md:block text-xs px-2 py-1">
                      {!openProductId
                            ? "Ver"
                            : openProductId === product.sku
                              ? "Ocultar"
                              : "Ver"
                        }
                    </Button>
                  }
                  titleClassName={'font-semibold text-xl'}
                  contentClassName={'text-xl'}
                
                />
              </motion.div>))
              
              
            
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
