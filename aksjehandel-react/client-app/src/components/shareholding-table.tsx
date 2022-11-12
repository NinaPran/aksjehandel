import { error } from 'console';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Portfolio } from '../types/portfolio';
import { Shareholding } from '../types/shareholding';

interface ShareholdingTableProps {
    selectedPortfolio: Portfolio,
}

interface ShareholdingTableState {
    error: boolean;
    errorMessage?: string;
    loading: boolean;
    shareholdings?: Shareholding[];
}

export class ShareholdingTable extends Component<ShareholdingTableProps, ShareholdingTableState> {
    constructor(props: ShareholdingTableProps) {
        super(props);
        this.state = {
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        this.fetchShareholdings();
    }

    componentDidUpdate(prevProps: ShareholdingTableProps) {
        if (prevProps.selectedPortfolio.id !== this.props.selectedPortfolio.id) {
            this.fetchShareholdings();
        }
    }

    fetchShareholdings = () => {
        fetch("stock/getAllShareholdings?portfolioId=" + this.props.selectedPortfolio.id)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    shareholdings: response,
                    loading: false
                })
            })
            .catch(error => this.setState({
                loading: false,
                error: true
            }));
    }

    render() {
        const { loading, shareholdings, error } = this.state;
        return (
            <>
                {this.props.selectedPortfolio.displayName}
                {!shareholdings && !error && <div id="loading">
                    <p>Henter Akjseposter, venligst vent...</p>
                </div>}

                {error &&
                    <div>Feil ved henting av shareholdings</div>
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
                                        <td> <Link className='btn btn-primary' to={"/order"} state={{ companyId: shareholding.companyId, type: "buy" }}>Kjøp</Link></td>
                                        <td> <Link className='btn btn-primary' to={"/order"} state={{ companyId: shareholding.companyId, type: "sell" }}>Salg</Link></td>
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
}
