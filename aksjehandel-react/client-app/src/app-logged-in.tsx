import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Layout } from './Layout';
import { Portfolio } from './types/portfolio';
import { Overview } from './pages/overview';
import { MarketOverview } from './pages/marketOverview';
import { NewOrderPage } from './pages/new-order';
import { PortfolioContext } from './context/portfolio-context';
import { Company } from './types/company';
import { CompanyContext } from './context/company-context';

interface AppProps {
}

interface AppState {
    error: boolean;
    errorMessage?: string;
    selectedPortfolio?: Portfolio;
    portfolios?: Portfolio[];
    companies?: Company[];
}

export class AppLoggedIn extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            error: false,
        }
    }

    componentDidMount() {
        this.fetchCompanies();
        fetch('stock/getAllPortfolios')
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    portfolios: response,
                })
            })
            .catch(error => this.setState({
                error: true
            }));
    }

    fetchCompanies = () => {
        fetch("stock/getAllCompanies")
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    companies: response,
                })
            })
            .catch(error => this.setState({
                error: true
            }));
    }

    setSelectedPortfolio = (portfolio: Portfolio) => {
        this.setState({ selectedPortfolio: portfolio })
    }

    render() {
        const { portfolios, companies, selectedPortfolio } = this.state;
        return (
            <>
                {(!portfolios || !companies) && <div id="loading">
                    <p>Henter porteføljer og selskap, venligst vent...</p>
                </div>}

                {portfolios && companies &&
                    <BrowserRouter>
                        <PortfolioContext.Provider value={{ portfolios, selectedPortfolio, setSelectedPortfolio: this.setSelectedPortfolio }}>
                            <CompanyContext.Provider value={{ companies }}>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Home />}></Route>
                                        <Route path="/overview" element={<Overview />}></Route>
                                        <Route path="/marketOverview" element={<MarketOverview />}></Route>
                                        <Route path="/new-order" element={<NewOrderPage />}></Route>
                                    </Routes>
                                </Layout>
                            </CompanyContext.Provider>
                        </PortfolioContext.Provider>
                    </BrowserRouter>
                }
            </>
        );
    }
}
