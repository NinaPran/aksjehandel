import React, { Component, createRef, PropsWithChildren } from "react";
import { Container } from 'reactstrap';

interface AmountInputProps {
    onAmountSet: (amount: number, valid: boolean) => void;
    amount: number;
}

interface AmountInputState {
    amountError: string;
}

export class AmountInput extends Component<AmountInputProps, AmountInputState> {
    amountInput = createRef<HTMLInputElement>();

    constructor(props: AmountInputProps) {
        super(props);
        this.state = {
            amountError: "",
        }
    }


    validateAmount = () => {
        const regexp = /^[0-9]{1,9}$/
        const amount = this.amountInput.current?.value || "";
        const ok = regexp.test(amount);
        if (!ok) {
            this.setState({ amountError: "Antall må være et positivt tall og ikke større enn 1.000.000.000" });
            this.props.onAmountSet(0, false);
        }
        else {
            this.setState({ amountError: "" });
            this.props.onAmountSet(Number.parseFloat(amount), true);

        }

    }

    render() {
        const { amount } = this.props;
        const { amountError } = this.state;

        return (
            <div className="form-group">
                <label style={{ marginRight: "10px" }}>Antall</label>
                <input type="text" ref={this.amountInput} onChange={this.validateAmount} defaultValue={ amount } />
                <span style={{ color: "red" }}>{amountError}</span>
            </div>
        );
    }
}

