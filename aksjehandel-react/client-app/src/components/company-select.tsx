import React, { Component, PropsWithChildren, useContext } from "react";
import { Container } from 'reactstrap';
import { CompanyContext } from "../context/company-context";
import { Company } from "../types/company";



interface CompanySelectProps {
    setSelectedCompany: (company: Company) => void;
    selectedCompany?: Company;
    disabled?: boolean;

}

export const CompanySelect: React.FC<CompanySelectProps> = (props) => {
    const disabled = props.disabled === true;
    const companyContext = useContext(CompanyContext);

    const { selectedCompany, setSelectedCompany } = props;
    const { companies } = companyContext;

    const onCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        const companyIndex = Number(event.target.value);
        const newCompany = companies[companyIndex];
        if (selectedCompany !== newCompany) {
            setSelectedCompany(newCompany);
        }
    }
    const selectedCompanyIndex = selectedCompany ? companies.indexOf(selectedCompany) : -1;

    return (
        <Container>
            <div className="form-group">
                <label htmlFor="companySelect">Selskap</label>
                <select className="form-control" disabled={disabled} name="companySelect" value={selectedCompanyIndex} onChange={onCompanyChange}>
                    <option value="-1" disabled hidden>Velg selskap</option>
                    {companies?.map((company, index) => <option key={company.id} value={index}>{company.name}</option>)}
                </select>
            </div>
        </Container>
    );

}
