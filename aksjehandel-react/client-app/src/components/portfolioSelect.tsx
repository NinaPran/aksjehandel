import React, { Component, PropsWithChildren } from "react";
import { Container } from 'reactstrap';
import { PortfolioContext } from "../context/portfolio-context";
import { Portfolio } from "../types/portfolio";


interface PortfolioSelectProps {
}

interface PortfolioSelectState {
}

export class PortfolioSelect extends Component<PortfolioSelectProps, PortfolioSelectState> {

    render() {
        return (
            <PortfolioContext.Consumer>
                {({ portfolios, setSelectedPortfolio, selectedPortfolio }) => (
                    <Container>
                        <div className="form-group">
                            <label htmlFor="portfolioSelect">Portefølje</label>
                            <select className="form-control" name="portfolioSelect">
                                <option value="" disabled selected={!selectedPortfolio} hidden>Velg portefølje</option>
                                {portfolios?.map((portfolio) => <option selected={selectedPortfolio == portfolio} onClick={() => setSelectedPortfolio(portfolio)} value={portfolio.id}>{portfolio.displayName}</option>)}
                            </select>
                        </div>
                    </Container>
                )}
            </PortfolioContext.Consumer>
        );
    }

}