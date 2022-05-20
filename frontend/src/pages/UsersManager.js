// @flow
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Row, Tab, Nav, Table, Modal } from 'react-bootstrap';
import useApi from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';
import classnames from 'classnames';
// component
import PageTitle from '../components/PageTitle';
import { FormInput } from '../components';
import CurrencyInput from 'react-currency-input-field';
import { Divider } from '@mui/material';

const OrderList = () => {
    const api = useApi();
    const history = useNavigate();

    const query = new URLSearchParams(useLocation().search);
    const id = query.get('id');

    const [responsive, setResponsive] = useState('vertical');
    const [tableBodyHeight, setTableBodyHeight] = useState('400px');
    const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleReason, setVisibleReason] = useState(false);
    const [listReasons, setListReasons] = useState([]);
    const [optionValue, setOptionValue] = useState('');
    const [reasonValue, setReasonValue] = useState('');
    const [listAccess, setListAccess] = useState([]);

    const [modal2, setModal2] = useState(false);
    const [comment, setComment] = useState('');
    const toggle2 = () => {
        setModal2(!modal2);
    };
    const clearModal2 = () => {
        toggle2();
    };
    const fields = [
        {
            Header: 'ID USER',
            accessor: 'id_user',
            sort: true,
        },
        {
            Header: 'Name / Email',
            accessor: 'user',
            sort: true,
        },
    ];

    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: 'All',
            value: list.length,
        },
    ];
    const [listPreAproved, setListPreAproved] = useState([]);

    const getDucPreAprovedList = async () => {
        const result = await api.getPreAProvedByUser(id);
        console.table(result.list);
        setListPreAproved(result.list);
        setLoading(false);
    };
    const getList = async () => {
        setLoading(true);
        const result = await api.getUsers();
        setLoading(false);
        if (result.error === '') {
            let data = result.list.map((tasks) => ({
                id_user: tasks.id_user,
                user: tasks.user,
                actions: (
                    <>
                        <span class="badge bg-success badge rounded-pill bg-primary">2</span>
                    </>
                ),
            }));
            setList(data);
        } else {
            alert(result.error);
        }
    };
    const getListAccess = async () => {
        setLoading(true);
        const result = await api.getAcessByUser(id);
        setLoading(false);
        if (result.error === '') {
            let data = result.list.map((tasks) => ({
                id_user: tasks.id_user,
                user: tasks.user,
                actions: (
                    <>
                        <span class="badge bg-success badge rounded-pill bg-primary">2</span>
                    </>
                ),
            }));
            setListAccess(result.list);
        } else {
            alert(result.error);
        }
    };

    const detectClick = (e) => {
        if (e.target?.nodeName === 'TD') {
            const code = (e.target?.parentNode?.innerText).split('	')[1];
            goDuc(code);
        } else {
            return;
        }
    };

    const goDuc = (id_duc) => {
        const id = id_duc;
        history(`/manager/user?id=${id}&type=edit`);
    };
    const searchStringInArray = (str, strArray) => {
        for (var j = 0; j < strArray.length; j++) {
            if (strArray[j].match(str)) return j;
        }
        return -1;
    };

    const newDuc = () => {
        history(`/apps/duc/detail?id=null&type=new`);
    };
    useEffect(() => {
        getList();
        getListAccess();
        getDucPreAprovedList();
    }, []);
    const newExpense = () => {
        toggle2();
    };
    const handleSubmit = async () => {
        const data = {
            description: expense,
        };
        const result = await api.createDucExpense(data);
        getDucPreAprovedList();
        toggle2();
    };

    const [expense, setExpense] = useState('');

    const handlesetPreAProvedItem = async (id_expense_item, amount, id_pre_approved_expense_item) => {
        let result = '';
        const data = {
            id_user: id,
            id_expense_item: id_expense_item,
            amount: amount,
        };

        if (id_pre_approved_expense_item !== null) {
            result = await api.updatePreAprovedValue(data, id_pre_approved_expense_item);
        } else {
            result = await api.createPreAprovedByUser(data);
        }

        if (result.error === '') {
            getDucPreAprovedList();
        } else {
            // alert(result.error);
        }
    };
    const handleAddAccess = async ( id_access) => {
        const data = {
            id_user: id,
            id_access: id_access,
        };
        console.log(data)
        const result = await api.setAcessByUser(data);
        if (result.error === '') {
            getListAccess();
        } else {
            alert(result.error);
        }
    };
    const handleDeleteAccess = async (id_user_access) => {
       
        const result = await api.delAcessByUser(id_user_access);
        if (result.error === '') {
            getListAccess();
        } else {
            alert(result.error);
        }
    };
    
    const [valorGasto, setValorGasto] = useState('');
    const tabContents = [
        {
            id: '3',
            title: 'Dados Gerais',
            icon: 'mdi mdi-home-variant',
            text: '',
        },
        {
            id: '2',
            title: 'DUC - PERMISSÕES',
            icon: 'mdi mdi-account-circle',
            text: (
                <>
                    <Card>
                        <Card.Header as="h5">
                            
                        </Card.Header>
                    </Card>
                    <Divider />
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Descrição</th>
                                <th>Acesso</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listAccess.map((record, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{record.id_access}</th>
                                        <td>{record.description}</td>
                                        <td>{record.id_user}</td>
                                        <td>
                                            {record.id_user ? (
                                                <Button>
                                                    <i class="mdi mdi-delete" onClick={(e)=> {handleDeleteAccess(record.id_user_access)}}></i>
                                                </Button>
                                            ) : (
                                                <Button>
                                                    <i class="mdi mdi-plus" onClick={(e)=> {handleAddAccess(record.id_access)}}></i>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </>
            ),
        },
        {
            id: '1',
            title: 'DUC - VALORES PRÉ APROVADOS',
            icon: 'mdi mdi-cog-outline',
            text: (
                <>
                    <Card>
                        <Card.Header as="h5">
                            <Button onClick={(e) => newExpense()}>Nova Natureza de Despesa</Button>
                        </Card.Header>
                    </Card>
                    <Divider />
                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Descrição</th>
                                <th>Valor Pré Aprovado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPreAproved.map((record, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{record.id_expense_item}</th>
                                        <td>{record.description}</td>
                                        <td>
                                            <CurrencyInput
                                                id={record.id_expense_item}
                                                name="input-name"
                                                placeholder="Digite um valor"
                                                defaultValue={record.amount}
                                                decimalsLimit={2}
                                                prefix="R$ "
                                                onValueChange={(value, name) => {
                                                    console.log(value, name);
                                                    handlesetPreAProvedItem(
                                                        record.id_expense_item,
                                                        value,
                                                        record.id_pre_approved_expense_item
                                                    );
                                                    setValorGasto(value);
                                                }}
                                                style={{ border: 'none' }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </>
            ),
        },
    ];

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Manager', path: '/managers/users' },
                    { label: 'Usuarios', path: '/managers/users', active: true },
                ]}
                title={'Gerenciamento de Usuarios'}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="DUC - VALORES PRÉ APROVADOS">
                                <Nav variant="tabs" justify className="nav-bordered" as="ul">
                                    {tabContents.map((tab, index) => {
                                        return (
                                            <Nav.Item key={index} as="li" style={{ cursor: 'pointer' }}>
                                                <Nav.Link eventKey={tab.title}>
                                                    <i
                                                        className={classnames(
                                                            tab.icon,
                                                            'd-md-none',
                                                            'd-block',
                                                            'me-1'
                                                        )}></i>
                                                    <span className="d-none d-md-block">{tab.title}</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                        );
                                    })}
                                </Nav>

                                <Tab.Content>
                                    {tabContents.map((tab, index) => {
                                        return (
                                            <Tab.Pane eventKey={tab.title} id={tab.id} key={index}>
                                                <Row>
                                                    <Col sm="12">
                                                        <p className="mt-3">{tab.text}</p>
                                                    </Col>
                                                </Row>
                                            </Tab.Pane>
                                        );
                                    })}
                                </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={modal2} onHide={clearModal2}>
                <Modal.Header onHide={clearModal2} closeButton>
                    <h4 className="modal-title"> Adicionar nova natureza de Despesa</h4>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Col} controlId="formGridState">
                        <Row>
                            <Col>
                                <Form.Label>Natureza de Despesa</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Descrição da Natureza Despesa"
                                    onChange={(e) => setExpense(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={clearModal2}>
                        Close
                    </Button>{' '}
                    <Button variant="primary" onClick={(e) => handleSubmit()}>
                        Autorizar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default OrderList;
