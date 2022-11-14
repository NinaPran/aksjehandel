import { error } from 'console';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ServerOrder } from '../types/order';
import { Portfolio } from '../types/portfolio';

interface OrderTableProps {
    selectedPortfolio: Portfolio,
}

interface OrderTableState {
    error: boolean;
    errorMessage?: string;
    loading: boolean;
    orders?: ServerOrder[];
}

export class OrderTable extends Component<OrderTableProps, OrderTableState> {
    constructor(props: OrderTableProps) {
        super(props);
        this.state = {
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        this.fetchOrders();
    }

    componentDidUpdate(prevProps: OrderTableProps) {
        if (prevProps.selectedPortfolio.id !== this.props.selectedPortfolio.id) {
            this.fetchOrders();
        }
    }

    fetchOrders = () => {
        fetch("stock/getAllOrders?portfolioId=" + this.props.selectedPortfolio.id)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    orders: response,
                    loading: false
                })
            })
            .catch(error => this.setState({
                loading: false,
                error: true
            }));
    }

    render() {
        const { loading, orders, error } = this.state;
        return (
            <>
                {this.props.selectedPortfolio.displayName}
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
                                        <td> <Link className='btn btn-primary' to={"/new-order"} state={{ orderId: order.id, type: order.type }}>Endre</Link></td>
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
}
