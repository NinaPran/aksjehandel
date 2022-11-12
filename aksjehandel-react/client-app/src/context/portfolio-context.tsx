import React from "react";
import { Portfolio } from "../types/portfolio";

export const PortfolioContext = React.createContext<PortfolioContextInterface>({
    selectedPortfolio: undefined,
    setSelectedPortfolio: () => { },
    portfolios: [],
})

export interface PortfolioContextInterface {
    selectedPortfolio?: Portfolio,
    setSelectedPortfolio: (portfolio: Portfolio) => void,
    portfolios: Portfolio[],
}

