// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {APICore} from "../../../helpers/api/apiCore";
import MUIDataTable from "mui-datatables";
import TABLE_OPTIONS from "../../../constants/tableOptions";
import Active from "../../../components/table/columnActive";

const api = new APICore();

const List = (props: {company?: any, handleSelect?: any, handleCreate?: any, handleEdit?: any, pushButton?:any}): React$Element<React$FragmentType> => {
    const [list, setList] = useState([]);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const getList = () => {
        api.get('/client/active-clients', {company_id: props.company?.id}).then((response) => {
            setList(response.data.data.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    active: item.active,
                    document: item.document,
                    address: item.address,
                }
            }));
        }, (error) => {
            setList([]);
        })
    };

    const onEdit = (id) => {
        if(props?.handleEdit){
            props.handleEdit(id, props?.pushButton);
        }
    };

    const onSelect = (id) => {
        if(props?.handleSelect){
            props.handleSelect(id, props?.pushButton);
        }
    };

    const onCreate = () => {
        if(props?.handleCreate){
            props.handleCreate(props?.pushButton);
        }
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
                label: 'Nome',
                name: 'name',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Documento',
                name: 'document',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Endereço',
                name: 'address',
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
                        <>
                            <OverlayTrigger placement="left" overlay={<Tooltip>Selecionar</Tooltip>}>
                                <span style={{cursor: 'pointer'}} onClick={() => {onSelect(tableMeta.tableData[tableMeta.rowIndex].id)}}><i className="mdi mdi-hand-pointing-right mdi-24px"/></span>
                            </OverlayTrigger>

                            <OverlayTrigger placement="left" overlay={<Tooltip>Editar</Tooltip>}>
                                <span style={{cursor: 'pointer'}} onClick={() => {onEdit(tableMeta.tableData[tableMeta.rowIndex].id)}}><i className="mdi mdi-square-edit-outline mdi-24px"/></span>
                            </OverlayTrigger>
                        </>
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
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <h3>Clientes</h3>

                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between"/>
                                </Col>
                                <Col xl={4}>
                                    <div className="text-xl-end mt-xl-0 mt-2">
                                        <Button variant="danger" className="mb-2 me-2" onClick={onCreate}>
                                            <i className="mdi mdi-basket me-1" /> Novo Cliente
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
