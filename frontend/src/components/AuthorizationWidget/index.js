// @flow
import React, { useState } from 'react';
import { Card, Col, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';


const ClientWidget = ({ clientDetails , func}) => {

    
    return (
        <>
            {(clientDetails || []).map((client, i) => {

            const menuItems = ([
                {
                    label: 'Revogar Autorização',
                    icon: 'mdi mdi-window-close',
                    variant: 'primary',
                },
            ])
                 const title = (
                    <>
                        <div className="flex-shrink-0">
                            <img src={client.avatar} alt="" className="rounded-circle avatar-sm" />
                        </div>
                        <div className="flex-grow-1 ms-2">
                            <h5 className="my-1">{client.username.user}</h5>
                            <p className="text-muted mb-0">{client.comment}</p>
                        </div>
                    </>
                );

                return (
                    <Col key={i}>
                        <Card>
                            <Card.Body>
                                <div className={classNames('d-flex')}>
                                    {typeof title === 'string' ? <h4 className="header-title">{title}</h4> : title}
                                    <Dropdown>
                                        <Dropdown.Toggle className="arrow-none card-drop">
                                            <i className={classNames('mdi mdi-dots-vertical')} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            {(menuItems || []).map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        {item.hasDivider && <Dropdown.Divider as="div" />}
                                                        <Dropdown.Item onClick={(e)=>{func(e)}}
                                                            className={classNames(item.variant ? item.variant : '')}>
                                                            {item.icon && (
                                                                <i className={classNames(item.icon, 'me-1')}></i>
                                                            )}
                                                            {item.label}
                                                        </Dropdown.Item>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>

                            </Card.Body>
                             
                        </Card>
                    </Col>
                );
            })}
        </>
    );
};

export default ClientWidget;
