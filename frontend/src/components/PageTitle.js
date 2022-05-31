// @flow
import React from 'react';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import {useParams} from "react-router-dom";

type BreadcrumbItems = {
    label: string,
    path: string,
    active?: boolean,
};

type PageTitleProps = {
    breadCrumbItems: Array<BreadcrumbItems>,
    title: string,
    company?: any,
    insideCompany?: boolean
};

/**
 * PageTitle
 */
const PageTitle = (props: PageTitleProps): React$Element<any> => {
    const {companyId} = useParams();

    return (
        <Row>
            <Col>
                <div className="page-title-box">
                    <div className="page-title-right">
                        <Breadcrumb listProps={{ className: 'm-0' }}>
                            <Breadcrumb.Item href="/panel/companies">TUNAP</Breadcrumb.Item>
                            <Breadcrumb.Item hidden={props.insideCompany === false} href={`/panel/company/${props.company?.id || companyId}/dashboard`}>{props.company?.name || 'Empresa'}</Breadcrumb.Item>

                            {props.breadCrumbItems.map((item, index) => {
                                return item.active ? (
                                    <Breadcrumb.Item active key={index}>
                                        {item.label}
                                    </Breadcrumb.Item>
                                ) : (
                                    <Breadcrumb.Item key={index} href={props.insideCompany === false ? item.path : `/panel/company/${props.company?.id || companyId}${item.path}`}>
                                        {item.label}
                                    </Breadcrumb.Item>
                                );
                            })}
                        </Breadcrumb>
                    </div>
                    <h4 className="page-title">{props.title}</h4>
                </div>
            </Col>
        </Row>
    );
};

export default PageTitle;
