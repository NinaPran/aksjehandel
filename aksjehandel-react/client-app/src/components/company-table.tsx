import {  FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CompanyContext } from '../context/company-context';

export const CompanyTable: FC = () => {
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
                                        <td> <Link className='btn btn-success' to={"/new-order"} state={{ companyId: company.id }}>Kjøp</Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </>
                    </table>
                }
            </>
        );
  
}
