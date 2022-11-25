﻿import React, { Component, createRef, PropsWithChildren, useRef } from "react";
import { Container } from 'reactstrap';
import { Portfolio } from "../types/portfolio";


interface SignInProps {
    onSignedIn: () => void;
}

interface SignInState {
    usernameError: string;
    passwordError: string;
    signInError: string;

}

export class SignIn extends Component<SignInProps, SignInState> {
    usernameref = createRef<HTMLInputElement>();
    passwordref = createRef<HTMLInputElement>();
    constructor(props: SignInProps) {
        super(props);
        this.state = {
            usernameError: "",
            passwordError: "",
            signInError: "",
        }
    }

    loginclick = () => {
        const usernameOk = this.validateUser();
        const passwordOk = this.validatePassword();

        if (usernameOk && passwordOk) {
            const username = this.usernameref.current?.value || '';
            const password = this.passwordref.current?.value || '';
            const searchParams = new URLSearchParams();
            searchParams.append('username', username);
            searchParams.append('password', password);
            this.setState({
                signInError: ""
            })
            fetch('stock/SignIn', {
                method: 'post',
                body: searchParams
            })
                .then(response => {
                    console.log(response);
                    if (response.status == 200) {
                        this.props.onSignedIn();
                    }
                    else {
                        this.setState({
                            signInError: "Feil brukernavn eller passord"
                        })
                    }

                })
                .catch(error => this.setState({
                    signInError: "Feil på server -prøv igjen senere"
                }));
        }
    }

    validateUser = () => {
        const regexp = /^[a-zA-ZæøåÆØÅ\.\-]{2,20}$/;
        const ok = regexp.test(this.usernameref.current?.value || "");
        if (!ok) {
            this.setState({ usernameError: "Brukernavnet må bestå av 2 til 20 bokstaver" });
            return false;
        }
        else {
            this.setState({ usernameError: "" });
            return true;
        }

    }

    validatePassword = () => {
        const regexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const ok = regexp.test(this.passwordref.current?.value || "");
        if (!ok) {
            this.setState({ passwordError: "Passordet må bestå av minimum 6 tegn, minst en bokstav og et tall" });
            return false;
        }
        else {
            this.setState({ passwordError: "" });
            return true;
        }

    }


    render() {
        const { } = this.props;
        const { usernameError, passwordError, signInError } = this.state;

        return (
            <div className="container">
                <h1 style={{ marginBottom: "30px" }}>Logg inn</h1>
                <form className="form">
                    <div className="form-group">
                        <label>Brukernavn</label>
                        <input ref={this.usernameref} onChange={this.validateUser} type="text" />
                        <span style={{ color: "red" }}>{usernameError}</span>
                    </div>
                    <div className="form-group">
                        <label>Passord</label>
                        <input ref={this.passwordref} onChange={this.validatePassword} type="password" />
                        <span style={{ color: "red" }}>{passwordError}</span>
                    </div>
                    <div className="form-group">
                        <input type="button" value="Logg inn" onClick={this.loginclick} className="btn btn-primary" />
                    </div>
                    <div style={{ color: "red" }}>{signInError}</div>
                </form>
            </div>
        );
    }

}