import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/portfolio-context';
import { ServerOrder } from '../types/order';


export const OrderTable: FC = () => {
    const [error, setError] = useState(false);
    const [orders, setOrders] = useState<ServerOrder[]>();
    const portfolioContext = useContext(PortfolioContext);

    useEffect(() => {
        fetchOrders();
    }, [portfolioContext.selectedPortfolio])

    const fetchOrders = () => {
        fetch("stock/getAllOrders?portfolioId=" + portfolioContext.selectedPortfolio?.id)
            .then(response => response.json())
            .then(response => {
                setOrders(response);
            })
            .catch(error => {
                setError(true);
            });
    }

    return (
        <>
            {!orders && !error && <div id="loading">
                <p>Henter Ordre, venligst vent...</p>
            </div>}

            {error &&
                <div>Feil ved henting av ordre</div>
            }

            {orders &&
                <table className='table table-striped'>
                    <>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Selskap</th>
                                <th>Type</th>
                                <th>Pris</th>
                                <th>Antall</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) =>
                                <tr key={order.id}>
                                    <td> {order.companySymbol} </td>
                                    <td> {order.companyName} </td>
                                    <td> {order.type} </td>
                                    <td> {order.price} </td>
                                    <td> {order.amount} </td>
                                    <td> <Link className='btn btn-primary' to={"/edit-order"} state={{ editOrder: order }}>Endre</Link></td>
                                    <td> <button className='btn btn-danger'>Slett</button></td> {/*onclick='deleteOrder(  order.id  )'*/}
                                </tr>
                            )}
                        </tbody>
                    </>
                </table>
            }
        </>
    );
}
