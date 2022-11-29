import { error } from 'console';
import React, { Component, FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ServerOrder } from '../types/order';
import { Trade } from '../types/trade';
import { Company } from '../types/company';


export const TradeTable: FC = () => {
    const [trades, setTrades] = useState<Trade[]>();

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = () => {
        fetch("stock/getAllTrades")
            .then(response => response.json())
            .then(response => {
                setTrades(response);
            })
            .catch(error => {
                setTrades(undefined)
            });
    }

    return (
        <>
            {trades &&
                <table className='table table-striped'>
                    <>
                        <thead>
                            <tr>
                                <th>Dato</th>
                                <th>Selskap</th>
                                <th>Kjøper portofolio</th>
                                <th>Selger portofolio</th>
                                <th>Antall</th>
                                <th>Pris</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trades.map((trade) =>
                                <tr key={trade.id}>
                                    <td> {trade.date} </td>
                                    <td> {trade.companyName} </td>
                                    <td> {trade.buyerPortfolioId} </td>
                                    <td> {trade.sellerPortfolioId} </td>
                                    <td> {trade.amount} </td>
                                    <td> {trade.price} </td>
                                </tr>
                            )}
                        </tbody>
                    </>
                </table>
            }
        </>
    );
}
