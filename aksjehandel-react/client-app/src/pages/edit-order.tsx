import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { OrderForm } from "../components/order-form";
import { CompanyContext } from "../context/company-context";
import { ServerOrder } from "../types/order";



{/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

export const EditOrderPage = () => {
    const companyContext = useContext(CompanyContext);
    const location = useLocation();
    const order: ServerOrder = location.state.editOrder;
    const company = companyContext.companies.find((company) => company.id === order.companyId);
    console.log("Render edit-order");
    return (
        <div className="container">
            <h1>Endre ordre</h1>
            <OrderForm editOrder={order} company={company}></OrderForm>
        </div>
    );
}