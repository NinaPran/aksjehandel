import { FC, PropsWithChildren } from "react";
import { CompanyTable } from "../components/company-table";
import { TradeTable } from "../components/trade-table";
import { CompanyContext } from "../context/company-context";

export const MarketOverview: FC = () => {
    return (
                <>
                    <h1>Markedsoversikt</h1>
                    <CompanyTable/>

                    <h2>Utførte handler</h2>
                    <TradeTable />
                 </>
    );
}