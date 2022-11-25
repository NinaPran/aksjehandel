import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Layout } from './layout';
import { Portfolio } from './types/portfolio';
import { Overview } from './pages/overview';
import { MarketOverview } from './pages/market-overview';
import { NewOrderPage } from './pages/new-order';
import { PortfolioContext } from './context/portfolio-context';
import { Company } from './types/company';
import { CompanyContext } from './context/company-context';
import { EditOrderPage } from './pages/edit-order';
import { SignOut } from './pages/sign-out';

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
                    <p>Henter resurser, venligst vent...</p>
                </div>}                
                {portfolios && companies &&
                    <BrowserRouter>
                        <PortfolioContext.Provider value={{ portfolios, selectedPortfolio, setSelectedPortfolio: this.setSelectedPortfolio }}>
                            <CompanyContext.Provider value={{ companies }}>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Home />}></Route>
                                        <Route path="/overview" element={<Overview />}></Route>
                                        <Route path="/market-overview" element={<MarketOverview />}></Route>
                                        <Route path="/new-order" element={<NewOrderPage />}></Route>
                                        <Route path="/edit-order" element={<EditOrderPage />}></Route>
                                        <Route path="/sign-out" element={<SignOut />}></Route>
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
