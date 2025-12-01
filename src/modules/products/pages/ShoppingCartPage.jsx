
import Button from "../../shared/components/Button";
import StructuredCard from "../../shared/components/StructuredCard";
import Counter from "../../shared/components/Counter";
import ResponsiveText from "../../shared/components/ResponsiveText";
import Modal from "../../shared/components/Modal";
import Input from "../../shared/components/Input";
import LoginForm from "../../auth/components/LoginForm";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../orders/services/createOrder";

function ShoppingCartPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [cartItems, setCartItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const urlSearchTerm = queryParams.get('search') || '';

    const loadCartFromLocalStorage = useCallback(() => {
        try {
            const storedCart = localStorage.getItem("cart");
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            setCartItems([]);
        }
    }, []);

    useEffect(() => {
        loadCartFromLocalStorage();
    }, [loadCartFromLocalStorage]);

    const updateCartItemQuantity = useCallback((sku, newQuantity) => {
        setCartItems((prev) => {
            let updatedCart;

            if (newQuantity < 1) {
                updatedCart = prev.filter((item) => item.sku !== sku);
            } else {
                updatedCart = prev.map((item) =>
                    item.sku === sku ? { ...item, quantity: newQuantity } : item
                );
            }

            try {
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            } catch (e) {
                console.error("Error al guardar carrito:", e);
            }

            return updatedCart;
        });
    }, []);

    const handleCounterChange = useCallback(
        (sku, count) => {
            updateCartItemQuantity(sku, count);
        },
        [updateCartItemQuantity]
    );

    const handleRemoveItem = useCallback(
        (sku) => {
            updateCartItemQuantity(sku, 0);
        },
        [updateCartItemQuantity]
    );

    const filteredCartItems = useMemo(() => {
        const term = urlSearchTerm.toLowerCase().trim();
        if (!term) {
            return cartItems;
        }

        return cartItems.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term)
        );
    }, [cartItems, urlSearchTerm]);

    const { totalQuantity, totalPrice } = useMemo(() => {
        let totalQty = 0;
        let totalPrc = 0;

        cartItems.forEach((item) => {
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
                <ResponsiveText as="p" className="font-semibold">
                    Tu carrito está vacío.
                </ResponsiveText>

                <Button className="mt-4" onClick={() => navigate("/")}>
                    Ir a Comprar
                </Button>
            </div>
        );
    }

    const openLoginModal = () => {
        setIsOpen(true);
    };

    const manageOrder = async () => {
        const token = localStorage.getItem("token");
        const customerId = localStorage.getItem("customerId");
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const orderItems = storedCart.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity) || 0,
        }));

        if (!token) {
            openLoginModal();
            return;
        }

        if (customerId == 'null') {
            alert("No es un cliente. Por favor, inicie sesión como cliente.");
            openLoginModal();
            return;
        }

        if (orderItems.length === 0) {
            alert("El carrito está vacío o contiene productos no válidos.");
            return;
        }

        try {
            const { data, error } = await createOrder(customerId, orderItems);
            if (error) {
                console.error('Error creating order:', error);
                alert('Ocurrió un error al crear la orden. Intente de nuevo.');
                return;
            }
            setCartItems([]);
            localStorage.removeItem('cart');
            navigate('/');
        } catch (error) {
            console.error('Unexpected error creating order:', error);
            if (error.response && error.response.data) {
                console.error('Detalles del error 400 del servidor:', error.response.data);
            }
            alert('Error inesperado al crear la orden.');
        }
    };

    const redirectToAuth = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 pb-28 lg:pb-0">
            <div className="lg:col-span-2 flex flex-col gap-4 pb-40">
                {filteredCartItems.map((item) => (
                    <StructuredCard
                        key={item.sku}
                        className={""}
                        title={item.name}
                        content={
                            <div className="flex flex-col text-2xl">

                                <ResponsiveText as="p" className="text-gray-600 text-xl gap-1">
                                    Cantidad de productos: {item.quantity}
                                </ResponsiveText>

                                <ResponsiveText as="p" className="text-gray-600 text-xl gap-1">
                                    Sub Total: ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                                </ResponsiveText>

                                <div className="flex items-center justify-between gap-1 mt-4">
                                    <Counter
                                        initialCount={item.quantity}
                                        stock={100}
                                        activeReset={false}
                                        onCountChange={(count) => handleCounterChange(item.sku, count)}
                                    />

                                    <Button
                                        className="bg-purple-200 hover:bg-purple-300 text-black text-sm px-4 py-4 rounded-xl"
                                        onClick={() => handleRemoveItem(item.sku)}
                                    >
                                        Borrar
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                ))}
            </div>

            <StructuredCard
                className="h-fit lg:justify-end fixed bottom-0 left-0 right-0 px-4 lg:px-5 lg:static lg:w-auto z-20"
                title="Detalle del pedido"
                content={
                    <>
                        <ResponsiveText className=" text-gray-600 text-xl sm:mt-1">Cantidad total: {totalQuantity}</ResponsiveText>
                        <ResponsiveText className="text-gray-600 text-xl sm:mt-1">Precio total: ${totalPrice}</ResponsiveText>
                    </>
                }
                actions={
                    <>
                        <Button className="w-full mt-2 font-semibold" onClick={manageOrder}>Finalizar compra</Button>
                    </>
                }
                contentClassName={'flex flex-col'}
            >
            </StructuredCard>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col gap-3">
                    <LoginForm />
                </div>
            </Modal>
        </div>
    );
}

export default ShoppingCartPage;
