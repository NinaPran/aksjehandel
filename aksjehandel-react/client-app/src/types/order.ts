export interface ServerOrder {
    id: number;
    companyId: number;
    companyName: string;
    companySymbol: string;
    portfolioId: number;
    portfolioDisplayName: string;
    portfolioCash: number;
    type: "buy" | "sell";
    price: number;
    amount: number;
}
export interface NewOrder {
    companyId: number;
    portfolioId: number;
    type: "buy" | "sell";
    price: number;
    amount: number;
}
export interface EditOrder {
    id: number;
    price: number;
    amount: number;
}