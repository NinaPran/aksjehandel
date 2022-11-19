import { Component, PropsWithChildren } from "react";
import { Container } from 'reactstrap';
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
                <h1>Velkommen!</h1>
                <div id="mainContent">
                    <PortfolioSelect></PortfolioSelect>
                    <div className="form-group">
                        <button className="btn btn-primary">Ny ordre</button>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" >Min oversikt</button>
                    </div>
                    <div className="form-group">
                        <a href="market-overview.html" className="btn btn-primary">Markedsoversikt</a>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Logg ut</button>
                    </div>
                </div>
            </Container>
        );
    }

}