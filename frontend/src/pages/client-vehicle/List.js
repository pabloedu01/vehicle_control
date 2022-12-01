// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate} from "react-router-dom";
import MUIDataTable from "mui-datatables";
import TABLE_OPTIONS from "../../constants/tableOptions";
import Actions from "../../components/table/actions";
import Active from "../../components/table/columnActive";
import swal from "sweetalert";

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [list, setList] = useState([]);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const getList = () => {
        api.get('/company/client-vehicles', {company_id: props.company?.id}).then((response) => {
            setList(response.data.data.map((item) => {
                return {
                    id: item.id,
                    chasis: item.chasis,
                    color: item.color,
                    number_motor: item.number_motor,
                    renavan: item.renavan,
                    plate: item.plate,
                    mileage: item.mileage,
                    vehicle: item.vehicle.name + ' ' + item.vehicle.model_year + ' (' + item.vehicle.model.brand.name + ' - ' + item.vehicle.model.name + ')'
                }
            }));
        }, () => {
            setList([]);
        })
    };

    const onEdit = (id) => {
        history(`/panel/company/${props.company?.id}/client-vehicles/${id}/edit`);
    };

    const onDelete = (registerId, newList) => {
        swal({
            title: 'Você tem certeza!',
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
                api.delete('/client-vehicle/' + registerId).then((response) => {
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
                label: 'Chasis',
                name: 'chasis',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Color',
                name: 'color',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Motor',
                name: 'number_motor',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Renavan',
                name: 'renavan',
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
                label: 'KM',
                name: 'mileage',
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

        /*document.querySelectorAll('.MuiToolbar-root.MuiToolbar-gutters button.MuiButtonBase-root[aria-label=Search]').forEach(function(element){
            element.click();
        });*/
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Veículo de passagem', path: '/client-vehicles/list' },
                    { label: 'Lista', path: '/client-vehicles/list', active: true },
                ]}
                title={'Veículo de passagem'}
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
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/company/${props.company?.id}/client-vehicles/create`) }}>
                                            <i className="mdi mdi-basket me-1" /> Novo Veículo de passagem
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
