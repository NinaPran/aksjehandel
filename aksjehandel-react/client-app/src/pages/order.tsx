import { Component, createRef, FC, PropsWithChildren } from "react";
import { create } from "ts-node";
import { CompanySelect } from "../components/company-select";
import { AmountInput } from "../components/order/amount-input";
import { PriceInput } from "../components/order/price-input";
import { PortfolioSelect } from "../components/portfolioSelect";
import { PortfolioContext } from "../context/portfolio-context";
import { Company } from "../types/company";
import { Order } from "../types/order";

interface OrderProps {
}

interface OrderState {
    error: boolean;
    errorText: string;
    amountError: string;
    selectedCompany?: Company;
    orderType: Order['type'];
}


{/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

export class OrderForm extends Component<OrderProps, OrderState> {
    amountInput = createRef<HTMLInputElement>();

    price: number = 0;
    priceValid: boolean = false;

    amount: number = 0;
    amountValid: boolean = false;

    constructor(props: OrderProps) {
        super(props);
        this.state = {
            error: false,
            errorText: "",
            amountError: "",
            orderType: "buy",
        }
    }

    setSelectedCompany = (company: Company) => {
        this.setState({ selectedCompany: company })
    }

    setOrderType = (orderType: Order["type"]) => {
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
        if (!getCurrentPortfolio()) {
            this.setState({ errorText: "Portfolio er ikke satt" });
            return false;
        }
        if (companySelectInput.val() === null) {
            this.setState({ errorText: "Selskap er ikke satt" });
            return false;
        }
        if (!validerAntall() || !validerPris()) {
            this.setState({ errorText: "Pris eller antall er ikke gyldig" });
            return false;
        }
        if (isBuyOrder()) {
            if (!validateEnoughPurchasePower()) {
                this.setState({ errorText: "Det disponible beløpet dekker ikke kjøpet, vennligst endre pris eller antall" });
                return false;
            }
        } else {
            if (!validateEnoughStocks()) {
                this.setState({ errorText: "Antall aksjer til dispoisjon for salg dekker ikke antall forsøkt solgt, vennligst endre antall" });
                return false;
            }
        }
        this.setState({ errorText: "" });
        return true;
    }

    registerOrder = () => {
        if (validateOrder()) {
            const portfolio = getCurrentPortfolio();
            const portfolioId = portfolio.id;
            const type = $('input[name=type]:checked');
            const price = $("#price");
            const amount = $("#amount");

            const order = {
                portfolioId: portfolioId,
                companyId: companySelect.val(),
                type: type.val(),
                price: price.val(),
                amount: amount.val()
            }

            const url = "stock/regOrder";
            $.post(url, order, function () {
                window.location.href = 'overview.html';
            })

                .fail(function (returnError) {
                    if (returnError.status == 401) {
                        window.location.href = 'signIn.html'
                    } else {
                        $("#error").html("Feil i db - prøv igjen senere");
                    }
                });
        };
    }

    render() {
        const { selectedCompany, orderType, amountError } = this.state;

        return (
            <PortfolioContext.Consumer>
                {({ selectedPortfolio }) => (
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
                                {/*<input type="button" id="reg" value="Registrer" onclick="regOrder()" className="btn btn-primary" />*/}
                            </div>

                            <div className="form-group">
                                <span style={{ color: "red" }}>{errorText}</span>
                                <div id="test"></div>
                            </div>

                        </form>
                    </div>
                )}
            </PortfolioContext.Consumer>
        );
    }
}