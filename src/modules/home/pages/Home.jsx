import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProducts } from '../../products/services/list';
import { getOrders } from '../../orders/services/list';
import StructuredCard from '../../shared/components/StructuredCard';
import CardTitle from '../../shared/components/CardTitle';
import CardContent from '../../shared/components/CardContent';

function Home() {

    const [productsCount, setProductsCount] = useState(null);
    const [ordersCount, setOrdersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCounts() {
            setLoading(true);

            const { data, error } = await getProducts();
            if (!error) {
                setProductsCount(data.totalCount ?? 0);
            } else {
                console.error('Error fetching product count', error);
                setProductsCount(null);
            }

            const { dataOrders, errorOrders } = await getOrders();
            if (!errorOrders) {
                setOrdersCount(dataOrders.totalCount ?? 0);
            } else {
                console.error('Error fetching product count', errorOrders);
                setOrdersCount(null);
            }

            setLoading(false);
        }

        loadCounts();
    }, []);

    return (
        <div className='flex flex-col gap-3 sm:grid sm:grid-cols-2'>
            <StructuredCard
                title='Productos'
                content={
                    <p className="text-sm text-gray-500 mt-1">
                        {loading ? 'Cargando...' :`Cantidad de productos: ${productsCount}`}
                    </p>}
            >
            </StructuredCard>
            <StructuredCard
                title='Órdenes'
                content={
                    <p className='text-sm text-gray-500 mt-1'>
                        {loading ? 'Cargando...' : `Cantidad de ordenes: ${ordersCount}`}
                    </p>
                }>
            </StructuredCard>
        </div>
    );
}

export default Home;
