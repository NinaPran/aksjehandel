import React, { Component, PropsWithChildren } from "react";
import { Container } from 'reactstrap';
import { Portfolio } from "../types/portfolio";


interface PortfolioSelectProps {
    //portfolio?: Portfolio;
}

interface PortfolioSelectState {
    loading: boolean;
    error: boolean;
    portfolio?: Portfolio;
    portfolios?: Portfolio[];
}

export class PortfolioSelect extends Component<PortfolioSelectProps, PortfolioSelectState> {
    constructor(props: PortfolioSelectProps) {
        super(props);
        this.state = {
            loading: true,
            error: false,
        }
    }
    buttonclick = () => {
        this.setState({
            loading: false,
        })
    }
    componentDidMount() {
        fetch('stock/getAllPortfolios')
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    portfolios: response,
                    loading: false
                })
            })
            .catch(error => this.setState({
                loading: false,
                error: true
            }));
    }

    test = (event: unknown) => {
        console.log(event);

    }

    render() {
        const { loading, portfolio, portfolios } = this.state;
        const portfolioId = portfolio?.id;

        return (
            <Container>
                <div className="form-group">
                    <label htmlFor="portfolioSelect">Portefølje</label>
                    <select className="form-control" name="portfolioSelect">
                        <option value="" disabled selected hidden>Velg portefølje</option>
                        {portfolios?.map((portfolio) => <option onClick={() => this.test(portfolio)} value={portfolio.id}>{portfolio.displayName}</option>)}
                    </select>
                </div>
            </Container>
        );
    }

}