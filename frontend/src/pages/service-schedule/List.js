// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate} from "react-router-dom";
import MUIDataTable from "mui-datatables";
import TABLE_OPTIONS from "../../constants/tableOptions";
import Actions from "../../components/table/actions";
import swal from "sweetalert";
import moment from 'moment';

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [list, setList] = useState([]);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const getList = () => {
        api.get('/service-schedule', {company_id: props.company?.id}).then((response) => {
            setList(response.data.data.map((item) => {
                console.log(item.id,item.technical_consultant);

                return {
                    id: item.id,
                    vehicle: item.vehicle !== null  ? (item.vehicle.name + ' ' + item.vehicle.model_year + ' (' + item.vehicle.model.brand.name + ' - ' + item.vehicle.model.name + ')') : null,
                    code: item.code,
                    chasis: item.chasis,
                    plate: item.plate,
                    promised_date: moment(item.promised_date).format('DD/MM/YYYY H:mma'),
                    client: item.client?.name,
                    technical_consultant: item.technical_consultant?.name,
                }
            }));
        }, () => {
            setList([]);
        })
    };

    const onEdit = (id) => {
        history(`/panel/company/${props.company?.id}/service-schedules/${id}/edit`);
    };

    const onDelete = (registerId, newList) => {
        swal({
            title: '¿tem certeza?',
            text: 'Irá excluir este registro',
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: {
                    text: 'Excluir',
                    value: 'confirm'
                }
            },
            dangerMode: true,
        }).then((confirm) => {
            if(confirm){
                api.delete('/service-schedule/' + registerId).then((response) => {
                    setList(newList);
                }, () => {

                });
            }
        });
    };

    useEffect(() => {
        getList();

        setTableFields([
            {
                label: 'id',
                name: 'id',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Vehiculo',
                name: 'vehicle',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Código',
                name: 'code',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Chasis',
                name: 'chasis',
                options: {
                    filter: true,
                    sort: true,
                },
            },
                        {
                label: 'Plate',
                name: 'plate',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Data prometida',
                name: 'promised_date',
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
                label: 'Consultor Técnico',
                name: 'technical_consultant',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Ações',
                name: 'actions',
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <Actions tableMeta={tableMeta} handleEdit={onEdit} handleDelete={onDelete}/>
                    )
                },
            },
        ]);

        setTableOptions(Object.assign(TABLE_OPTIONS, {

        }));
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Horários de Serviço', path: '/service-schedules/list' },
                    { label: 'Lista', path: '/service-schedules/list', active: true },
                ]}
                title={'Horários de Serviço'}
                company={props.company}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between"/>
                                </Col>
                                <Col xl={4}>
                                    <div className="text-xl-end mt-xl-0 mt-2">
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/company/${props.company?.id}/service-schedules/create`) }}>
                                            <i className="mdi mdi-basket me-1" /> Novo Vehiculo do Cliente
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <MUIDataTable data={list} columns={tableFields} options={tableOptions}/>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default List;
