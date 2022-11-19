import { FC, useState } from 'react';
import './app.css';
import { AppLoggedIn } from './app-logged-in';
import { SignIn } from './components/sign-in';

export const App: FC = () => {
    const [signedIn, setSignedIn] = useState(false);
    const [hasCheckedSignIn, setHasCheckedSignIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    if (!hasCheckedSignIn) {
        fetch('stock/TestValidSession', {
            method: 'post'
        })
            .then(response => {
                if (response.status == 200) {
                    setSignedIn(true);
                }
                setHasCheckedSignIn(true);

            })
            .catch(error => setErrorMessage("Feil på server -prøv igjen senere")
            );
    }

    return (
        <>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

            {hasCheckedSignIn && !signedIn &&
                <SignIn onSignedIn={() => setSignedIn(true)}></SignIn>
            }

            {hasCheckedSignIn && signedIn &&
                <AppLoggedIn />
            }
        </>
    );
}

