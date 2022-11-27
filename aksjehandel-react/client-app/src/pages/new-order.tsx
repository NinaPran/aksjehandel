import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { OrderForm } from "../components/order-form";
import { CompanyContext } from "../context/company-context";
import { NewOrder } from "../types/order";



{/* https://stackoverflow.com/a/70342010 for å hente ut attributter fra knappeklikk  */ }

export const NewOrderPage = () => {
    const location = useLocation();
    const orderType: NewOrder["type"] = location.state?.type || "buy";
    const companyId = location.state?.companyId;
    const companyContext = useContext(CompanyContext);
    // Henter ut første company fra context-arrayet som matcher den valgte company-id'en
    const company = companyContext.companies.find((comp) => { return comp.id === companyId });
    return (
        <div className="container">
            <h1 className="header">Lag en ny ordre</h1>
            <OrderForm orderType={orderType} company={company} ></OrderForm>
        </div>
    );
}