import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getGeneralProducts } from '../services/list';
import logo from '../../../../public/logoCompletoEcommerce.png';
import Counter from '../../shared/components/Counter';

function ShoppingCartPage() {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

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
    
    return (
        <div className="relative">
        <header className="bg-white border border-gray-300 p-4 mb-4 rounded-xl ">

            <div className="flex items-center justify-between sm:hidden">

            <button onClick={() => setOpenMenu(true)} className="p-2">
                <svg width="28" height="28" viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="black" strokeWidth="2" />
                </svg>
            </button>
            <img src={logo} alt="Logo" className="w-24" />

            <Button className="px-3 py-1" onClick={() => navigate('/login')}>
                Iniciar sesión
            </Button>
            </div>
            <div className="hidden sm:flex items-center justify-between">

            <div className="flex items-center gap-5">
                <img src={logo} alt="Logo" className="w-32" />

                <button
                className="text-sm px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                onClick={() => navigate('/')}
                >
                Productos
                </button>

                <button
                className="text-sm px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                onClick={() => navigate('/cart')}
                >
                Carrito de compras
                </button>
            </div>
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-80 border border-gray-300">
                <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar"
                className="bg-transparent w-full outline-none text-sm"
                />
                <button onClick={fetchProducts}>
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="9" cy="9" r="7" stroke="black" strokeWidth="2" fill="none" />
                    <path d="M14 14l4 4" stroke="black" strokeWidth="2" />
                </svg>
                </button>
            </div>
            <div className="flex gap-3">
                <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
                <Button onClick={() => navigate('/signup')}>Registrarse</Button>
            </div>
            </div>
            {openMenu && (
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setOpenMenu(false)}
            >
                <div
                className="absolute left-0 top-0 bg-white w-64 h-full shadow-lg p-4"
                //onClick={(e) => e.stopPropagation()}
                >
                <h2 className="font-bold text-lg mb-4">Menú</h2>

                <button
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => {
                    setOpenMenu(false);
                    navigate('/');
                    }}
                >
                    Productos
                </button>

                <button
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                    onClick={() => {
                    setOpenMenu(false);
                    navigate('/cart');
                    }}
                >
                    Carrito de compras
                </button>

                <hr className="my-3" />

                <Button className="w-full" onClick={() => navigate('/login')}>
                    Iniciar sesión
                </Button>

                <Button className="w-full mt-2" onClick={() => navigate('/signup')}>
                    Registrarse
                </Button>
                </div>
            </div>
            )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">

            <div className="sm:col-span-2">
            {loading ? (
                <span>Buscando datos...</span>
            ) : (
                products.map(product => (
                <Card key={product.sku} className="mb-3">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className='flex justify-between items-center'>
                        <p className="text-gray-600">
                            Cantidad de productos: # — Subtotal: $
                        </p>
                        <Counter stock={product.stockQuantity} activeReset={true}/>
                    </div>
                    
                </Card>
                ))
            )}
            </div>
            <Card
            className="
                fixed bottom-0 left-0 right-0
                //sm:static sm:w-full sm:h-[calc(100vh-160px)]
                sm:sticky sm:top-4
                z-20
            "
            >
            <div className="font-bold text-lg mb-4">Detalle del pedido</div>
            <p>Cantidad total: #</p>
            <p>Precio total: $</p>

            <Button className="w-full mt-4">Finalizar compra</Button>
            </Card>
        </div>
        </div>
    );
}

export default ShoppingCartPage;

