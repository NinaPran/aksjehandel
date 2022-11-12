import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Layout } from './Layout';
import { Home2 } from './pages/home2';
import { Portfolio } from './types/portfolio';

interface AppProps {
}

interface AppState {
    error: boolean;
    errorMessage?: string;
    loading: boolean;
    selectedPortfolio?: Portfolio;
    portfolios?: Portfolio[];
}

export class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            loading: true,
            error: false,
        }
    }
    render() {
        const { loading } = this.state;
        return (
            <>
                {loading && <div id="loading">
                    <p>Henter porteføljer, venligst vent...</p>
                </div>}

                {!loading &&
                    <BrowserRouter>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />}></Route>
                                <Route path="/home2" element={<Home2 />}></Route>
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                }
            </>
        );
    }
}
