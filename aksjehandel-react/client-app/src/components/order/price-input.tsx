import React, { Component, createRef, PropsWithChildren } from "react";
import { Container } from 'reactstrap';

interface PriceInputProps {
    onPriceSet: (price: number, valid: boolean) => void;
    price: number;
}

interface PriceInputState {
    priceError: string;
}

export class PriceInput extends Component<PriceInputProps, PriceInputState> {
    priceInput = createRef<HTMLInputElement>();

    constructor(props: PriceInputProps) {
        super(props);
        this.state = {
            priceError: "",
        }
    }

    validatePrice = () => {
        const regexp = /^[0-9]{1,10}$/
        const price = this.priceInput.current?.value || "";
        const ok = regexp.test(price);

        if (!ok) {
            this.setState({ priceError: "Pris må være et positivt tall og ikke større enn 1.000.000.000" });
            this.props.onPriceSet(0, false);
        }
        else {
            this.setState({ priceError: "" });
            this.props.onPriceSet(Number.parseFloat(price), true);
        }
    }

    render() {
        const { price } = this.props;
        const { priceError } = this.state;

        return (
            <div className="form-group">
                <label>Pris</label>
                <input type="text" ref={this.priceInput} onChange={this.validatePrice} defaultValue={price} />
                <span style={{ color: "red" }}>{priceError}</span>
            </div>
        );
    }
}
