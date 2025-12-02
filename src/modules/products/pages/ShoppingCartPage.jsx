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
import confetti from "canvas-confetti";

function ShoppingCartPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenInfo, setIsOpenInfo] = useState(false);
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);

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

    const isCartyEmpty = filteredCartItems.length === 0;



    const openLoginModal = () => {
        setIsOpenLogin(true);
    };
    const openInfoForm = () => {
        setIsOpenInfo(true);
    }
    const openSuccesModal = () => {
        console.log('OpenSuccesModal ejecuntadose');
        setIsOpenSuccess(true);
        console.log('Esperando modal');
    }

    const manageOrder = async () => {
        const token = localStorage.getItem("token");
        const customerId = localStorage.getItem("customerId");
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const orderItems = storedCart.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity) || 0,
        }));

        if (!token || token.length < 10) {
            setErrors(prev => ({ ...prev, customerId: "Debes iniciar sesión para continuar" }));
            openLoginModal();
            return;
        }

        if (customerId == "null") {
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
    {/*CONFETIS*/}
    const launchConfetti = () => {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };


    const isCartEmpty = filteredCartItems.length === 0;

    return (
        <>
            {isCartEmpty ? (
                <div className="p-4 text-center">
                    <ResponsiveText as="p" className="font-semibold">
                        Tu carrito está vacío.
                    </ResponsiveText>

                    <Button className="mt-4" onClick={() => navigate("/")}>
                        Ir a Comprar
                    </Button>
                </div>
            ) : (
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
                        className="fixed bottom-0 left-0 right-0 sm:static sm:w-full sm:h-[calc(100vh-160px)] sm:top-4 lg:sticky z-20 flex flex-col"
                        title="Detalle del pedido"
                        content={
                            <>
                                <ResponsiveText className="text-gray-600 text-xl sm:mt-1">Cantidad total: {totalQuantity}</ResponsiveText>
                                <ResponsiveText className="text-gray-600 text-xl sm:mt-1">Precio total: ${totalPrice}</ResponsiveText>
                            </>
                        }
                        actions={
                            <>
                                {errors.customerId && (
                                    <p className="text-red-600 text-sm mt-2">{errors.customerId}</p>
                                )}

                                {errors.orderItems && (
                                    <p className="text-red-600 text-sm mt-2">{errors.orderItems}</p>
                                )}

                                <Button className="w-full mt-2 font-semibold" onClick={manageOrder}>
                                    Finalizar compra
                                </Button>
                            </>
                        }
                        contentClassName={'flex flex-col'}
                    />
                </div>
            )}

            <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
                <LoginForm />
            </Modal>

            <Modal isOpen={isOpenInfo} onClose={() => setIsOpenInfo(false)}>
                <ExtraInfoForm
                    onCancel={() => setIsOpenInfo(false)}
                    isLoading={isSubmitting}
                    onSuccess={() => {
                        setIsOpenInfo(false);

                        launchConfetti();

                        openSuccesModal();

                        setCartItems([]);
                        localStorage.removeItem("cart");
                    }}
                />
            </Modal>

            <Modal isOpen={isOpenSuccess} onClose={() => setIsOpenSuccess(false)}>
                <div className="flex flex-col items-center text-center gap-4 z-99999">
                    <div className="text-2xl font-bold">Orden realizada</div>

                    <div className="flex w-full gap-4 mt-4">
                        <button
                            onClick={() => {
                                setIsOpenSuccess(false);
                                navigate('/');
                            }}
                            className="bg-purple-200 hover:bg-purple-300 text-black text-xs px-4 py-4 justify-center rounded-xl w-full"
                        >
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );

}

export default ShoppingCartPage;

