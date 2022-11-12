import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Layout } from './Layout';
import { Portfolio } from './types/portfolio';
import { Overview } from './pages/overview';
import { MarketOverview } from './pages/marketOverview';
import { Order } from './pages/order';
import { PortfolioContext } from './context/portfolio-context';

interface AppProps {
}

interface AppState {
    error: boolean;
    errorMessage?: string;
    loading: boolean;
    selectedPortfolio?: Portfolio;
    portfolios?: Portfolio[];
}

export class AppLoggedIn extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        fetch('stock/getAllPortfolios')
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    portfolios: response,
                    loading: false
                })
            })
            .catch(error => this.setState({
                loading: false,
                error: true
            }));
    }

    setSelectedPortfolio = (portfolio: Portfolio) => {
        this.setState({ selectedPortfolio: portfolio })
    }

    render() {
        const { loading, portfolios, selectedPortfolio } = this.state;
        return (
            <>
                {!portfolios && <div id="loading">
                    <p>Henter porteføljer, venligst vent...</p>
                </div>}

                {portfolios &&
                    <BrowserRouter>
                        <PortfolioContext.Provider value={{ portfolios, selectedPortfolio, setSelectedPortfolio: this.setSelectedPortfolio }}>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Home/>}></Route>
                                    <Route path="/overview" element={<Overview />}></Route>
                                    <Route path="/marketOverview" element={<MarketOverview />}></Route>
                                    <Route path="/order" element={<Order />}></Route>
                                </Routes>
                            </Layout>
                        </PortfolioContext.Provider>
                    </BrowserRouter>
                }
            </>
        );
    }
}
