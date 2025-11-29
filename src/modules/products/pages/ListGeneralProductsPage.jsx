import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import CardContent from '../../shared/components/CardContent';
import { getGeneralProducts } from '../services/list';
import logo from '../../../../public/logoCompletoEcommerce.png';
import image from '../../../../public/imageNotFound.svg';
import ProductCard from '../components/ProductCard';
import StructuredCard from '../../shared/components/StructuredCard';
import Counter from '../../shared/components/Counter';

function ListGeneralProductsPage() {
    const navigate = useNavigate();

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ pageNumber, setPageNumber ] = useState(1);
    const [ pageSize, setPageSize ] = useState(10);

    const [ total, setTotal ] = useState(0);
    const [ products, setProducts ] = useState([]);

    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
        setLoading(true);
        const { data, error } = await getGeneralProducts(searchTerm, pageNumber, pageSize);

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
    }, [pageSize, pageNumber]);

    const totalPages = Math.ceil(total / pageSize);

    const handleSearch = async () => {
        await fetchProducts();
    };

    const getLinkStyles = ({ isActive }) => (
    `
        pl-4 w-25 block  pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
        ${isActive
        ? 'bg-gray-200 hover:bg-purple-100 '
        : ''
        }
        `
    );

    return (
        <div>
        <header
        className="
            bg-white border border-gray-300 p-4 rounded-xl">
            <div
                className='flex justify-between items-center mb-3'
                >
                <img src={logo} alt="Logo" width="200" />
                <Button onClick={() => navigate('/')}>Productos</Button>
                <Button onClick={() => navigate('/cart')}>Carrito</Button>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div
                        className='flex items-center gap-3'
                    >
                        <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-[1.3rem] w-full' />
                        <Button className='h-11 w-11' onClick={handleSearch}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </Button>
                    </div>
                </div>  
                <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
                <Button onClick={() => navigate('/signup')}>Registrarse</Button>
            </div>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 p-4'>
            {
            loading
                ? <span>Buscando datos...</span>
                : products.map(product => (
                    // <ProductCard key ={product.sku}
                    //     image={image}
                    //     name={product.name}
                    //     currentUnitPrice={product.currentUnitPrice}
                    //     stock={product.stockQuantity}
                    // />
                    <StructuredCard 
                        key={product.sku} 
                        className="flex flex-col"
                        content={
                            <>
                                <img src={image} alt={product.name} className="w-full h-48 object-cover" />
                                <p className="mt-2 font-semibold">{product.name}</p>
                                <p className="mt-1 text-lg font-bold">${product.currentUnitPrice}</p>
                            </>
                        }
                        actions={
                            <>
                                <Counter stock={product.stockQuantity} />
                                <Button>Agregar</Button>
                            </>
                        }
                    ></StructuredCard>
                ))
            }
        </div>

        <div className='flex justify-center items-center mt-3'>
            <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='bg-gray-200 disabled:bg-gray-100'
            >
            Atras
            </button>
            <span>{pageNumber} / {totalPages}</span>
            <button
            disabled={ pageNumber === totalPages }
            onClick={() => setPageNumber(pageNumber + 1)}
            className='bg-gray-200 disabled:bg-gray-100'
            >
            Siguiente
            </button>

            <select
            value={pageSize}
            onChange={evt => {
                setPageNumber(1);
                setPageSize(Number(evt.target.value));
            }}
            className='ml-3'
            >
            <option value="2">2</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            </select>
        </div>
        </div>

    );
    };

    export default ListGeneralProductsPage;
