import React, { Component, createRef, FC, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { create } from "ts-node";
import { Form, FormGroup } from 'reactstrap';
import { CompanySelect } from "../components/company-select";
import { AmountInput } from "../components/order/amount-input";
import { PriceInput } from "../components/order/price-input";
import { PortfolioSelect } from "../components/portfolio-select";
import { PortfolioContext } from "../context/portfolio-context";
import { Company } from "../types/company";
import { EditOrder, NewOrder, ServerOrder } from "../types/order";
import { Shareholding } from "../types/shareholding";
import { PurchasingPower } from "./purchasing-power";


interface OrderFormProps {
    orderType?: NewOrder["type"];
    company?: Company;
    editOrder?: ServerOrder;
} {/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

//export class OrderForm extends Component<OrderProps, OrderState> {
export const OrderForm: FC<OrderFormProps> = (props) => {
    const editOrder = props.editOrder;
    const isEditOrder = props.editOrder !== undefined;

    const navigate = useNavigate();
    const portfolioContext = useContext(PortfolioContext);

    const [price, setPrice] = useState(editOrder ? editOrder.price : 0);

    const [priceValid, setPriceValid] = useState(isEditOrder); // Antar at edit-order er gyldig 

    const [amount, setAmount] = useState(editOrder ? editOrder.amount : 0);
    const [amountValid, setAmountValid] = useState(isEditOrder); // Antar at edit-order er gyldig 

    const [error, setError] = useState(false);

    const [errorText, setErrorText] = useState("");

    const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(props.company);

    const [orderType, setOrderType] = useState<NewOrder["type"]>(editOrder ? editOrder.type : props.orderType || "buy");
    const [shareholdings, setShareholdings] = useState<Shareholding[]>([]);

    const [availableAmount, setAvailableAmount] = useState(0);

    const selectedPortfolio = portfolioContext.selectedPortfolio


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
        let purchasePower = portfolioContext.selectedPortfolio?.purchasingPower || 0;
        if (editOrder) {
            // "Frigjør" kjøpekraft reservert av denne ordren hvis vi editerer en ordre
            purchasePower += editOrder.amount * editOrder.price;
        }
        if ((purchasePower - (price * amount) < 0)) {
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        if (portfolioContext.selectedPortfolio) {
            console.log("Henter shareholdings for portfolio " + portfolioContext.selectedPortfolio.displayName);
            getOwnedShareholdings(portfolioContext.selectedPortfolio.id);

        }
    }, [selectedPortfolio]) // Kalles kun når selectedPortfolio endres


    const getOwnedShareholdings = (portfolioId: number) => {

        fetch("stock/getAllShareholdings?portfolioId=" + portfolioId)
            .then(response => response.json())
            .then(response => {
                setShareholdings(response);
            })
            .catch(error => {
                setShareholdings([]);
                setError(true);
            });
    }

    useEffect(() => {
        setAvailableAmount(getAvailableStockAmount());
    }, [selectedPortfolio, selectedCompany, orderType])

    const getAvailableStockAmount = () => {
        // Returnerer hvor mange tilgjengelige aksjer det er med nånærende valg
        const companyId = selectedCompany?.id;
        if (companyId === undefined) {
            return 0;
        }
        const matchingShareholding = shareholdings.find((shareholding) => shareholding.companyId === companyId);
        if (!matchingShareholding) {
            return 0;
        }
        let availableShares = matchingShareholding.remainingAmount;
        if (editOrder) {
            // "Frigjør" antallet aksjer reservert av denne ordren hvis vi editerer en ordre
            availableShares += editOrder.amount;
        }
        return availableShares;
    }

    const validateEnoughStocks = () => {

        const availableShares = getAvailableStockAmount();
        return amount <= availableShares;

    }

    const sendEditOrder = () => {
        if (validateOrder()) {

            const order: EditOrder = {
                id: editOrder?.id || -1,
                price: price,
                amount: amount
            }

            fetch('stock/changeOrder', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            })
                .then(response => {
                    if (response.ok) {
                        navigate('/overview');
                    }
                    else {
                        setError(true);
                        setErrorText("Feil ved endring av ordre, noe er ugyldig");

                    }
                })
                .catch(error => {
                    setError(true);
                    setErrorText("Feil på server -prøv igjen senere");
                });
        };
    }

    const registerOrder = () => {
        if (validateOrder()) {
            const portfolioId = portfolioContext.selectedPortfolio?.id || -1;

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
                    }
                    else {
                        setError(true);
                        setErrorText("Feil ved registrering av ordre, noe er ugyldig");

                    }
                })
                .catch(error => {
                    setError(true);
                    setErrorText("Feil på server -prøv igjen senere");
                });
        };
    }

    const showAvailableAmount = selectedPortfolio && selectedCompany && orderType === "sell";

    return (
        <form className="form">

            <Form>

                <FormGroup className="borderbox">
                    <div className="underlinetext">Disponibelt beløp</div>
                    <PurchasingPower />
                </FormGroup>

                <FormGroup>
                    <PortfolioSelect disabled={isEditOrder} />
                </FormGroup>

                <FormGroup>
                    <CompanySelect disabled={isEditOrder} selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />
                </FormGroup>

                <FormGroup>
                    <label>Type</label>
                    <div form-group>
                        <input disabled={isEditOrder} checked={orderType === "buy"} type="radio" id="type-buy" name="type" value="buy" onClick={() => setOrderType("buy")} />
                        <label htmlFor="buy">Kjøp</label>
                    </div>
                    <div form-group>
                        <input disabled={isEditOrder} checked={orderType === "sell"} type="radio" id="type-sell" name="type" value="sell" onClick={() => setOrderType("sell")} />
                        <label htmlFor="sell">Salg</label>
                    </div>
                </FormGroup>

                <FormGroup>
                    <PriceInput price={price} onPriceSet={onPriceChange} />
                </FormGroup>

                <FormGroup>
                    <AmountInput amount={amount} onAmountSet={onAmountChange} /> {showAvailableAmount && <span>Tilgjengelige aksjer: {availableAmount}</span>}
                </FormGroup>

                <FormGroup>
                    <input type="button" id="reg" value="Registrer" onClick={isEditOrder ? sendEditOrder : registerOrder} className="btn btn-primary" />
                </FormGroup>

                <div className="form-group">
                    <span style={{ color: "red" }}>{errorText}</span>
                    <div id="test"></div>
                </div>
            </Form>
        </form>
    );
}