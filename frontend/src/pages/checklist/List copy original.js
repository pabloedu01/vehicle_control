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
import Print from "./Print";

const api = new APICore();

const List = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const { id, type } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [showModalGenerateToken, setShowModalGenerateToken] = useState(false);
    const [showModalPrint, setShowModalPrint] = useState(false);
    const [selectedVehicleServiceId, setSelectedVehicleServiceId] = useState(null);
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

    const schemaResolver2 = yupResolver(
        yup.object().shape({
            email: yup.string().required('Por favor, digite Email'),
        })
    );

    /*
     * form methods
     */
    const methods = useForm({ resolver: schemaResolver, defaultValues: {} });
    const methods2 = useForm({ resolver: schemaResolver2, defaultValues: {} });

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    const otherProps = {
        register,errors,control
    };

    const {
        handleSubmit: handleSubmit2,
        register:register2,
        control: control2,
        formState: { errors: errors2 },
    } = methods2;

    const otherProps2 = {
        register: register2, errors: errors2, control: control2
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

    const onPrint = (vehicleServiceId, rowData) => {
        setSelectedVehicleServiceId(vehicleServiceId);
        onShowModalPrint();
        /*history(`/panel/company/${props.company?.id}/${type}/${id}/checklist/${vehicleServiceId}/print`);*/
    };

    const onDuplicate = (vehicleServiceId, rowData) => {
        swal({
            title: 'Você tem certeza!',
            text: 'Irá duplicar este checklist',
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: {
                    text: 'Duplicar',
                    value: 'confirm'
                }
            },
            dangerMode: true,
        }).then((confirm) => {
            if(confirm){
                api.post('/vehicle-service/' + vehicleServiceId + '/duplicate').then((response) => {
                    swal({
                        title: 'Duplicado',
                        text: 'Checklist Duplicado',
                        icon: 'success',
                        buttons: {
                            confirm: {
                                text: 'Ok',
                                value: 'confirm'
                            }
                        },
                    });
                },(error) => {

                });
            }
        });
    };

    const onSendEmail = (vehicleServiceId, rowData) => {
        setSelectedVehicleServiceId(vehicleServiceId);
        setShowModalGenerateToken(true);
    };

    const onGenerateToken = () => {
        api.post('/vehicle-service/' + selectedVehicleServiceId + '/generate-token', {email: methods2.getValues('email')}).then((response) => {
            swal({
                title: 'Enviado',
                text: 'Checklist Enviado',
                icon: 'success',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
            });
        },(error) => {

        });
    };

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHideModal = () => {
        setShowModal(false);
    };

    const onShowModalPrint = () => {
        setShowModalPrint(true);
    };

    const onShowModalGenerateToken = () => {
        setShowModalGenerateToken(true);
    };

    const onHideModalGenerateToken = () => {
        setShowModalGenerateToken(false);
    };

    const onHideModalPrint = () => {
        setSelectedVehicleServiceId(null);
        setShowModalPrint(false);
    };

    const onCreate = () => {
        setShowModal(false);
        
        history(`/panel/company/${props.company?.id}/${type}/${id}/checklist/create/${methods.getValues('checklist_version_id')}`);
    };

    const print = () => {
        onHideModalPrint();
        
        const printHtml = document.getElementById('print-checklist').outerHTML;
        document.getElementById('root').style.display = 'none';

        const div = document.createElement('div');
        div.setAttribute('id', 'printable');
        div.innerHTML = printHtml;

        document.body.appendChild(div);

        setTimeout(() => {
            window.print();
            document.getElementById('root').style.display = '';
            document.getElementById('printable').remove();
        },500);

        /**/

        /*const printableWindow = window.open();

        const html = '<!DOCTYPE html><html>' + document.head.outerHTML +  '<body><div id="root">' + document.getElementById('print-checklist').outerHTML + '</div></body></html>';

        console.log(html);

        printableWindow.document.write(html);
        printableWindow.print();
        printableWindow.close();*/
    };

    useEffect(() => {
        getChecklistVersions();
        getList();

        setTableFields([
            {
                label: 'Código',
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
                label: 'Versão',
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
                            },
                            {
                                key: 'send',
                                icon: 'mdi mdi-email-send-outline',
                                label: 'Enviar',
                                action: onSendEmail
                            },
                            {
                                key: 'duplicate',
                                icon: 'mdi mdi-clipboard',
                                label: 'Duplicar',
                                action: onDuplicate
                            },

                            {
                                key: 'print',
                                icon: 'mdi mdi-printer-outline',
                                label: 'Imprimir',
                                action: onPrint
                            },
                        ]}/>
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
                        <Button variant="light" type="button" onClick={onHideModal}>
                            Encerrar
                        </Button>{' '}
                        <Button variant="primary" type="submit">
                            Cadastro
                        </Button>
                    </Modal.Footer>
                    </form>
                </Modal>

            <Modal show={showModalGenerateToken} onHide={onHideModalGenerateToken} size="lg" scrollable={true} centered={true}>
                <form onSubmit={handleSubmit2(onGenerateToken, (e) => {console.log(e);})} noValidate>
                    <Modal.Header onHide={onHideModalGenerateToken} closeButton>
                        <h4 className="modal-title">
                            Enviar checklist
                        </h4>
                    </Modal.Header>
                    <Modal.Body style={{minHeight: '300px'}}>
                        <FormInput
                            label="Email"
                            type="text"
                            name="email"
                            containerClass={'mb-3'}
                            {...otherProps2}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" type="button" onClick={onHideModalGenerateToken}>
                            Encerrar
                        </Button>{' '}
                        <Button variant="primary" type="submit">
                            Enviar
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={showModalPrint} onHide={onHideModalPrint} size="lg" scrollable={true} centered={true}>
                <Modal.Header onHide={onHideModalPrint} closeButton>
                    <h4 className="modal-title">
                        Imprimir
                    </h4>
                </Modal.Header>
                <Modal.Body style={{minHeight: '300px'}}>
                    {showModalPrint ? <Print company={props?.company} id={id} type={type} checklistId={selectedVehicleServiceId}/> : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" type="button" onClick={onHideModalPrint}>
                        Encerrar
                    </Button>{' '}
                    <Button variant="primary" type="button" onClick={print}>
                        Imprimir
                    </Button>
                </Modal.Footer>
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
