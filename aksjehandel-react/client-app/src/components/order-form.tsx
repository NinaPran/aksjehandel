import React, { Component, createRef, FC, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { create } from "ts-node";
import { CompanySelect } from "../components/company-select";
import { AmountInput } from "../components/order/amount-input";
import { PriceInput } from "../components/order/price-input";
import { PortfolioSelect } from "../components/portfolio-select";
import { PortfolioContext } from "../context/portfolio-context";
import { Company } from "../types/company";
import { NewOrder, ServerOrder } from "../types/order";
import { Shareholding } from "../types/shareholding";


interface OrderFormProps {
    orderType?: NewOrder["type"],
    company?: Company;
} {/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

//export class OrderForm extends Component<OrderProps, OrderState> {
export const OrderForm = (props: OrderFormProps) => {
    const navigate = useNavigate();
    const portfolioContext = useContext(PortfolioContext);

    const [price, setPrice] = useState(0);
    const [priceValid, setPriceValid] = useState(false);

    const [selectedPortfolioId, setSelectedPortfolioId] = useState(-1);

    const [amount, setAmount] = useState(0);
    const [amountValid, setAmountValid] = useState(false);

    //TODO konverter til useState
    let isFetchingShareholdings: boolean = false;

    const [error, setError] = useState(false);

    const [errorText, setErrorText] = useState("");

    const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(undefined);

    const [orderType, setOrderType] = useState<NewOrder["type"]>(props.orderType || "buy");
    const [shareholdings, setShareholdings] = useState<Shareholding[]>([]);


    const onPriceChange = (price: number, priceValid: boolean) => {
        setPrice(price);
        setPriceValid(priceValid);
    }

    const onAmountChange = (amount: number, amountValid: boolean) => {
        setAmount(amount);
        setAmountValid(amountValid);
    }

    const validateOrder = () => {
        if (!portfolioContext.selectedPortfolio) {
            setErrorText("Portfolio er ikke satt");
            return false;
        }
        if (!selectedCompany) {
            setErrorText("Selskap er ikke satt");
            return false;
        }
        if (!amountValid || !priceValid) {
            setErrorText("Pris eller antall er ikke gyldig");
            return false;
        }
        if (orderType === "buy") {
            if (!validateEnoughPurchasePower()) {
                setErrorText("Det disponible beløpet dekker ikke kjøpet, vennligst endre pris eller antall");
                return false;
            }
        } else {
            if (!validateEnoughStocks()) {
                setErrorText("Antall aksjer til dispoisjon for salg dekker ikke antall forsøkt solgt, vennligst endre antall");
                return false;
            }
        }
        setErrorText("");
        return true;
    }

    const validateEnoughPurchasePower = () => {
        const purchasePower = portfolioContext.selectedPortfolio?.purchasingPower || 0;
        if ((purchasePower - (price * amount) < 0)) {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        const currentSelectedPortfolioId = portfolioContext.selectedPortfolio?.id ?? -1;
        if (selectedPortfolioId !== currentSelectedPortfolioId) {
            setSelectedPortfolioId(currentSelectedPortfolioId);
            getOwnedShareholdings(selectedPortfolioId);

        }
    })

    const getOwnedShareholdings = (portfolioId: number) => {

        isFetchingShareholdings = true;
        fetch("stock/getAllShareholdings?portfolioId=" + portfolioId)
            .then(response => response.json())
            .then(response => {
                setShareholdings(response);
                isFetchingShareholdings = false;
            })
            .catch(error => {
                setShareholdings([]);
                setError(true);

                isFetchingShareholdings = false;
            });
    }



    const validateEnoughStocks = () => {
        const companyId = selectedCompany?.id;
        const amountSell = amount;
        const ownedShareholdings = shareholdings;
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

    const registerOrder = () => {
        if (validateOrder()) {
            const portfolioId = selectedPortfolioId;

            const order: NewOrder = {
                portfolioId: portfolioId,
                companyId: selectedCompany?.id ?? -1,
                type: orderType,
                price: price,
                amount: amount
            }

            fetch('stock/regOrder', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            })
                .then(response => {
                    if (response.ok) {
                        navigate('/overview');
                        //return redirect('/overview');
                    }
                    else {
                        setError(true);
                        setErrorText("Feil ved registrering av ordre, noe er ugyldig");

                    }
                })
                .catch(error => {
                    setError(true);
                    setErrorText("Feil på server -prøv igjen senere");

                    isFetchingShareholdings = false;
                });
        };
    }


    const selectedPortfolio = portfolioContext.selectedPortfolio;

    return (
        <form className="form">

            <h2>Disponibelt beløp</h2>
            <div>{selectedPortfolio?.purchasingPower}</div>

            <PortfolioSelect />

            <CompanySelect selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />

            <div>
                <label>Type</label>
                <div form-group>
                    <input checked={orderType === "buy"} type="radio" id="type-buy" name="type" value="buy" onClick={() => setOrderType("buy")} />
                    <label htmlFor="buy">Kjøp</label>
                </div>
                <div form-group>
                    <input checked={orderType === "sell"} type="radio" id="type-sell" name="type" value="sell" onClick={() => setOrderType("sell")} />
                    <label htmlFor="sell">Salg</label>
                </div>
            </div>

            <PriceInput onPriceSet={onPriceChange} />

            <AmountInput onAmountSet={onAmountChange} />

            <div className="form-group">
                <input type="button" id="reg" value="Registrer" onClick={registerOrder} className="btn btn-primary" />
            </div>

            <div className="form-group">
                <span style={{ color: "red" }}>{errorText}</span>
                <div id="test"></div>
            </div>
        </form>
    );
}