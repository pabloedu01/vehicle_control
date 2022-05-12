// @flow
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import useApi from '../services/api';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';

// component
import PageTitle from '../components/PageTitle';
import { FormInput } from '../components';
import MUIDataTable from 'mui-datatables';

const OrderList = () => {
    const api = useApi();
    const history = useNavigate();
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

    const fields = [
        {
            label: 'ID USER',
            name: 'id_user',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Name / Email',
            name: 'user',
            options: {
                filter: true,
                sort: true,
            },
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
    // const detectClick = (e) => {
    //     if (e.target?.nodeName === 'TD') {
    //         const code = (e.target?.parentNode?.innerText).split('	')[1];
    //         goDuc(code);
    //     } else {
    //         return;
    //     }
    // };

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive,
        tableBodyWidth: '100%',
        tableBodyHeight,
        tableBodyMaxHeight,
        onRowClick: (row, index) => {
            goDuc(row[0]);
        },
        // onRowsDelete: (e) => deleteSelectedDuc(e),
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
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Manager', path: '/managers/users' },
                    { label: 'Usuarios', path: '/managers/users', active: true },
                ]}
                title={'Manutenção de usuários'}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
                                      
                                       
                                    </Row>
                                </Col>
                                <Col xl={4}>
                                    <div className="text-xl-end mt-xl-0 mt-2">
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => newDuc()}>
                                            <i className="mdi mdi-plus me-1"></i>Usuario
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <MUIDataTable data={list} columns={fields} options={options} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderList;
