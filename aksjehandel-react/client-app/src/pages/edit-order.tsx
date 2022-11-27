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
    // Henter ut første company fra context-arrayet som matcher den valgte company-id'en
    const company = companyContext.companies.find((company) => { return company.id === order.companyId });
    return (
        <div className="container">
            <h1 className="header">Endre ordre</h1>
            <OrderForm editOrder={order} company={company}></OrderForm>
        </div>
    );
}