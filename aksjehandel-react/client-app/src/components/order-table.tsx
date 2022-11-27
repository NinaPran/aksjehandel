import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/portfolio-context';
import { ServerOrder } from '../types/order';


export const OrderTable: FC = () => {
    const [errorText, setErrorText] = useState("");
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
                setErrorText("");
            })
            .catch(error => {
                setErrorText("Feil ved henting av ordre");
            });
    }


    const deleteOrder = (id: number) => {
        fetch("stock/DeleteOrder?id=" + id)
            .then(response => {
                if (response.ok) {
                    fetchOrders();
                    setErrorText("");
                }
                else {
                    setErrorText("Feil ved sletting av ordre");
                }
            })
            .catch(error => {
                setErrorText("Feil ved sletting av ordre");
            });
    }


    return (
        <>
            {!orders && !errorText && <div id="loading">
                <p>Henter Ordre, venligst vent...</p>
            </div>}

            {errorText &&
                <div style={{ color: "red" }}>{errorText}</div>
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
                                    <td> <button onClick={() => deleteOrder(order.id)} className='btn btn-danger'>Slett</button></td>
                                </tr>
                            )}
                        </tbody>
                    </>
                </table>
            }
        </>
    );
}
