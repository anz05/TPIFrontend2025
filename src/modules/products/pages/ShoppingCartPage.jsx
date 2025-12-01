
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
import ExtraInfoForm from "../../orders/componentes/ExtraInfoForm";
import { frontendErrorMessage } from "../../orders/helpers/backendError";

function ShoppingCartPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const urlSearchTerm = queryParams.get('search') || '';
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsOpenLogin(true);
    };
    const openInfoForm = () => {
        setIsOpenInfo(true);
    }

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
        openInfoForm();
    };

    const handleOrderSubmission = async (extraInfo) => {
        setIsSubmitting(true);
        const customerId = localStorage.getItem("customerId");
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const orderItems = storedCart.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity) || 0,
        }));

        const payload = {
            shippingAddress: extraInfo.shippingAdress,
            billingAddress: extraInfo.billingAdress,
            notes: extraInfo.notes,
            customerId: customerId,
            orderItems: orderItems,
        };

        try {
            const { error } = await createOrder(payload.customerId, orderItems, payload.shippingAddress, payload.billingAddress, payload.notes);
            
            // if (error) {
            //     alert('Ocurrió un error al crear la orden. Intente de nuevo.');
            //     console.error('Error creating order:', error);
            //     return;
            // }

            if (error) {
                setErrorMessage(error.frontendErrorMessage);
                return;
            }

            setIsOpenInfo(false);
            setCartItems([]);
            localStorage.removeItem('cart');
            navigate('/');
            alert('¡Orden creada exitosamente!');

        // } catch (err) {
        //     alert('Error inesperado al crear la orden.');
        //     console.error('Unexpected error creating order:', err);
        // } 
        }catch (error) {
        if (error?.response?.data?.code) {
            setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
        } else {
            setErrorMessage('Llame a soporte');
        }
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
        <div className="lg:col-span-2 flex flex-col pb-40">
        {filteredCartItems.map((item) => (
            <StructuredCard
            key={item.sku}
            className="mb-2"
            title={item.name}
            content={
                <div className="flex flex-col text-2xl">

                <ResponsiveText as="p" className="text-gray-600 text-xl">
                    Cantidad de productos: {item.quantity}
                </ResponsiveText>

                <ResponsiveText as="p" className="text-gray-600 text-xl">
                    Sub Total: ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                </ResponsiveText>

                <div className="flex items-center justify-between mt-2">
                    <Counter
                        initialCount={item.quantity}
                        stock={100}
                        activeReset={false}
                        onCountChange={(count) => handleCounterChange(item.sku, count)}
                    />

                    <Button
                        className="bg-purple-200 hover:bg-purple-300 text-purple-800 text-sm px-4 py-2 rounded-xl"
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
            className="
                fixed bottom-0 left-0 right-0
                sm:static sm:w-full sm:h-[calc(100vh-160px)]
                sm:top-4 lg:sticky
                z-20
                flex flex-col
            "
            title="Detalle del pedido"
            content={
                <>
                    <ResponsiveText className="mt-2">Cantidad total: {totalQuantity}</ResponsiveText>
                    <ResponsiveText className="mt-1">Precio total: ${totalPrice}</ResponsiveText>
                </>
            }
            actions={
                <>
                    <Button className="w-full mt-4" onClick={manageOrder}>Finalizar compra</Button>
                </>
            }
            contentClassName={'flex flex-col'}
            >
        </StructuredCard>

        <Modal isOpenLogin={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
            <div className="flex flex-col gap-3">
                <LoginForm />
            </div>
        </Modal>

        <Modal isOpen={isOpenInfo} onClose={() => !isSubmitting && setIsOpenInfo(false)}>
                <div className="flex flex-col gap-3">
                    <ExtraInfoForm 
                        onSubmit={handleOrderSubmission} 
                        onCancel={() => setIsOpenInfo(false)}
                        isLoading={isSubmitting}
                    />
                </div>
            </Modal>
    </div>
    );
}

export default ShoppingCartPage;
