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
    const [errors, setErrors] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const urlSearchTerm = queryParams.get('search') || '';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [modalPedidoCorrecto, setModalPedidoCorrecto] = useState(false);
    const [infoOrden, setInfoOrden] = useState({});

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

        if (!token || token === "null" || token.length < 10) {
            setErrors(prev => ({ ...prev, customerId: "Debes iniciar sesión para continuar" }));
            openLoginModal();
            return;
        }

        if (!customerId || customerId === "null") {
            setErrors(prev => ({ ...prev, customerId: "No es un cliente válido" }));
            openLoginModal();
            return;
        }

        if (orderItems.length === 0) {
            setErrors(prev => ({
                ...prev,
                orderItems: "El carrito está vacío o contiene productos no válidos."
            }));
            return;
        }
        openInfoForm();

        setErrors(prev => ({
            ...prev,
            customerId: null,
            orderItems: null
        }));


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

            setInfoOrden({ message: "¡Orden creada exitosamente!" });
            setModalPedidoCorrecto(true);

            return;
            // } catch (err) {
            //     alert('Error inesperado al crear la orden.');
            //     console.error('Unexpected error creating order:', err);
            // } 
        } catch (error) {
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
                        {errors.customerId && (
                            <p className="text-red-600 text-sm mt-2">
                                {errors.customerId}
                            </p>
                        )}

                        {errors.orderItems && (
                            <p className="text-red-600 text-sm mt-2">
                                {errors.orderItems}
                            </p>
                        )}
                        <Button className="w-full mt-2 font-semibold" onClick={manageOrder}>Finalizar compra</Button>
                    </>
                }
                contentClassName={'flex flex-col'}


            >
            </StructuredCard>

            <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
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

            <Modal isOpen={modalPedidoCorrecto} onClose={() => setModalPedidoCorrecto(false)}>
                <div className="flex flex-col items-center text-center gap-4">

                    <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-green-600"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800">
                        ¡Orden creada exitosamente!
                    </h2>

                    <p className="text-gray-600">
                        Tu compra fue registrada correctamente.
                    </p>

                    <div className="flex w-full gap-4 mt-4">
                        <button
                            onClick={() => {
                                setModalPedidoCorrecto(false);
                                navigate('/');
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-xl font-semibold"
                        >
                            Seguir comprando
                        </button>

                        <button
                            onClick={() => {
                                setModalPedidoCorrecto(false);
                                navigate('/orders');
                            }}
                            className="flex-1 bg-purple-200 hover:bg-purple-100 py-2 rounded-xl font-semibold"
                        >
                            Ver mis órdenes
                        </button>
                    </div>

                </div>
            </Modal>

        </div>
    );
}

export default ShoppingCartPage;

