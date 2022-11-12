import { Component, PropsWithChildren } from "react";
import { Container } from 'reactstrap';
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
            loading: true,
            error: false,
        }
    }
    buttonclick = () => {
        this.setState({
            loading: false,
            portfolio: { Id: 5}
        })
    }
    componentDidMount() {
        fetch('stock/getAllPortfolios')
            .then(response => response.json())
            .then(response => this.setState({
                portfolios: response.results,
                loading: false
            }))
            .catch(error => this.setState({
                loading: false,
                error: true
            }));
    }

    render() {
        const { loading, portfolio } = this.state;
        const portfolioId = portfolio?.Id;

        return (
            <Container>
                <h1>Velkommen!</h1>{portfolioId}
                <button onClick={this.buttonclick}>TEST</button>
                {loading && <div id="loading">
                    <p>Henter porteføljer, venligst vent...</p>
                </div>}
                {!loading &&
                    <div id="mainContent">
                        <div className="form-group">
                            <label htmlFor="portfolioSelect">Portefølje</label>
                            <select className="form-control" name="portfolioSelect" id="portfolioSelect">
                                <option value="" disabled selected hidden>Velg portefølje</option>
                            </select>
                        </div>
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