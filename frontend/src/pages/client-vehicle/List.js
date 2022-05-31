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

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const [list, setList] = useState([]);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const getList = () => {
        api.get('/client-vehicles', {company_id: props.company?.id}).then((response) => {
            setList(response.data.data.map((technicalConsultant) => {
                return {
                    id: technicalConsultant.id,
                    name: technicalConsultant.name,
                    active: technicalConsultant.active
                }
            }));
        }, () => {
            setList([]);
        })
    };

    const onEdit = (id) => {
        history(`/panel/company/${props.company?.id}/client-vehicles/${id}/edit`);
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
                        <Actions tableMeta={tableMeta} handleEdit={onEdit} actions={['edit']}/>
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
                    { label: 'Vehiculos do Cliente', path: '/client-vehicles/list' },
                    { label: 'Lista', path: '/client-vehicles/list', active: true },
                ]}
                title={'Vehiculos do Client'}
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
                                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/company/${props.company?.id}/technical-consultants/create`) }}>
                                            <i className="mdi mdi-basket me-1" /> Novo Consultor Técnico
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
