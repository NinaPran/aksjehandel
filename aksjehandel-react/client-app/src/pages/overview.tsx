import { FC, PropsWithChildren } from "react";
import { PortfolioSelect } from "../components/portfolio-select";
import { ShareholdingTable } from "../components/shareholding-table";
import { OrderTable } from "../components/order-table";
import { Form, FormGroup } from 'reactstrap';
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
                    <h1 className="header">Min Oversikt</h1>
                    <Form>

                        <FormGroup>
                            <PortfolioSelect />
                        </FormGroup>

                        {!selectedPortfolio &&
                            <FormGroup>
                                <div style={{ color: "red" }}> Venligst velg portefølje!</div>
                            </FormGroup>
                        }

                        {selectedPortfolio &&
                            <>
                                <FormGroup className="borderbox">
                                <div className="underlinetext">Disponibelt beløp</div>
                                    <PurchasingPower />
                                </FormGroup>

                                <FormGroup>
                                    <h2>Dine aksjeposter </h2>
                                    <ShareholdingTable selectedPortfolio={selectedPortfolio} />
                                </FormGroup>

                                <FormGroup>
                                    <h2>Dine ordrer</h2>
                                    <OrderTable></OrderTable>
                                </FormGroup>

                            </>

                        }
                    </Form>
                </div>
            )}
        </PortfolioContext.Consumer>
    );
}