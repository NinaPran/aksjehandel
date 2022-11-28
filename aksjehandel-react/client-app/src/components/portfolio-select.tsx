import React, { Component, FC, PropsWithChildren, useContext } from "react";
import { Container } from 'reactstrap';
import { PortfolioContext } from "../context/portfolio-context";
import { Portfolio } from "../types/portfolio";


interface PortfolioSelectProps {
    disabled?: boolean;
}

export const PortfolioSelect: FC<PortfolioSelectProps> = (props) => {
    const disabled = props.disabled === true;
    const portfolioContext = useContext(PortfolioContext);
    const { portfolios, setSelectedPortfolio, selectedPortfolio } = portfolioContext;

    const onPortfolioChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const portfolioIndex = Number(event.target.value);
        const newPortfolio = portfolios[portfolioIndex];
        if (selectedPortfolio !== newPortfolio) {
            setSelectedPortfolio(newPortfolio);
        }
    }
    const selectedPortfolioIndex = selectedPortfolio ? portfolios.indexOf(selectedPortfolio) : -1;

    return (

        <Container>
            <div>
                <label htmlFor="portfolioSelect">Portefølje</label>
                <select className="form-control" disabled={disabled} name="portfolioSelect" value={selectedPortfolioIndex} onChange={onPortfolioChange}>
                    <option key="-1" value="-1" disabled hidden>Velg portefølje</option>
                    {portfolios?.map((portfolio, index) => <option key={portfolio.id} value={index}>{portfolio.displayName}</option>)}
                </select>
            </div>
        </Container>
    );


}