// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row,OverlayTrigger, Tooltip, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate} from "react-router-dom";
import MUIDataTable from "mui-datatables";
import TABLE_OPTIONS from "../../constants/tableOptions";
import Table from '../../components/Table';
import Actions from "../../components/table/actions";
import swal from "sweetalert";
import moment from 'moment';

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [list, setList] = useState([]);
    const [searchType, setSearchType] = useState(null);
    const [search, setSearch] = useState(null);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const columns = [
        {
            Header: 'id',
            accessor: 'id',
            sort: true,
        },
        {
            Header: 'Nome',
            accessor: 'name',
            sort: true,
        },
        {
            Header: 'Vehiculo',
            accessor: 'vehicle',
            sort: false,
        },
        {
            Header: 'Chasis',
            accessor: 'chasis',
            sort: false,
        },
        {
            Header: 'Placa',
            accessor: 'plate',
            sort: false,
        },
        {
            Header: 'Data prometida',
            accessor: 'promised_date',
            sort: false,
        },
        {
            Header: 'Cliente',
            accessor: 'client',
            sort: false,
        },
        {
            Header: 'Consultor Técnico',
            accessor: 'technical_consultant',
            sort: false,
        },
        {
            Header: 'Ações',
            accessor: 'actions',
            sort: false,
        },
    ];


    const getList = () => {
        let filter;

        if(search && searchType){
            filter = {};
            filter[searchType] = search;
        }

        api.get('/service-schedule', Object.assign({company_id: props.company?.id}, filter ? filter : {})).then((response) => {
            setSearchType(null);setSearch(null);

            setList(response.data.data.map((item) => {
                return {
                    id: item.id,
                    vehicle: item.client_vehicle.name,
                    chasis: item.client_vehicle.chasis,
                    plate: item.client_vehicle.plate,
                    promised_date: moment(item.promised_date).utc(true).format('DD/MM/YYYY HH:mm'),
                    client: item.client?.name,
                    technical_consultant: item.technical_consultant?.name,
                    checklist_version_id: item.checklist_version_id,
                    actions: <div>
                    <OverlayTrigger placement="left" overlay={<Tooltip>Editar</Tooltip>}>
                        <span className="cursor-pointer" onClick={()=>onEdit(item.id)}><i className="mdi mdi-square-edit-outline mdi-24px"/></span>
                   </OverlayTrigger>
                   <OverlayTrigger placement="left" overlay={<Tooltip>Excluir</Tooltip>}>
                      <span className="cursor-pointer" onClick={() => deleteItem(item.id)}><i className="mdi mdi-trash-can-outline mdi-24px"/></span>
                  </OverlayTrigger>
                  </div>
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
    const deleteItem = (registerId, newList) => {
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
                   getList();
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

        /*document.querySelectorAll('.MuiToolbar-root.MuiToolbar-gutters button.MuiButtonBase-root[aria-label=Search]').forEach(function(element){
            element.click();
        });*/
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
                <Col xl={12}>
                    <div className="text-end mt-xl-0 mt-2">
                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/company/${props.company?.id}/service-schedules/create`) }}>
                            <i className="mdi mdi-basket me-1" /> Nova Agenda de Serviço
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={6}>
                                    <InputGroup className="mb-3">
                                        <Form.Control onChange={(e) => {setSearch(e.target.value);} } aria-label="Text input with dropdown button" />

                                                <DropdownButton
                                              variant="outline-secondary"
                                              title={searchType ?? 'Seleccione'}
                                              id="input-group-dropdown-2"
                                              align="end"
                                            >
                                              <Dropdown.Item onClick={() => {setSearchType('chassi')}} href="#">Chassi</Dropdown.Item>
                                              <Dropdown.Item onClick={() => {setSearchType('plate')}} href="#">Placa</Dropdown.Item>
                                              <Dropdown.Item onClick={() => {setSearchType('client_name')}} href="#">Cliente</Dropdown.Item>
                                            </DropdownButton>
                                          </InputGroup>
                                </Col>
                                <Col xl={2}>
                                    <div className="text-xl-start text-xs-end mt-xl-0 mt-2">
                                        <Button variant="primary" className="mb-2" onClick={() => { getList(); }}>
                                            <i className="mdi mdi-search-web" /> Buscar
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {/* <MUIDataTable data={list} columns={tableFields} options={tableOptions}/> */}
                                    <Table
                                            columns={columns}
                                            data={list}
                                            pageSize={5}
                                            sizePerPageList={TABLE_OPTIONS.sizePerPageList}
                                            isSortable={true}
                                            pagination={true}
                                            isSearchable={false}
                                            isSelectable={false}
                                            // isSearchable={true}
                                        />

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

