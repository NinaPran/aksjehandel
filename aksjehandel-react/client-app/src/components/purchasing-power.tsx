import { Component, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Container } from 'reactstrap';
import { PortfolioContext } from "../context/portfolio-context";


export const PurchasingPower: FC = () => {
    const portfolioContext = useContext(PortfolioContext);
    const [purchasingPower, setPurchasingPower] = useState("-");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setPurchasingPower("-");
        if (portfolioContext.selectedPortfolio) {
            fetch('stock/GetPurchasingPower?id=' + portfolioContext.selectedPortfolio?.id, {
                method: 'post'
            })
                .then(response => response.json())
                .then(response => {
                    setPurchasingPower(response);
                    setErrorMessage("");
                })
                .catch(error => {
                    setErrorMessage("Kunne ikke hente kjøpekraft");
                });
        }
    }, [portfolioContext.selectedPortfolio])



    return (
        <>
            <p>{!errorMessage && purchasingPower} </p>
            {errorMessage &&
                <span style={{ color: "red" }}>{errorMessage}</span>
            }
        </>
    );


}