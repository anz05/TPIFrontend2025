// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../shared/components/Button';
// import Card from '../../shared/components/Card';
// import { getGeneralProducts } from '../services/list';
// import logo from '../../../../public/logoCompletoEcommerce.png';
// import Counter from '../../shared/components/Counter';
// import StructuredCard from '../../shared/components/StructuredCard';

// function ShoppingCartPage() {
//     const navigate = useNavigate();
//     const [count, setCount] = useState(0);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [pageNumber, setPageNumber] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [products, setProducts] = useState([]);

//     const [loading, setLoading] = useState(false);
//     const [openMenu, setOpenMenu] = useState(false);

//     const fetchProducts = async () => {
//         try {
//         setLoading(true);
//         const { data, error } = await getGeneralProducts(searchTerm, pageNumber, pageSize);
//         if (error) throw error;

//         setTotal(data.total ?? data.totalCount ?? 0);
//         setProducts(data.productItems ?? data.products ?? []);
//         } catch (error) {
//         console.error(error);
//         } finally {
//         setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, [pageSize, pageNumber]);
    
//     return (
//         <div className="relative">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">

//             <div className="sm:col-span-2">
//             {loading ? (
//                 <span>Buscando datos...</span>
//             ) : (
//                 products.map(product => (
//                 <StructuredCard 
//                     key={product.sku} 
//                     className="flex flex-col mb-3"
//                     title={product.name}
//                     content={
//                         <>
//                             <div className='flex justify-between items-center mt-2'>
//                                 <p className="text-gray-600">
//                                     Cantidad de productos: # — Subtotal: $
//                                 </p>
//                                 <Counter stock={product.stockQuantity} activeReset={true}/>
//                             </div>
//                         </>
//                     }
//                 ></StructuredCard>
                        

//                 ))
//             )}
//             </div>
//             <StructuredCard
//                 className="
//                     fixed bottom-0 left-0 right-0
//                     // sm:static sm:w-full sm:h-[calc(100vh-160px)]
//                     sm:sticky sm:top-4
//                     z-20
//                     flex flex-col
//                 "
//                 title="Detalle del pedido"
//                 content={
//                     <>
//                         <p className="mt-2">Cantidad total: #</p>
//                         <p className="mt-1">Precio total: $</p>
//                     </>
//                 }
//                 actions={
//                     <>
//                         <Button className="w-full mt-4">Finalizar compra</Button>
//                     </>
//                 }
//             >
//             </StructuredCard>
//         </div>
//         </div>
//     );
// }

// export default ShoppingCartPage;

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import StructuredCard from '../../shared/components/StructuredCard';
import Counter from '../../shared/components/Counter';

function ShoppingCartPage() {
    const navigate = useNavigate();
    
    const [cartItems, setCartItems] = useState([]);
    
    const loadCartFromLocalStorage = useCallback(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        loadCartFromLocalStorage();
    }, [loadCartFromLocalStorage]);

    const updateCartItemQuantity = useCallback((sku, newQuantity) => {
        setCartItems(prev => {
            let updatedCart;

            if (newQuantity < 1) {
                updatedCart = prev.filter(item => item.sku !== sku);
            } else {
                updatedCart = prev.map(item =>
                    item.sku === sku ? { ...item, quantity: newQuantity } : item
                );
            }

            try {
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            } catch (e) {
                console.error('Error al guardar carrito:', e);
            }

            return updatedCart;
        });
    }, []);

    const handleCounterChange = useCallback((sku, count) => {
        updateCartItemQuantity(sku, count);
    }, [updateCartItemQuantity]);

    const handleRemoveItem = useCallback((sku) => {
        updateCartItemQuantity(sku, 0);
    }, [updateCartItemQuantity]);
    const { totalQuantity, totalPrice } = useMemo(() => {
        let totalQty = 0;
        let totalPrc = 0;

        cartItems.forEach(item => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.unitPrice) || 0;
            
            totalQty += quantity;
            totalPrc += quantity * price;
        });

        return {
            totalQuantity: totalQty,
            totalPrice: totalPrc.toFixed(2), 
        };
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-xl font-semibold">🛒 Tu carrito está vacío.</p>
                <Button className="mt-4" onClick={() => navigate('/')}>Ir a Comprar</Button>
            </div>
        );
    }
    
    return (
        <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">

                <div className="sm:col-span-2">
                    {cartItems.map(item => (
                        <StructuredCard 
                            key={item.sku} 
                            className="flex flex-col mb-3"
                            title={item.name}
                            content={
                                <>
                                    <div className='flex justify-between items-center mt-2'>
                                        <p className="text-gray-600">
                                            Cantidad: {item.quantity} — Subtotal: ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                                        </p>
                                        <Counter 
                                            initialCount={item.quantity} 
                                            stock={100}
                                            activeReset={false}
                                            onCountChange={(count) => handleCounterChange(item.sku, count)}
                                        />
                                        <Button 
                                            className='ml-4 bg-purple-200 hover:bg-purple-300 text-purple-800'
                                            onClick={() => handleRemoveItem(item.sku)}
                                        >
                                            Borrar
                                        </Button>
                                    </div>
                                </>
                            }
                        ></StructuredCard>
                    ))}
                </div>
                <StructuredCard
                    className="
                        fixed bottom-0 left-0 right-0
                        // sm:static sm:w-full sm:h-[calc(100vh-160px)]
                        sm:sticky sm:top-4
                        z-20
                        flex flex-col
                    "
                    title="Detalle del pedido"
                    content={
                        <>
                            <p className="mt-2">Cantidad total: {totalQuantity}</p>
                            <p className="mt-1">Precio total: ${totalPrice}</p>
                        </>
                    }
                    actions={
                        <>
                            <Button className="w-full mt-4">Finalizar compra</Button>
                        </>
                    }
                >
                </StructuredCard>
            </div>
        </div>
    );
}

export default ShoppingCartPage;