import { error } from 'console';
import React, { Component, FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ServerOrder } from '../types/order';
import { Company } from '../types/company';
import { CompanyContext } from '../context/company-context';

interface CompanyTableProps {
}

export const CompanyTable: FC<CompanyTableProps> = (props) => {
    const companyContext = useContext(CompanyContext);
    const companies = companyContext.companies;
        return (
            <>
                {companies &&
                    <table className='table table-striped'>
                        <>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Navn</th>
                                    <th>Maks Pris</th>
                                    <th>Minimums pris</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) =>
                                    <tr key={company.id}>
                                        <td> {company.symbol} </td>
                                        <td> {company.name} </td>
                                        <td> {company.maxPrice} </td>
                                        <td> {company.minPrice} </td>
                                        <td> <Link className='btn' style={{ backgroundColor: "#7b9a6d", color: "white" }} to={"/new-order"} state={{ company: company }}>Kjøp</Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </>
                    </table>
                }
            </>
        );
  
}
