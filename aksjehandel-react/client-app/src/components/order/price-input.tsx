import React, { Component, createRef, FC, PropsWithChildren, useState } from "react";
import { Container } from 'reactstrap';

interface PriceInputProps {
    onPriceSet: (price: number, valid: boolean) => void;
    price: number;
}

export const PriceInput: FC<PriceInputProps> = (props) => {
    const [priceError, setPriceError] = useState("");
    const price = props.price;

    const validatePrice: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const regexp = /^[0-9]{1,10}$/
        const price = event.target.value || "";
        const ok = regexp.test(price);

        if (!ok) {
            setPriceError("Pris må være et positivt tall og ikke større enn 1.000.000.000");
            props.onPriceSet(0, false);
        }
        else {
            setPriceError("");
            props.onPriceSet(Number.parseFloat(price), true);
        }
    }
    return (
        <div className="form-group">
            <label style={{ marginRight: "25px" }}>Pris</label>
            <input type="text" onChange={validatePrice} defaultValue={price} />
            <span style={{ color: "red" }}>{priceError}</span>
        </div>
    );
}
