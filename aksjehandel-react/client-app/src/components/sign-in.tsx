import React, { Component, createRef, FC, PropsWithChildren, useRef, useState } from "react";
import { Container } from 'reactstrap';
import { Portfolio } from "../types/portfolio";
import { Form, FormGroup } from 'reactstrap';


interface SignInProps {
    onSignedIn: () => void;
}

interface validateUserProps {
    onUserValid: () => boolean;
}

export const SignIn: FC<SignInProps> = (props) => {
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [signInError, setSignInError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const loginclick = (e: any) => {
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

    const validateUser = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
        const regexp = /^[a-zA-ZæøåÆØÅ\.\-]{2,20}$/;
        const ok = event && regexp.test(event.target.value || "");

        if (!ok) {
            setUsernameError("Brukernavnet må bestå av 2 til 20 bokstaver");
            return false;
        }
        else {
            setUsernameError("");
            setUsername(event.target.value);
            return true;
        }

    }

    const validatePassword = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
        const regexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const ok = event && regexp.test(event.target.value || "");

        if (!ok) {
            setPasswordError("Passordet må bestå av minimum 6 tegn, minst en bokstav og et tall");
            return false;
        }
        else {
            setPasswordError("");
            setPassword(event.target.value);
            return true;
        }

    }
    return (
        <div className="container">
            <h1 className="header" style={{ marginTop: "30px" }}>Logg inn</h1>
            <Form>

                <FormGroup>
                    <label style={{ marginRight: "10px" }}>Brukernavn</label>
                    <input onChange={validateUser} type="text" />
                    <span style={{ color: "red" }}>{usernameError}</span>
                </FormGroup>

                <FormGroup>
                    <label style={{ marginRight: "34px" }}>Passord</label>
                    <input onChange={validatePassword} type="password" />
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
