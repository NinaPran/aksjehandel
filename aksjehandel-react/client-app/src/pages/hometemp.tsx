import { Component, PropsWithChildren } from "react";
import { Container } from 'reactstrap';
import { PortfolioSelect } from "../components/portfolioSelect";
import { Portfolio } from "../types/portfolio";
import './home.css';



interface HomeProps {
    //portfolio?: Portfolio;
}

interface HomeState {
    loading: boolean;
    error: boolean;
    portfolio?: Portfolio;
    portfolios?: Portfolio[];
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
        const { loading, portfolio } = this.state;
        const portfolioId = portfolio?.id;

        return (
            <Container>
                <h1>Velkommen!</h1>{portfolioId}
                {loading && <div id="loading">
                    <p>Henter porteføljer, venligst vent...</p>
                </div>}
                {!loading &&
                    <div id="mainContent">
                        <PortfolioSelect></PortfolioSelect>
                        <div className="form-group">
                            <button className="btn btn-primary">Ny ordre</button>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" >Min oversikt</button>
                        </div>
                        <div className="form-group">
                            <a href="marketOverview.html" className="btn btn-primary">Markedsoversikt</a>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Logg ut</button>
                        </div>
                    </div>
                }
            </Container>
        );
    }
  
}