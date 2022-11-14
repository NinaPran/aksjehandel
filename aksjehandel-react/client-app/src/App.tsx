import { Component } from 'react';
import './App.css';
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
