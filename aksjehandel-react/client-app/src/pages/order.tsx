import React, { Component, createRef, FC, PropsWithChildren } from "react";
import { redirect } from "react-router-dom";
import { create } from "ts-node";
import { CompanySelect } from "../components/company-select";
import { AmountInput } from "../components/order/amount-input";
import { PriceInput } from "../components/order/price-input";
import { PortfolioSelect } from "../components/portfolio-select";
import { PortfolioContext } from "../context/portfolio-context";
import { Company } from "../types/company";
import { NewOrder, ServerOrder } from "../types/order";
import { Shareholding } from "../types/shareholding";

interface OrderProps {
}

interface OrderState {
    error: boolean;
    errorText: string;
    amountError: string;
    selectedCompany?: Company;
    orderType: ServerOrder['type'];
    shareholdings: Shareholding[];
}


{/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

export class OrderForm extends Component<OrderProps, OrderState> {
    static contextType = PortfolioContext;
    declare context: React.ContextType<typeof PortfolioContext>;

    amountInput = createRef<HTMLInputElement>();

    price: number = 0;
    priceValid: boolean = false;

    amount: number = 0;
    amountValid: boolean = false;
    selectedPortfolioId: number = -1;
    isFetchingShareholdings: boolean = false;

    constructor(props: OrderProps) {
        super(props);
        this.state = {
            error: false,
            errorText: "",
            amountError: "",
            orderType: "buy",
            shareholdings: []
        }
    }

    setSelectedCompany = (company: Company) => {
        this.setState({ selectedCompany: company })
    }

    setOrderType = (orderType: ServerOrder["type"]) => {
        this.setState({ orderType: orderType })
    }

    onPriceChange = (price: number, priceValid: boolean) => {
        this.price = price;
        this.priceValid = priceValid;
    }

    onAmountChange = (amount: number, amountValid: boolean) => {
        this.amount = amount;
        this.amountValid = amountValid;
    }

    validateOrder = () => {
        if (!this.context.selectedPortfolio) {
            this.setState({ errorText: "Portfolio er ikke satt" });
            return false;
        }
        if (!this.setSelectedCompany) {
            this.setState({ errorText: "Selskap er ikke satt" });
            return false;
        }
        if (!this.amountValid || !this.priceValid) {
            this.setState({ errorText: "Pris eller antall er ikke gyldig" });
            return false;
        }
        if (this.state.orderType === "buy") {
            if (!this.validateEnoughPurchasePower()) {
                this.setState({ errorText: "Det disponible beløpet dekker ikke kjøpet, vennligst endre pris eller antall" });
                return false;
            }
        } else {
            if (!this.validateEnoughStocks()) {
                this.setState({ errorText: "Antall aksjer til dispoisjon for salg dekker ikke antall forsøkt solgt, vennligst endre antall" });
                return false;
            }
        }
        this.setState({ errorText: "" });
        return true;
    }

    validateEnoughPurchasePower = () => {
        const purchasePower = this.context.selectedPortfolio?.purchasingPower || 0;
        if ((purchasePower - (this.price * this.amount) < 0)) {
            return false;
        } else {
            return true;
        }
    }
    componentDidMount() {
        this.selectedPortfolioId = this.context.selectedPortfolio?.id ?? -1;
        if (this.selectedPortfolioId >= 0) {
            this.getOwnedShareholdings(this.selectedPortfolioId);
        }
    }

    componentDidUpdate() {
        const currentSelectedPortfolioId = this.context.selectedPortfolio?.id ?? -1;
        if (this.selectedPortfolioId !== currentSelectedPortfolioId) {
            this.selectedPortfolioId = currentSelectedPortfolioId;
            this.getOwnedShareholdings(this.selectedPortfolioId);

        }

    }

    getOwnedShareholdings = (portfolioId: number) => {

        this.isFetchingShareholdings = true;
        fetch("stock/getAllShareholdings?portfolioId=" + portfolioId)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    shareholdings: response,
                });
                this.isFetchingShareholdings = false;
            })
            .catch(error => {
                this.setState({
                    shareholdings: [],
                    error: true
                });

                this.isFetchingShareholdings = false;
            });
    }



    validateEnoughStocks = () => {
        const companyId = this.state.selectedCompany?.id;
        const amountSell = this.amount;
        const ownedShareholdings = this.state.shareholdings;
        if (companyId === undefined || ownedShareholdings.length === 0) {
            return false;
        }

        for (var i = 0; i < ownedShareholdings.length; i++) {
            const shareholding = ownedShareholdings[i];
            if (shareholding.companyId === companyId) {
                return amountSell <= shareholding.remainingAmount;
            }
        }
        return false;
    }

    registerOrder = () => {
        if (this.validateOrder()) {
            const portfolioId = this.selectedPortfolioId;
            const { selectedCompany, orderType } = this.state;

            const order: NewOrder = {
                portfolioId: portfolioId,
                companyId: selectedCompany?.id ?? -1,
                type: orderType,
                price: this.price,
                amount: this.amount
            }

            fetch('stock/regOrder', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            })
                .then(response => {
                    if (response.ok) {
                        return redirect('/overview');
                    }
                    else {
                        this.setState({
                            error: true,
                            errorText: "Feil ved registrering av ordre, noe er ugyldig"
                        });

                    }
                })
                .catch(error => {
                    this.setState({
                        errorText: "Feil på server -prøv igjen senere",
                        error: true
                    });

                    this.isFetchingShareholdings = false;
                });
        };
    }


    render() {
        const { selectedCompany, orderType, errorText } = this.state;
        const selectedPortfolio = this.context.selectedPortfolio;

        return (
            <div className="container">
                <h1>Lag en ny ordre</h1>
                <form className="form">

                    <h2>Disponibelt beløp</h2>
                    <div>{selectedPortfolio?.purchasingPower}</div>

                    <PortfolioSelect />

                    <CompanySelect selectedCompany={selectedCompany} setSelectedCompany={this.setSelectedCompany} />

                    <div>
                        <label>Type</label>
                        <div form-group>
                            <input checked={orderType === "buy"} type="radio" id="type-buy" name="type" value="buy" onClick={() => this.setOrderType("buy")} />
                            <label htmlFor="buy">Kjøp</label>
                        </div>
                        <div form-group>
                            <input checked={orderType === "sell"} type="radio" id="type-sell" name="type" value="sell" onClick={() => this.setOrderType("sell")} />
                            <label htmlFor="sell">Salg</label>
                        </div>
                    </div>

                    <PriceInput onPriceSet={(price,) => { }} />

                    <AmountInput onAmountSet={(amount,) => { }} />

                    <div className="form-group">
                        <input type="button" id="reg" value="Registrer" onClick={this.registerOrder} className="btn btn-primary" />
                    </div>

                    <div className="form-group">
                        <span style={{ color: "red" }}>{errorText}</span>
                        <div id="test"></div>
                    </div>
                </form>
            </div>
        );
    }
}