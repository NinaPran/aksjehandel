export interface Order {
    id: number;
    companyId: number;
    companyName: string;
    companySymbol: string;
    portfolioId: number;
    portfolioDisplayName: string;
    portfolioCash: number;
    type: string;
    price: number;
    amount: number;
}