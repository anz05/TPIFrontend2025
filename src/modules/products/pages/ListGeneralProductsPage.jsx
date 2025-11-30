import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import CardContent from '../../shared/components/CardContent';
import { getGeneralProducts } from '../services/list';
import logo from '../../../../public/logoCompletoEcommerce.png';
import image from '../../../../public/imageNotFound.svg';
import Pagination from '../../shared/components/Pagination';
import StructuredCard from '../../shared/components/StructuredCard';
import Counter from '../../shared/components/Counter';
import ResponsiveText from '../../shared/components/ResponsiveText';



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
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4 p-4">

        {loading ? (
            <span>Buscando datos...</span>
        ) : (
            products.map((product) => (
            <StructuredCard
            key={product.sku}
            className="flex flex-col gap-3 p-3"
            content={
                <div className="flex flex-col gap-3">

                    <img
                        src={image ?? product.image}
                        alt={product.name}
                        className="w-full rounded-lg object-cover h-80 sm:h-40 md:h-48"
                    />
                    <ResponsiveText as="h2" className="font-semibold">
                        {product.name}
                    </ResponsiveText>
                    <ResponsiveText as="p" className="font-bold mt-1">
                        ${product.currentUnitPrice}
                    </ResponsiveText>
                    <div className="flex items-center justify-between">
                        <Counter
                            stock={product.stockQuantity}
                            count={selectedQuantities[product.sku] || 0}
                            onCountChange={(count) => handleCountChange(product.sku, count)}
                        />

                        <Button onClick={() => handleAddToCart(product)}
                                className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 py-2 rounded-xl">
                            Agregar
                        </Button>
                    </div>

                </div>
            }
        />
        ))
        )}

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
}

export default ListGeneralProductsPage;