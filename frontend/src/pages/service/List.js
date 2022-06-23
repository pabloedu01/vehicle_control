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
import swal from 'sweetalert';

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [list, setList] = useState([]);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const getList = () => {
        api.get('/service', {company_id: props.company?.id}).then((response) => {
            setList(response.data.data.map((item) => {
                return {
                    id: item.id,
                    service_code: item.service_code,
                    integration_code: item.integration_code,
                    description: item.description,
                    standard_quantity: item.standard_quantity,
                    standard_value: item.standard_value,
                    active: item.active,


                }
            }));
        }, (error) => {
            setList([]);
        })
    };

    const onEdit = (id) => {
        history(`/panel/company/${props.company?.id}/services/${id}/edit`);
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
                api.delete('/service/' + registerId).then((response) => {
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
                label: 'Código de Serviço',
                name: 'service_code',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Código de Integração',
                name: 'integration_code',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Descrição',
                name: 'description',
                options: {
                    filter: true,
                    sort: true,
                },
            },

            {
                label: 'Quantidade Padrão',
                name: 'standard_quantity',
                options: {
                    filter: true,
                    sort: true,
                },
            },

            {
                label: 'Valor Padrão',
                name: 'standard_value',
                options: {
                    filter: true,
                    sort: true,
                },
            },

            {
                label: 'Ative',
                name: 'active',
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta) => {
                        return <Active value={value} tableMeta={tableMeta}/>;
                    }
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
                    { label: 'Serviços', path: '/services/list' },
                    { label: 'Lista', path: '/services/list', active: true },
                ]}
                title={'Serviços'}
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
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/company/${props.company?.id}/services/create`) }}>
                                            <i className="mdi mdi-basket me-1" /> Novo Serviço
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
