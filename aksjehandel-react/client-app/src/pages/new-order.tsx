import { useLocation } from "react-router-dom";
import { OrderForm } from "../components/order-form";
import { NewOrder } from "../types/order";



{/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

export const NewOrderPage = () => {
    const location = useLocation();
    const orderType: NewOrder["type"] = location.state?.type || "buy";
    return (
        <div className="container">
            <h1 className="header">Lag en ny ordre</h1>
            <OrderForm orderType={orderType}></OrderForm>
        </div>
    );
}