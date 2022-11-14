import React, { Component, PropsWithChildren } from "react";
import { Container } from 'reactstrap';
import { CompanyContext } from "../context/company-context";
import { Company } from "../types/company";



interface CompanySelectProps {
    setSelectedCompany: (company: Company) => void;
    selectedCompany?: Company;
}

interface CompanySelectState {
}

export class CompanySelect extends Component<CompanySelectProps, CompanySelectState> {

    render() {
        // const selectedCompany = this.props.selectedCompany;
        // const setSelectedCompany = this.props.setSelectedCompany;
        const { selectedCompany, setSelectedCompany } = this.props;

        return (
            <CompanyContext.Consumer>
                {({ companies }) => (
                    <Container>
                        <div className="form-group">
                            <label htmlFor="companySelect">Selskap</label>
                            <select className="form-control" name="companySelect">
                                <option value="" disabled selected={!selectedCompany} hidden>Velg selskap</option>
                                {companies?.map((company) => <option selected={selectedCompany == company} onClick={() => setSelectedCompany(company)} value={company.id}>{company.name}</option>)}
                            </select>
                        </div>
                    </Container>
                )}
            </CompanyContext.Consumer>
        );
    }
}
