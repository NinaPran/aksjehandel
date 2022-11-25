import { Component, PropsWithChildren } from "react";
import { Container, Form, FormGroup } from 'reactstrap';
import { PortfolioSelect } from "../components/portfolio-select";
import { PortfolioContext } from "../context/portfolio-context";
import './home.css';



interface HomeProps {
}

interface HomeState {
    loading: boolean;
    error: boolean;
}

export class Home extends Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            loading: false,
            error: false,
        }
    }

    render() {
        return (
            <Container>
                <h1 style={{ marginBottom: "30px" }}>Velkommen!</h1>
                <Form id="mainContent">
                    <FormGroup>
                        <PortfolioSelect></PortfolioSelect>
                    </FormGroup>

                    <FormGroup>
                        <button className="btn btn-primary">Ny ordre</button>
                    </FormGroup>

                    <FormGroup>
                        <button className="btn btn-primary" >Min oversikt</button>
                    </FormGroup>
                </Form>
            </Container>
        );
    }

}