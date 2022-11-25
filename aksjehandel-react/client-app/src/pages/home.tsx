import { Component, FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Container, Form, FormGroup } from 'reactstrap';
import { PortfolioSelect } from "../components/portfolio-select";
import { PortfolioContext } from "../context/portfolio-context";
import './home.css';


export const Home: FC = () => {
    return (
        <Container>
            <h1 className="header">Velkommen!</h1>
            <Form id="mainContent">
                <FormGroup>
                    <PortfolioSelect></PortfolioSelect>
                </FormGroup>

                <FormGroup>
                    <Link to="/new-order" className="btn btn-primary">Ny ordre</Link>
                </FormGroup>

                <FormGroup>
                    <Link to="/overview" className="btn btn-primary">Min oversikt</Link>
                </FormGroup>
            </Form>
        </Container>
    );
}