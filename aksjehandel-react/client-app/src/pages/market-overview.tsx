import { FC, PropsWithChildren } from "react";
import { CompanyTable } from "../components/company-table";
import { TradeTable } from "../components/trade-table";
import { Form, FormGroup } from 'reactstrap';
import { CompanyContext } from "../context/company-context";

export const MarketOverview: FC = () => {
    console.log("MarketOverview")
    return (
        <>
            <div className="container">
                <Form>
                    <h1 className="header">Markedsoversikt</h1>

                    <FormGroup>
                        <h2>Selskaper</h2>
                        <CompanyTable />
                    </FormGroup>

                    <FormGroup>
                        <h2>Utførte handler</h2>
                        <TradeTable />
                    </FormGroup>

                </Form>
            </div>
        </>
    );
}