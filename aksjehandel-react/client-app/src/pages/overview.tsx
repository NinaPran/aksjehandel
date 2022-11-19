import { FC, PropsWithChildren } from "react";
import { PortfolioSelect } from "../components/portfolio-select";
import { ShareholdingTable } from "../components/shareholding-table";
import { OrderTable } from "../components/order-table";
import { PortfolioContext } from "../context/portfolio-context";
import { Portfolio } from "../types/portfolio";
import { Link } from "react-router-dom";
import { PurchasingPower } from "../components/purchasing-power";

// dette er en funksjonell komponent
export const Overview = () => {
    return (
        <PortfolioContext.Consumer>
            {({ selectedPortfolio }) => (
                <div className="container">
                    <h1>Min Oversikt</h1>

                    <PortfolioSelect />
                    {!selectedPortfolio &&
                        <h2>Venligst velg portfølje</h2>
                    }
                    {selectedPortfolio &&
                        <>
                            <h2>Disponibelt beløp</h2>
                            <PurchasingPower />

                            <h2>Dine aksjeposter </h2>
                            <ShareholdingTable selectedPortfolio={selectedPortfolio} />

                            <h2>Dine ordrer</h2>
                            <OrderTable selectedPortfolio={selectedPortfolio}></OrderTable>
                            <Link to="/new-order" className="btn btn-primary">Ny ordre</Link>

                        </>

                    }
                </div>
            )}
        </PortfolioContext.Consumer>
    );
}