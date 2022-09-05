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
                return {
                    id: item.id,
                    vehicle: item.client_vehicle.name,
                    chasis: item.client_vehicle.chasis,
                    plate: item.client_vehicle.plate,
                    promised_date: moment(item.promised_date).format('DD/MM/YYYY H:mma'),
                    client: item.client?.name,
                    technical_consultant: item.technical_consultant?.name,
                    checklist_version_id: item.checklist_version_id
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

    const onChecklist = (registerId) => {
        history(`/panel/company/${props.company?.id}/service-schedules/${registerId}/checklist`);
    };

    const onPrint = (registerId, registerData) => {
        api.post('/checklist-version/' + registerData.checklist_version_id + '/print', {type: 'service-schedules', id: registerId, utcOffset: moment().utcOffset()}).then((response) => {
            window.open(response.data.data.report, '_blank');
        },(error) => {
            swal({
                title: 'Error',
                text: 'Ocorreu um erro ao gerar o relatório.',
                icon: 'error',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
                dangerMode: true,
            });
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
                    display: false
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
                        <Actions
                            tableMeta={tableMeta}
                            handleEdit={onEdit}
                            handleDelete={onDelete}
                        />
                    )
                },
            },
        ]);

        setTableOptions(Object.assign(TABLE_OPTIONS, {

        }));

        document.querySelectorAll('.MuiToolbar-root.MuiToolbar-gutters button.MuiButtonBase-root[aria-label=Search]').forEach(function(element){
            element.click();
        });
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Agenda de Serviços', path: '/service-schedules/list' },
                    { label: 'Lista', path: '/service-schedules/list', active: true },
                ]}
                title={'Agenda de Serviços'}
                company={props?.company}
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
                                            <i className="mdi mdi-basket me-1" /> Nova Agenda de Serviço
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
