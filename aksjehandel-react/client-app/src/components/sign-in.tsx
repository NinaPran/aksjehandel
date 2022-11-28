import React, { Component, createRef, FC, PropsWithChildren, useRef, useState } from "react";
import { Container } from 'reactstrap';
import { Portfolio } from "../types/portfolio";
import { Form, FormGroup } from 'reactstrap';


interface SignInProps {
    onSignedIn: () => void;
}

export const SignIn: FC<SignInProps> = (props) => {
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [signInError, setSignInError] = useState("");

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


    const loginclick = () => {
        const usernameOk = validateUser();
        const passwordOk = validatePassword();

        if (usernameOk && passwordOk) {
            const username = usernameRef.current?.value || '';
            const password = passwordRef.current?.value || '';
            const searchParams = new URLSearchParams();
            searchParams.append('username', username);
            searchParams.append('password', password);

            setSignInError("");

            fetch('stock/SignIn', {
                method: 'post',
                body: searchParams
            })
                .then(response => response.json())
                .then(response => {
                    if (response == true) {
                        props.onSignedIn();
                    }
                    else {
                        setSignInError("Feil brukernavn eller passord");
                    }

                })
                .catch(error => {
                    setSignInError("Feil på server -prøv igjen senere");
                });
        }
    }

    const validateUser = () => {
        const regexp = /^[a-zA-ZæøåÆØÅ\.\-]{2,20}$/;
        const usernameValue = usernameRef.current?.value || "";
        const ok = regexp.test(usernameValue);

        if (!ok) {
            setUsernameError("Brukernavnet må bestå av 2 til 20 bokstaver");
            return false;
        }
        else {
            setUsernameError("");
            return true;
        }

    }

    const validatePassword = () => {
        const regexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const passwordValue = passwordRef.current?.value || "";
        const ok = regexp.test(passwordValue);

        if (!ok) {
            setPasswordError("Passordet må bestå av minimum 6 tegn, minst en bokstav og et tall");
            return false;
        }
        else {
            setPasswordError("");
            return true;
        }

    }
    return (
        <div className="container">
            <h1 className="header" style={{ marginTop: "30px" }}>Logg inn</h1>
            <Form>

                <FormGroup>
                    <label style={{ marginRight: "10px" }}>Brukernavn</label>
                    <input onChange={validateUser} type="text" ref={usernameRef} />
                    <span style={{ color: "red" }}>{usernameError}</span>
                </FormGroup>

                <FormGroup>
                    <label style={{ marginRight: "34px" }}>Passord</label>
                    <input onChange={validatePassword} type="password" ref={passwordRef} />
                    <span style={{ color: "red" }}>{passwordError}</span>
                </FormGroup>

                <FormGroup>
                    <input type="button" value="Logg inn" onClick={loginclick} className="btn btn-primary" />
                </FormGroup>

                <div style={{ color: "red" }}>{signInError}</div>

            </Form>
        </div>
    );
}
