// @flow
import React, { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import useApi from '../services/api';
import { useNavigate } from 'react-router-dom';
import Creatable from 'react-select/creatable';

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
            label: 'cod_agenda',
            name: 'id',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Data do Agendamento',
            name: 'promised_date',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Consultor',
            name: 'technical_consultant',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Cliente',
            name: 'client',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Veículo',
            name: 'vehicle',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Placa',
            name: 'plate',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            label: 'Status',
            name: 'claims_service',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            label: 'Chassi',
            name: 'chassi',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            label: 'Ações',
            name: 'actions',
            options: {
                filter: false,
                sort: false,
            },
        },
    ];

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive,
        tableBodyWidth: '100%',
        tableBodyHeight,
        tableBodyMaxHeight,
        onRowClick: (row, index) => {
            goSchedule(row[0]);
        },
        onRowsDelete: (e) => deleteSelectedDuc(e),
    };

    // fprmat data to ptbr
    const formatDate = (datainfo) => {

            let dataString = datainfo;
            if (datainfo > "" ) {
                let data =  datainfo.split("-");
                let dia = data[2];
                let mes = data[1];
                let ano = data[0];
                dataString = data[2]+"/"+data[1]+"/"+data[0];
            }
            return dataString
        }
        
    const getList = async () => {
        setLoading(true);
        const result = await api.getDucs();
        setLoading(false);
        if (result.error == "¡Success!") {
            let data = result.data.map((tasks) => ({
                id: tasks.id,
                promised_date: formatDate(tasks.promised_date), 
                technical_consultant: tasks.technical_consultant.name,
                client: tasks.client.name,
                vehicle: tasks.vehicle.name,
                plate: tasks.client.document,
                chassi: tasks.vehicle.document,
                claims_service: <><Button>teste</Button></>
            }));
            setList(data);
        } else {
            alert(result.error);
        }
    };
    const getReason = async () => {
        const result = await api.getReasons();
        if (result.error === '') {
            let data = result.list.map((reasons) => ({
                label: reasons.description,
                value: reasons.id_reason,
            }));
            let firstvcalue = [{ label: 'select value', value: null }];
            let newdata = firstvcalue.concat(data);
            console.log(newdata);
            setListReasons(newdata);
        } else {
            console.log(result.error);
        }
    };
   
    const deleteSelectedDuc = async (e) => {
        let array = e.data;
        for (let index = 0; index < array.length; index++) {
            let element = array[index].index;
            let idduc = list[element].id_duc;
            console.log(idduc);
            console.log(element);
            await api.deleteDuc(idduc);
        }

        console.log(e);
    };

    const goSchedule = (id_duc) => {
        const id = id_duc;
        history(`/apps/schedule/detail?id=${id}&type=edit`);
    };
    const searchStringInArray = (str, strArray) => {
        for (var j = 0; j < strArray.length; j++) {
            if (strArray[j].match(str)) return j;
        }
        return -1;
    };
    const checkCreation = (created) => {
        // se o valor bate com algum item da listagem prossegue normalemnte so coloca no state o value
        if (searchStringInArray(created, listReasons)) {
            setOptionValue(created);
        } else {
            // se não envia pro endpoint para cadastrar e o usestate setvalue para alterar o valor da id
            setOptionValue(created);
        }
    };
    const newDuc = () => {
        history(`/apps/schedule/detail?id=null&type=new`);
    };
    useEffect(() => {
        getList();
        getReason();
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Duc', path: '/apps/crm/orders' },
                    { label: 'Duc List', path: '/apps/crm/orders', active: true },
                ]}
                title={'Duc List'}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between"></Row>
                                </Col>
                                <Col xl={4}>
                                    <div className="text-xl-end mt-xl-0 mt-2">
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => newDuc()}>
                                            <i className="mdi mdi-basket me-1"></i> New DUC
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
