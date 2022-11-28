import { error } from 'console';
import React, { Component, FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortfolioContext } from '../context/portfolio-context';
import { Portfolio } from '../types/portfolio';
import { Shareholding } from '../types/shareholding';

export const ShareholdingTable: FC = () => {
    const [errorText, setErrorText] = useState("")
    const [shareholdings, setShareholdings] = useState<Shareholding[]>();
    const portfolioContext = useContext(PortfolioContext);

    useEffect(() => {
        fetchShareholdings();
    }, [portfolioContext.selectedPortfolio]);

    const fetchShareholdings = () => {
        fetch("stock/getAllShareholdings?portfolioId=" + portfolioContext.selectedPortfolio?.id)
            .then(response => response.json())
            .then(response => {
                setShareholdings(response);
                setErrorText("");
            })
            .catch(error => {
                setErrorText("Feil ved henting av aksjeposter")
            });
    }
    return (
        <>
            {!shareholdings && !errorText && <div id="loading">
                <p>Henter Akjseposter, venligst vent...</p>
            </div>}

            {errorText &&
                <div style={{ color: "red" }}>{errorText}</div>
            }

            {shareholdings &&
                <table className='table table-striped'>
                    <>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Selskap</th>
                                <th>Antall (Reservert i ordre)</th>
                                <th></th><th></th><th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {shareholdings.map((shareholding) =>
                                <tr key={shareholding.id}>
                                    <td> {shareholding.companySymbol} </td>
                                    <td> {shareholding.companyName} </td>
                                    <td> {shareholding.amount}({shareholding.amount - shareholding.remainingAmount})</td>
                                    <td> <Link className='btn btn-success' to={"/new-order"} state={{ companyId: shareholding.companyId, type: "buy" }}>Kjøp</Link></td>
                                    <td> <Link className='btn btn-primary' to={"/new-order"} state={{ companyId: shareholding.companyId, type: "sell" }}>Salg</Link></td>
                                    <td></td>
                                </tr>
                            )}
                        </tbody>

                    </>
                </table>
            }
        </>
    );
}
