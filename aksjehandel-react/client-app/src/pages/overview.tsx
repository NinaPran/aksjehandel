﻿import { FC, PropsWithChildren } from "react";
import { PortfolioSelect } from "../components/portfolioSelect";
import { ShareholdingTable } from "../components/shareholding-table";
import { PortfolioContext } from "../context/portfolio-context";
import { Portfolio } from "../types/portfolio";

interface OverviewProps {
}

interface OverviewState {
    error: boolean;
}

export const Overview: FC<PropsWithChildren> = (props) => {
    return (
        <PortfolioContext.Consumer>
            {({ portfolios, selectedPortfolio }) => (
                <div className="container">
                    <h1>Min Oversikt</h1>
                    {selectedPortfolio?.displayName}

                    <PortfolioSelect />
                    {!selectedPortfolio &&  
                        <h2>Venligst velg portfølje</h2>                    
                    }
                    {selectedPortfolio &&
                        <>
                            <h2>Disponibelt beløp</h2>
                            <div>{selectedPortfolio?.purchasingPower}</div>

                            <h2>Dine aksjeposter </h2>
                            <ShareholdingTable selectedPortfolio={selectedPortfolio} />

                            <h2>Dine ordrer</h2>
                            <a href="order.html" className="btn btn-primary">Ny ordre</a>
                            <div id="orderContainer"></div>
                            <div id="errorOrder"></div>
                        </>

                    }
                </div>
            )}
        </PortfolioContext.Consumer>
    );
}