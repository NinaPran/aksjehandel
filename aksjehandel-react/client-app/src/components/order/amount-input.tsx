import React, { Component, createRef, FC, PropsWithChildren, useState } from "react";
import { Container } from 'reactstrap';

interface AmountInputProps {
    onAmountSet: (amount: number, valid: boolean) => void;
    amount: number;
}

export const AmountInput: FC<AmountInputProps> = (props) => {
    const [amountError, setAmountError] = useState("");
    const amount = props.amount;

    const validateAmount: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const regexp = /^[0-9]{1,9}$/
        const amount = event.target.value || "";
        const ok = regexp.test(amount);

        if (!ok) {
            setAmountError("Antall må være et positivt tall og ikke større enn 1.000.000.000");
            props.onAmountSet(0, false);
        }
        else {
            setAmountError("");
            props.onAmountSet(Number.parseFloat(amount), true);

        }
    }

        return (
            <div className="form-group">
                <label style={{ marginRight: "10px" }}>Antall</label>
                <input type="text" onChange={validateAmount} defaultValue={ amount } />
                <span style={{ color: "red" }}>{amountError}</span>
            </div>
        );
}

