import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/home';
import { Layout } from './Layout';
import { Portfolio } from './types/portfolio';
import { Overview } from './pages/overview';
import { MarketOverview } from './pages/marketOverview';
import { OrderForm } from './pages/order';
import { AppLoggedIn } from './app-logged-in';
import { SignIn } from './components/sign-in';

interface AppProps {
}

interface AppState {
    error: boolean;
    errorMessage?: string;
    signedIn: boolean;
}

export class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            error: false,
            signedIn: false,
        }
    }

    render() {
        const { signedIn } = this.state;
        return (
            <>
                {!signedIn &&
                    <SignIn onSignedIn={() => this.setState({ signedIn: true })}></SignIn>
                }

                {signedIn &&
                    <AppLoggedIn/>
                }
            </>
        );
    }
}
