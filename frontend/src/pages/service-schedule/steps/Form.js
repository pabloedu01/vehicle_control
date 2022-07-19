// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row, Modal, Tooltip, OverlayTrigger} from "react-bootstrap";
import {APICore} from "../../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {FormInput} from "../../../components";
import moment from 'moment';
import swal from "sweetalert";
import classNames from "classnames";
import {getAllOptions} from "../../../utils/selectOptionsForm";

const api = new APICore();

const Form = (props: {company?: any, clientVehicle?:any, client?:any, handleReturnToClientList?:any, handleReturnToClientVehicleList?:any, pushButton?:any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [checklistVersions, setChecklistVersions] = useState([]);
    const [technicalConsultants, setTechnicalConsultants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reports, setReports] = useState([]);
    const [clientInfo, setClientInfo] = useState();
    const [clientVehicleInfo, setClientVehicleInfo] = useState(null);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            checklist_version_id: yup.number().required('Por favor, digite Versão do checklist'),
            client_vehicle_id: yup.number().required('Por favor, digite Vehiculo'),
            code: yup.string().nullable(),
            promised_date: yup.date().required('Por favor, digite Data Prometida'),
            client_id: yup.number().required('Por favor, digite Cliente'),
            technical_consultant_id: yup.number().required('Por favor, digite Consultor Técnico'),
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

    const onSubmit = (formData) => {
        let ajaxCall;

        formData.promised_date = moment(formData.promised_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00');

        if(id){
            ajaxCall = api.update('/service-schedule/' + id,Object.assign(formData, {claims_service: []}));
        } else {
            ajaxCall = api.post('/service-schedule',Object.assign(formData,{company_id: props.company?.id, claims_service: []}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/service-schedules/list`);
        }, (error) => {
            if(error.response.status === 400 && error.response.data.hasOwnProperty('errors')){
                for(let fieldName in error.response.data.errors){
                    if(error.response.data.errors.hasOwnProperty(fieldName)){
                        methods.setError(fieldName, {type: 'custom', message: error.response.data.errors[fieldName].join('<br>')});
                    }
                }
            }
        });
    };

    const getData = () => {
        const defaultData = {
            checklist_version_id: null,
            client_vehicle_id: null,
            code: null,
            promised_date: new Date(),
            client_id: null,
            technical_consultant_id: null,
        };

        new Promise((resolve) => {
            if(id){
                api.get('/service-schedule/' + id).then((response) => {
                    const {client_vehicle: clientVehicle, client_vehicle_id,code,promised_date,client_id,technical_consultant_id, checklist_version_id, checklist_version: checklistVersion, client, technical_consultant: technicalConsultant, vehicle_service: vehicleService} = response.data.data;

                    resolve({
                        client_vehicle_id,code,promised_date: new Date(promised_date),client_id,technical_consultant_id, checklist_version_id, checklistVersion, technicalConsultant, client, clientVehicle, vehicleService
                    });
                },(error) => {
                    resolve(defaultData);
                });
            } else {
                resolve(defaultData);
            }
        }).then((data) => {
            const storage = JSON.parse(localStorage.getItem('serviceSchedule'));
            if(storage){
                storage.promised_date = new Date(storage.promised_date);

                Object.assign(data, storage);
            }

            if(props?.client){
                Object.assign(data, {client: props?.client, client_id: props?.client?.id});
            }

            if(props?.clientVehicle){
                Object.assign(data, {clientVehicle: props?.clientVehicle, client_vehicle_id: props?.clientVehicle?.id});
            }

            setData(data);
        });
    };

    const getChecklistVersions = () => {
        api.get('/checklist-version/active-checklist-versions').then((response) => {
            setChecklistVersions(getAllOptions(response.data.data, data?.checklistVersion));
        },(error) => {
            setChecklistVersions([])
        });
    };

    const getTechnicalConsultants = () => {
        api.get('/technical-consultant/active-technical-consultants',{company_id: props.company?.id}).then((response) => {
            setTechnicalConsultants(getAllOptions(response.data.data, data?.technicalConsultant));
        },(error) => {
            setTechnicalConsultants([]);
        });
    };

    const handleChangePromisedDate = (date) => {
        methods.setValue('promised_date', date);
    };

    const onClickChecklist = (e) => {
        e.preventDefault();

        history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
    };

    const onHideModal = () => {
        setShowModal(false);
        setReports([]);
    };

    const onClickPrintChecklist = (e) => {
        e.preventDefault();

        api.get('/vehicle-service/' + data?.vehicleService?.id + '/reports').then((response) => {
            setShowModal(true);
            setReports(response.data.data);
        },() => {
            onHideModal();
        });
    };

    const onClickPrintReport = (reportId) => {
        api.post('/checklist-version/' + data?.vehicleService?.id + '/print', {id: reportId}).then((response) => {
            window.open(response.data.data.report, '_blank');
        },() => {

        });
    };

    const onClickSendReport = (reportId) => {
        api.post('/checklist-version/' + data?.vehicleService?.id + '/send', {id: reportId}).then((response) => {
            swal({
                title: 'Enviado',
                text: 'El reporte ha sido enviado al cliente.',
                icon: 'success',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
            });
        },() => {

        });
    };

    const onClickDeleteReport = (reportId) => {
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
                api.delete('/checklist-version/' + data?.vehicleService?.id + '/report/' + reportId).then((response) => {
                    setReports(reports.filter((report) => report.id !== reportId));
                },() => {

                });
            }
        });
    };

    const onPreviousButton = () => {
      localStorage.setItem('serviceSchedule', JSON.stringify(methods.getValues()));
    };

    useEffect(() => {
        setClientInfo(props?.client);
        setClientVehicleInfo(props?.clientVehicle);
    }, [props?.client, props?.clientVehicle]);

    useEffect(() => {
        if(data){
            getChecklistVersions();
            getTechnicalConsultants();

            if(data.client){
                setClientInfo(data.client);
            }

            if(data.clientVehicle){
                setClientVehicleInfo(data.clientVehicle);
            }
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('code', data?.code ?? null);
        methods.setValue('promised_date', data?.promised_date ?? new Date());
        methods.setValue('client_id', data?.client_id ?? null);
        methods.setValue('technical_consultant_id', data?.technical_consultant_id ?? null);
        methods.setValue('client_vehicle_id', data?.client_vehicle_id ?? null);
        methods.setValue('checklist_version_id', data?.checklist_version_id ?? null);
    }, [data]);

    return (
        <Row>
            <Modal show={showModal} onHide={onHideModal} size="lg" scrollable={true}>
                <Modal.Header onHide={onHideModal} closeButton>
                    <h4 className="modal-title">
                        Reportes
                    </h4>
                </Modal.Header>
                <Modal.Body>
                    <table className="w-100 table table-bordered">
                        <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Archivo</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((report) => (
                          <tr key={report.id}>
                              <td>{moment(report.date).format('DD/MM/YYYY H:mma')}</td>
                              <td>{report.filename.split('/').pop()}</td>
                              <td className="d-flex justify-content-around">
                                  <OverlayTrigger placement="left" overlay={<Tooltip>Imprimir</Tooltip>}>
                                      <span onClick={() => {onClickPrintReport(report.id)}}><i className="mdi mdi-printer-outline mdi-18px cursor-pointer" /></span>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="left" overlay={<Tooltip>Enviar</Tooltip>}>
                                      <span onClick={() => {onClickSendReport(report.id)}}><i className="mdi mdi-email-send-outline mdi-18px cursor-pointer" /></span>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="left" overlay={<Tooltip>Excluir</Tooltip>}>
                                      <span className="cursor-pointer" onClick={() => {onClickDeleteReport(report.id)}}><i className="mdi mdi-trash-can-outline mdi-18px"/></span>
                                  </OverlayTrigger>
                              </td>
                          </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>

            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row>
                <Col md={6}>
                    <FormInput
                        label="Versão do checklist"
                        type="select"
                        name="checklist_version_id"
                        containerClass={'mb-3'}
                        options={checklistVersions}
                        {...otherProps}
                    />

                    <FormInput
                        label="Data Prometida"
                        type="datepicker"
                        name="promised_date"
                        placeholder="data prometida"
                        containerClass={'mb-3'}
                        handleChange={handleChangePromisedDate}
                        {...otherProps}
                    />

                    <Card>
                        <Card.Header>
                            <h4>Informações do cliente</h4>
                        </Card.Header>
                        <Card.Body>
                            <table>
                                <tbody>
                                <tr>
                                    <td><b>Nome do cliente</b></td>
                                    <td>{clientInfo?.name}</td>
                                </tr>
                                <tr>
                                    <td><b>Documento</b></td>
                                    <td>{clientInfo?.document}</td>
                                </tr>
                                <tr>
                                    <td><b>Endereço</b></td>
                                    <td>{clientInfo?.address}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="success" type="buttom" onClick={() => {onPreviousButton();props?.handleReturnToClientList(props?.pushButton);}}>
                                Editar
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>

                <Col md={6}>
                    <FormInput
                        label="Consultor Técnico"
                        type="select"
                        name="technical_consultant_id"
                        containerClass={'mb-3'}
                        options={technicalConsultants}
                        {...otherProps}
                    />

                    <FormInput
                        label="Código"
                        type="text"
                        name="code"
                        placeholder="Digite Código"
                        containerClass={'mb-3'}
                        {...otherProps}
                    />

                    <Card>
                        <Card.Header>
                            <h4>Informações do veículo</h4>
                        </Card.Header>
                        <Card.Body>
                            <table>
                                <tbody>
                                <tr>
                                    <td><b>Marca</b></td>
                                    <td>{clientVehicleInfo?.vehicle.model.brand.name}</td>
                                </tr>
                                <tr>
                                    <td><b>Modelo</b></td>
                                    <td>{clientVehicleInfo?.vehicle.model.name}</td>
                                </tr>
                                <tr>
                                    <td><b>Placa</b></td>
                                    <td>{clientVehicleInfo?.plate}</td>
                                </tr>
                                <tr>
                                    <td><b>Chassi</b></td>
                                    <td>{clientVehicleInfo?.chasis}</td>
                                </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="success" type="button" onClick={() => {onPreviousButton();props?.handleReturnToClientVehicleList(props?.pushButton);}}>
                                Editar
                            </Button>
                        </Card.Footer>
                    </Card>

                    <div className={classNames({'d-grid': id, 'd-none': !id})}>
                        <Button variant="primary" size={'lg'} type="button" onClick={onClickChecklist}>
                            Checklist
                        </Button>
                        <div className="mb-3"/>
                        <Button className={classNames({'d-none': !(data?.vehicleService ?? false)})} variant="primary" size={'lg'} type="button" onClick={onClickPrintChecklist}>
                            Print Checklist
                        </Button>
                    </div>
                </Col>
            </Row>

            <div className="mb-3 mb-0">
                <Button variant="primary" type="submit">
                    Cadastro
                </Button>
            </div>
        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Form;
