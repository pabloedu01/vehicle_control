// @flow
import React, { useState, useEffect } from 'react';
import { Button, Card, Col,  Row} from 'react-bootstrap';
import useApi from '../services/api';
import { useNavigate } from 'react-router-dom';

// component
import PageTitle from '../components/PageTitle';
import MUIDataTable from 'mui-datatables';

const OrderList = () => {
    const api = useApi();
    const history = useNavigate();
    const [responsive, setResponsive] = useState('vertical');
    const [tableBodyHeight, setTableBodyHeight] = useState('400px');
    const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState([]);

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
        onRowsDelete: (e) => deleteSelectedServiceScheduler(e),
    };

 
        
    const getList = async () => {
        setLoading(true);
        const result = await api.getSchedules();
     
        setLoading(false);
        if (result.msg == "¡Success!") {
            let data = result.data.map((tasks) => ({
                id: tasks.id,
                promised_date:  tasks.promised_date, 
                technical_consultant:'',
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

    const deleteSelectedServiceScheduler = async (e) => {
        let array = e.data;
        for (let index = 0; index < array.length; index++) {
            let element = array[index].index;
            let idServiceScheduler = list[element].id_ServiceScheduler;
            await api.delSchedules(idServiceScheduler);
        }
    };

    const goSchedule = (id_ServiceScheduler) => {
        const id = id_ServiceScheduler;
        history(`/apps/schedule/detail?id=${id}&type=edit`);
    };
    const searchStringInArray = (str, strArray) => {
        for (var j = 0; j < strArray.length; j++) {
            if (strArray[j].match(str)) return j;
        }
        return -1;
    };
 
    const newSchedule = () => {
        history(`/apps/schedules/services/detail?id=null&type=new`);
    };
    useEffect(() => {
        getList();
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Service Scheduler', path: '/apps/crm/orders' },
                    { label: 'Service Scheduler List', path: '/apps/crm/orders', active: true },
                ]}
                title={'Service Scheduler List'}
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
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => newSchedule()}>
                                            <i className="mdi mdi-basket me-1"></i> New Service Scheduler
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
