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

    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [selectedQuantities, setSelectedQuantities] = useState({});

    const handleCountChange = (sku, count) => {
        setSelectedQuantities(prev => ({
            ...prev,
            [sku]: count,
        }));
    };

    const handleAddToCart = (product) => {
        const currentCount = selectedQuantities[product.sku] || 0;
        if (currentCount < 1) {
            alert('Debes agregar al menos 1 producto.');
            return;
        }
        let cart = [];
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                cart = JSON.parse(storedCart);
            }
        } catch (error) {
            console.error('Error al leer el carrito de localStorage:', error);
        }
        const newCartItem = {
            sku: product.sku,
            name: product.name,
            unitPrice: product.currentUnitPrice,
            quantity: currentCount,
        };
        const existingIndex = cart.findIndex(item => item.sku === product.sku);

        if (existingIndex > -1) {
            cart[existingIndex].quantity = currentCount; 
        } else {
            cart.push(newCartItem);
        }
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${currentCount} unidades de ${product.name} añadidas al carrito!`);
        } catch (error) {
            console.error('Error al guardar el carrito en localStorage:', error);
        }
    };

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
            <div className='grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 p-4'>
            {
            loading
                ? <span>Buscando datos...</span>
                : products.map(product => (
                    <StructuredCard 
                        key={product.sku} 
                        className="flex flex-col"
                        content={
                            <>
                                <img src={image} alt={product.name} className="w-full h-48 object-cover" />
                                
                            </>
                        }
                        actions={
                            <>
                                <p className="mt-2 font-semibold">{product.name}</p>
                                <p className="mt-1 text-lg font-bold">${product.currentUnitPrice}</p>
                                {/* 7. Pasar la función callback al Counter */}
                                <Counter 
                                    stock={product.stockQuantity} 
                                    onCountChange={(count) => handleCountChange(product.sku, count)}
                                />
                                {/* 8. Llamar a handleAddToCart con los datos del producto al hacer clic */}
                                <Button onClick={() => handleAddToCart(product)}>
                                    Agregar
                                </Button>
                            </>
                        }
                        contentClassName='bg-gray-100 p-4'
                        actionsClassName="flex flex-col flex-wrap mt-3"
                    ></StructuredCard>
                ))
            }
            </div>

        <div className='flex justify-center items-center mt-3'>
            <Button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='bg-gray-200 disabled:bg-gray-100'
            >
            Atras
            </Button>
            <span>{pageNumber} / {totalPages}</span>
            <Button
            disabled={ pageNumber === totalPages }
            onClick={() => setPageNumber(pageNumber + 1)}
            className='bg-gray-200 disabled:bg-gray-100'
            >
            Siguiente
            </Button>

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
