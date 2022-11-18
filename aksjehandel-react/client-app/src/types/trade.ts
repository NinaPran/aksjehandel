export interface Trade {
    id: number;
    date: string;
    amount: number;
    price: number;
    companyId: number;
    companyName: string;
    buyerPortfolioId: number;
    sellerPortfolioId: number;
}