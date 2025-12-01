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
import Modal from '../../shared/components/Modal';


function ListGeneralProductsPage() {
    const navigate = useNavigate();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [modalInfo, setModalInfo] = useState({
        open: false,
        productName: "",
    });

    const [selectedQuantities, setSelectedQuantities] = useState({});
    const [errors, setErrors] = useState({});

    const queryParams = new URLSearchParams(location.search);
    const urlSearchTerm = queryParams.get('search') || '';

    const handleCountChange = (sku, count) => {
        setSelectedQuantities(prev => ({
            ...prev,
            [sku]: count,
        }));
    };

    const handleAddToCart = (product) => {
        const currentCount = selectedQuantities[product.sku] || 0;
        if (currentCount < 1) {
            setErrors(prev => ({
                ...prev,
                [product.sku]: "Debes agregar al menos 1 producto."
            }));
            return;
        }

        setErrors(prev => ({
            ...prev,
            [product.sku]: null
        }));

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
            productId: product.id,
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

            setModalInfo({
                open: true,
                productName: product.name
            });

        } catch (error) {
            console.error('Error al guardar el carrito en localStorage:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await getGeneralProducts(urlSearchTerm, pageNumber, pageSize);

            if (error) throw error;

            setTotal(data.totalCount ?? 0);
            setProducts(data.products ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [pageSize, pageNumber, urlSearchTerm]);

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
                                        className="w-full rounded-lg object-cover h-80 sm:h-60 md:h-68"
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
                                    {errors[product.sku] && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors[product.sku]}
                                        </p>
                                    )}
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

            <Modal
                isOpen={modalInfo.open}
                onClose={() => setModalInfo({ open: false, productName: "" })}
            >
                <h2 className="text-lg font-semibold mb-4">Agregaste a tu carrito:</h2>

                <p className="text-gray-700 mb-6">
                    <strong>{modalInfo.productName}</strong>
                </p>

                <div className="flex justify-between gap-3">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded w-1/2"
                        onClick={() => setModalInfo({ open: false, productName: "" })}
                    >
                        Ver más productos
                    </button>

                    <button
                        className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-4 py-2 rounded w-1/2"
                        onClick={() => {
                            setModalInfo({ open: false, productName: "" });
                            navigate("/cart");
                        }}
                    >
                        Ir al carrito
                    </button>
                </div>
            </Modal>


        </div>
    );
}

export default ListGeneralProductsPage;