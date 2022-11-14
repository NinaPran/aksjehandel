export interface Order {
    id: number;
    companyId: number;
    companyName: string;
    companySymbol: string;
    portfolioId: number;
    portfolioDisplayName: string;
    portfolioCash: number;
    type: "buy"|"sell";
    price: number;
    amount: number;
}