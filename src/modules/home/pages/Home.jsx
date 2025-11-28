// import Card from '../../shared/components/Card';

// function Home() {

//   return (
//     <div
//       className='flex flex-col gap-3 sm:grid sm:grid-cols-2'
//     >
//       <Card>
//         <h3>Productos</h3>
//         <p>Cantidad: #</p>
//       </Card>

//       <Card>
//         <h3>Ordenes</h3>
//         <p>Cantidad: #</p>
//       </Card>
//     </div>
//   );
// };

// export default Home;
import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProductsCount } from '../../products/services/list';

function Home() {

    const [productsCount, setProductsCount] = useState(null);
    const [ordersCount, setOrdersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCounts() {
            setLoading(true);

            const { data, error } = await getProductsCount();
            if (!error) {
                setProductsCount(data ?? 0);
            } else {
                console.error('Error fetching product count', error);
                setProductsCount(null);
            }

            setLoading(false);
        }

        loadCounts();
    }, []);

    return (
        <div className='flex flex-col gap-3 sm:grid sm:grid-cols-2'>
            <Card>
                <h3>Productos</h3>
                <p>Cantidad: {loading ? 'Cargando...' : productsCount}</p>
            </Card>

            <Card>
                <h3>Órdenes</h3>
                <p>Cantidad: {loading ? 'Cargando...' : ordersCount}</p>
            </Card>
        </div>
    );
}

export default Home;
