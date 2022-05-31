// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../components/PageTitle";
import {Badge, Card, Col, Dropdown, Row} from "react-bootstrap";
import {APICore} from "../helpers/api/apiCore";
import {Link, useNavigate} from "react-router-dom";
import CardTitle from "../components/CardTitle";
import classNames from "classnames";

const api = new APICore();

const Companies = (): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [companies, setCompanies] = useState([]);

    const getCompanies = () => {
        api.get('/user/companies').then((response) => {
            setCompanies(response.data.data);
        }, () => {

        });
    };

    useEffect(() => {
        getCompanies();
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Companies', path: '/panel/companies' },
                    { label: 'Companies List', path: '/panel/companies', active: true },
                ]}
                title={'Companies List'}
                insideCompany={false}
            />

            <Row>
                {(companies || []).map((company, index) => {
                return (
                    <Col key={index.toString()} sm={6} xl={3} className="mb-3">
                        <Card className="mb-0 h-100">
                            <Card.Body>
                                <h4 className="header-title" hidden={company.name === null}>{ company.name }</h4>
                                <h5
                                    className="text-muted fw-normal mt-0 text-truncate">
                                    {company.cnpj || company.cpf}
                                </h5>
                                <Badge bg="" className={classNames('me-1', 'bg-success', 'rounded-pill')} key={index}>
                                    Ativo
                                </Badge>
                            </Card.Body>
                            <Card.Footer style={{'border': 'none'}}>
                                <div className="float-start">
                                    <button type="button" className="arrow-none dropdown-toggle btn btn-info" onClick={ () => { history(`/panel/company/${company.id}/dashboard`); } }>
                                        Acessar
                                    </button>
                                </div>

                                <Dropdown className="float-end">
                                    <Dropdown.Toggle variant="link" className="arrow-none card-drop">
                                        <i className={classNames('mdi mdi-cog-outline')} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item>
                                            <i className={classNames('mdi mdi-square-edit-outline', 'me-1')}/>
                                            Edit
                                        </Dropdown.Item>
                                        <Dropdown.Divider as="div" />
                                        <Dropdown.Item className={classNames('text-danger')}>
                                            <i className={classNames('mdi mdi-trash-can-outline', 'me-1')}/>
                                            Delete
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <div className="float-end">
                                    <button type="button" className="arrow-none card-drop btn btn-link">
                                        <i className={classNames('mdi mdi-account-plus-outline', 'me-1')}/>
                                    </button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    )
                })}
            </Row>
        </>
    );
};

export default Companies;
