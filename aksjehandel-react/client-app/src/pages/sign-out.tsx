import { Component, FC, PropsWithChildren, useState } from "react";
import { Container } from 'reactstrap';

interface SignOutProps {
    onSignedIn: () => void;
}

export const SignOut: FC = () => {
    const [signOutError, setSignOutError] = useState("");

    fetch('stock/SignOut', {
        method: 'post'
    })
        .then(response => {
            console.log(response);
            if (response.status == 200) {
                window.location.assign("/");
            }
            else {
                setSignOutError("Feil ved utlogging, kontakt administrator");
            }

        })
        .catch(error => setSignOutError("Feil på server -prøv igjen senere")
        );

    return (

        <Container>
            <div className="form-group">
                <p>Signing you out...</p>
            </div>
        </Container>
    );


}