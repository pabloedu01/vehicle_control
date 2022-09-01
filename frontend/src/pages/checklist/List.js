// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row, Modal} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import MUIDataTable from "mui-datatables";
import TABLE_OPTIONS from "../../constants/tableOptions";
import Actions from "../../components/table/actions";
import swal from 'sweetalert';
import {getAllOptions} from "../../utils/selectOptionsForm";
import {FormInput} from "../../components";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import moment from "moment";

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id, type} = useParams();
    const [showModal, setShowModal] = useState(false);
    const [list, setList] = useState([]);
    const [checklistVersions, setChecklistVersions] = useState([]);
    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            checklist_version_id: yup.number().required('Por favor, digite Versão do checklist'),
        })
    );

    /*
     * form methods
     */
    const methods = useForm({ resolver: schemaResolver, defaultValues: {} });

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    const otherProps = {
        register,errors,control
    };

    const getList = () => {
        let ajaxCall;

        switch(type){
            case 'service-schedules':
                ajaxCall = api.get('/service-schedule/' + id + '/vehicle-services', {company_id: props.company?.id});
                break;
        }

        ajaxCall.then((response) => {
            setList(response.data.data.map((vehicleService) => {
                return {
                  id: vehicleService.id,
                  date: moment(vehicleService.created_at).format('DD/MM/YYYY H:mma'),
                  version: vehicleService.checklist_version.name,
                    nextStage: vehicleService.next_stage?.id ?? null,
                    isCompleted: vehicleService.completed
                };
            }))
        }, (error) => {
            setList([]);
        })
    };

    const getChecklistVersions = () => {
        api.get('/checklist-version/active-checklist-versions').then((response) => {
            setChecklistVersions(getAllOptions(response.data.data));
        },(error) => {
            setChecklistVersions([])
        });
    };

    const onEdit = (vehicleServiceId, rowData) => {
        history(`/panel/company/${props.company?.id}/${type}/${id}/checklist/${vehicleServiceId}/edit/${rowData.nextStage}`);
    };

    const onShow = (vehicleServiceId, rowData) => {
        history(`/panel/company/${props.company?.id}/${type}/${id}/checklist/${vehicleServiceId}`);
    };

    const onComplete = (vehicleServiceId, rowData) => {
        swal({
            title: '¿tem certeza?',
            text: 'Irá completar este registro',
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: {
                    text: 'Completar',
                    value: 'confirm'
                }
            },
            dangerMode: true,
        }).then((confirm) => {
            if(confirm){
                api.post('/vehicle-service/' + vehicleServiceId + '/complete').then((response) => {
                    getList();
                }, () => {

                });
            }
        });
    };

    /*const onDelete = (registerId, newList) => {
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
                api.delete('/vehicle-service/' + registerId).then((response) => {
                    setList(newList);
                }, () => {

                });
            }
        });
    };*/

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHideModal = () => {
        setShowModal(false);
    };

    const onCreate = () => {
        setShowModal(false);

        history(`/panel/company/${props.company?.id}/${type}/${id}/checklist/create/${methods.getValues('checklist_version_id')}`);
    };

    useEffect(() => {
        getChecklistVersions();
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
                label: 'Data',
                name: 'date',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Versión',
                name: 'version',
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
                        <Actions tableMeta={tableMeta} actions={[]} extraButtons={[
                            {
                                key: 'edit',
                                icon: 'mdi mdi-square-edit-outline',
                                label: 'Editar',
                                action: onEdit,
                                condition: (data) => {
                                    return !data.isCompleted && data.nextStage !== null;
                                }
                            },
                            {
                                key: 'show',
                                icon: 'mdi mdi-eye-outline',
                                label: 'Visualizar',
                                action: onShow
                            }
                        ]}/>
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
                <Modal show={showModal} onHide={onHideModal} size="lg" scrollable={true} centered={true}>
                    <form onSubmit={handleSubmit(onCreate)} noValidate>
                    <Modal.Header onHide={onHideModal} closeButton>
                        <h4 className="modal-title">
                            Versão do checklist
                        </h4>
                    </Modal.Header>
                    <Modal.Body style={{minHeight: '300px'}}>
                        <FormInput
                            label="Versão do checklist"
                            type="select"
                            name="checklist_version_id"
                            containerClass={'mb-3'}
                            options={checklistVersions}
                            {...otherProps}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={onHideModal}>
                            Cerrar
                        </Button>{' '}
                        <Button variant="primary" type="submit">
                            Cadastro
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>



            <PageTitle
                breadCrumbItems={[
                    { label: 'Checklist', path: `/panel/company/${props.company?.id}/${type}/${id}/checklist` },
                    { label: 'Lista', path: `/panel/company/${props.company?.id}/${type}/${id}/checklist`, active: true },
                ]}
                title={'Checklist'}
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
                                        <Button variant="danger" className="mb-2 me-2" onClick={onShowModal}>
                                            <i className="mdi mdi-basket me-1" /> Novo Checklist
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
