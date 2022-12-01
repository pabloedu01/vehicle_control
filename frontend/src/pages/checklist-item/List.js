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

const List = (): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [list, setList] = useState([]);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const getList = () => {
        api.get('/checklist-item').then((response) => {
            setList(response.data.data.map((checklistItem) => {
                return {
                    id: checklistItem.id,
                    name: checklistItem.name,
                    description: checklistItem.description,
                    code: checklistItem.code,
                    active: checklistItem.active,
                    type: checklistItem.validation.type,
                    rule: checklistItem.validation.rule,
                }
            }));
        }, () => {
            setList([]);
        })
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
                api.delete('/checklist-item/' + registerId).then((response) => {
                    setList(newList);
                }, () => {

                });
            }
        });
    };

    const onEdit = (id) => {
        history(`/panel/checklist-items/${id}/edit`);
    };

    useEffect(() => {
        getList();

        setTableFields([
            {
                label: 'Id',
                name: 'id',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Nome',
                name: 'name',
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
                label: 'Código',
                name: 'code',
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
                label: 'O Tipo',
                name: 'type',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Regra',
                name: 'rule',
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
                    { label: 'Lista de verificação', path: '/panel/checklist-items/list' },
                    { label: 'Itens', path: '/panel/checklist-items/list', active: true },
                ]}
                title={'Lista de verificação'}
                insideCompany={false}
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
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/checklist-items/create`) }}>
                                            <i className="mdi mdi-basket me-1" /> Novo Iten de lista de verificação
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
