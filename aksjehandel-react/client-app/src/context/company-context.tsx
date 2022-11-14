import React from "react";
import { Company } from "../types/company";

export const CompanyContext = React.createContext<CompanyContextInterface>({
    companies: [],
})

export interface CompanyContextInterface {
    companies: Company[],
}

