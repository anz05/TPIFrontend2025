import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import StructuredCard from "../../shared/components/StructuredCard";
import Counter from "../../shared/components/Counter";
import ResponsiveText from "../../shared/components/ResponsiveText";

function ShoppingCartPage() {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

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

    return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6">
        <div className="lg:col-span-2 flex flex-col pb-40">
        {cartItems.map((item) => (
            <StructuredCard
            key={item.sku}
            className="mb-2"
            title={item.name}
            content={
                <div className="flex flex-col">

                <ResponsiveText as="p" className="text-gray-600">
                    Cantidad de productos: {item.quantity}
                </ResponsiveText>

                <ResponsiveText as="p" className="text-gray-600">
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
                    <Button className="w-full mt-4">Finalizar compra</Button>
                </>
            }
            contentClassName={'flex flex-col'}
            >
        </StructuredCard>
    </div>
    );
}

export default ShoppingCartPage;
