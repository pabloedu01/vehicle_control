// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, ProgressBar, Row, Form, Modal} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {FormInput} from "../../components";
import moment from 'moment';
import swal from "sweetalert";
import classNames from "classnames";
import {getAllOptions, setCreateOption} from "../../utils/selectOptionsForm";
import { Wizard, Steps, Step } from 'react-albus';
import ClientVehicleForm from '../client-vehicle/Form';
import ClientForm from '../client/Form';
import Select from "react-select";

const api = new APICore();

const ServiceScheduleForm = (props: {company?: any, clientVehicle?:any, client?:any, onClientEdit?:any, onClientVehicleEdit?:any, pushButton?:any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [clientVehicles, setClientVehicles] = useState([]);
    const [clients, setClients] = useState([]);
    const [checklistVersions, setChecklistVersions] = useState([]);
    const [technicalConsultants, setTechnicalConsultants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalForm, setModalForm] = useState();
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
                    const {client_vehicle: clientVehicle, client_vehicle_id,code,promised_date,client_id,technical_consultant_id, checklist_version_id, checklist_version: checklistVersion, client, technical_consultant: technicalConsultant} = response.data.data;

                    resolve({
                        client_vehicle_id,code,promised_date: new Date(promised_date),client_id,technical_consultant_id, checklist_version_id, checklistVersion, technicalConsultant, client, clientVehicle
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

    const getClients = () => {
        api.get('/client/active-clients',{company_id: props.company?.id}).then((response) => {
            setClients(setCreateOption(getAllOptions(response.data.data, data?.client, true, 'id', 'fullName'), 'Novo Cliente'));
        },(error) => {
            setClients([]);
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

    const getClientVehicles = () => {
        api.get('/client-vehicle/all').then((response) => {
            setClientVehicles(getAllOptions(response.data.data, data?.clientVehicle));
        },(error) => {
            setClientVehicles([]);
        });
    };

    const handleChangePromisedDate = (date) => {
        methods.setValue('promised_date', date);
    };

    const handleChangeClient = (id) => {
        if(id === 0){
            setShowModal(true);
            setModalForm('client');
        }
    };

    const onClickChecklist = (e) => {
        e.preventDefault();

        history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
    };

    const onHideModal = () => {
        setShowModal(false);
        setModalForm(null);
    };

    const handleDoneActionClient = (newClient) => {
        setClients([...clients, {value: newClient.id, label: newClient.fullName}]);
        methods.setValue('client_id', newClient.id);

        onHideModal();
    };

    const onClickPrintChecklist = (e) => {
        e.preventDefault();

        api.post('/checklist-version/' + methods.getValues('checklist_version_id') + '/print', {type: 'service-schedules', id: id, utcOffset: moment().utcOffset()}).then((response) => {
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

    const onPreviousButton = () => {
      localStorage.setItem('serviceSchedule', JSON.stringify(methods.getValues()));
    };

    useEffect(() => {
        setClientInfo(props?.client);
        setClientVehicleInfo(props?.clientVehicle);
    }, [props?.client, props?.clientVehicle]);

    useEffect(() => {
        if(data){
            getClients();
            getChecklistVersions();
            getTechnicalConsultants();
            getClientVehicles();

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
                        {
                            modalForm === null ? '' :
                                (modalForm === 'client' ? clients[0].label : '')
                        }
                    </h4>
                </Modal.Header>
                <Modal.Body>
                    {
                        modalForm === null ? '' :
                            (modalForm === 'client' ? <ClientForm company={props?.company} isTag={true} doneAction={handleDoneActionClient} /> : '')
                    }
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
                            <Button variant="success" type="buttom" onClick={() => {onPreviousButton();props?.onClientEdit(clientInfo,props?.pushButton);}}>
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
                            <Button variant="success" type="button" onClick={() => {onPreviousButton();props?.onClientVehicleEdit(clientVehicleInfo, props?.pushButton);}}>
                                Editar
                            </Button>
                        </Card.Footer>
                    </Card>

                    <div className={classNames({'d-grid': id, 'd-none': !id})}>
                        <Button variant="primary" size={'lg'} type="button" onClick={onClickChecklist}>
                            Checklist
                        </Button>
                        <div className="mb-3"/>
                        <Button  variant="primary" size={'lg'} type="button" onClick={onClickPrintChecklist}>
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

const View = (props: {company?: any}): React$Element<React$FragmentType> => {
    const {id} = useParams();
    const [search, setSearch] = useState(null);
    const [clientVehicle, setClientVehicle] = useState(null);
    const [client, setClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [alreadyInForm, setAlreadyInForm] = useState(false);

    const handleSearchClientVehicleChange = (value) => {
        setSearch(value);
    };

    const onSearchClientVehicle = () => {
        api.get('/client-vehicle/search', {search}).then((response) => {
            setClientVehicle(response.data.data);
        }).catch(() => {
            setClientVehicle(null);
        });
    };

    const onDoneClientVehicleAction = (data, push) => {
        setClientVehicle(data);

        if(push){
            if(alreadyInForm){
                push('form');
            } else {
                push('createClient');
            }
        }
    };

    const onClientEdit = (data,push) => {
        setClient(data);
        push('createClient');
    };

    const onClientVehicleEdit = (data,push) => {
        setClientVehicle(data);
        push('createClientVehicle');
    };

    const onDoneClientAction = (data, push) => {
        setClient(data);

        setAlreadyInForm(true);

        if(alreadyInForm){
            push('form');
        } else {
            push('form');
        }
    };

    const getClient = (id) => {
        if(id > 0) {
            api.get('/client/' + id).then((response) => {
                setClient(response.data.data);
            },(error) => {
                setClient(null);
            });
        } else {
            setClient(null);
        }
    };

    const getClients = () => {
        api.get('/client/active-clients',{company_id: props.company?.id}).then((response) => {
            setClients(setCreateOption(getAllOptions(response.data.data, null, true, 'id', 'fullName'), 'Novo Cliente'));
        },(error) => {
            setClients([]);
        });
    };

    useEffect(() => {
        getClients();

        if(id){
            setAlreadyInForm(true);
        }

        localStorage.setItem('serviceSchedule', null);
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Agenda de Serviços', path: '/service-schedules/list' },
                    { label: 'Cadastro', path: `/service-schedules/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Agenda de Serviços'}
                company={props.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body className="p-0">
                            <Wizard
                                render={({step, steps}) => (<>
                                    <ProgressBar
                                        animated
                                        striped
                                        variant="success"
                                        now={((step.id === 'createClientVehicle' ? 1 : (step.id === 'createClient' ? 2 : 3)) / steps.length) * 100}
                                        className="progress-sm"
                                    />

                                    {id ?
                                        <Steps>
                                            <Step
                                                id="form"
                                                render={({push}) => (<ServiceScheduleForm pushButton={push} onClientEdit={onClientEdit} onClientVehicleEdit={onClientVehicleEdit} clientVehicle={clientVehicle} client={client} company={props?.company}/>)}
                                            />

                                            <Step
                                                id="createClientVehicle"
                                                render={({push}) => (
                                                    <>
                                                        <Row className="justify-content-center mb-5 mt-5">
                                                            <Col xs={3}>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    placeholder="Buscar"
                                                                    onChange={(e) => {
                                                                        handleSearchClientVehicleChange(e.target.value);
                                                                    }}
                                                                    autoComplete="off">
                                                                </Form.Control>
                                                            </Col>
                                                            <Col xs={1}>
                                                                <Button size="lg" onClick={() => {onSearchClientVehicle();}} variant="success">Buscar</Button>
                                                            </Col>
                                                        </Row>

                                                        <ClientVehicleForm clientVehicle={clientVehicle} doneAction={onDoneClientVehicleAction} pushButton={push} isTag={true} company={props?.company}/>
                                                    </>

                                                )}
                                            />

                                            <Step
                                                id="createClient"
                                                render={({push}) => (
                                                    <>
                                                        <Row className="justify-content-center mb-5 mt-5">
                                                            <Col xs={3}>
                                                                <Select
                                                                    size="lg"
                                                                    className={"react-select"}
                                                                    classNamePrefix="react-select"
                                                                    name="client_id"
                                                                    options={clients}
                                                                    onChange={(selectedOption) => {
                                                                        getClient(selectedOption.value);
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>

                                                        <ClientForm client={client} doneAction={onDoneClientAction} pushButton={push} isTag={true} company={props?.company}/>
                                                    </>

                                                )}
                                            />
                                        </Steps>
                                    : <Steps>
                                            <Step
                                                id="createClientVehicle"
                                                render={({push}) => (
                                                    <>
                                                        <Row className="justify-content-center mb-5 mt-5">
                                                            <Col xs={3}>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    placeholder="Buscar"
                                                                    onChange={(e) => {
                                                                        handleSearchClientVehicleChange(e.target.value);
                                                                    }}
                                                                    autoComplete="off">
                                                                </Form.Control>
                                                            </Col>
                                                            <Col xs={1}>
                                                                <Button size="lg" onClick={() => {onSearchClientVehicle();}} variant="success">Buscar</Button>
                                                            </Col>
                                                        </Row>

                                                        <ClientVehicleForm clientVehicle={clientVehicle} doneAction={onDoneClientVehicleAction} pushButton={push} isTag={true} company={props?.company}/>
                                                    </>

                                                )}
                                            />

                                            <Step
                                                id="createClient"
                                                render={({push}) => (
                                                    <>
                                                        <Row className="justify-content-center mb-5 mt-5">
                                                            <Col xs={3}>
                                                                <Select
                                                                    size="lg"
                                                                    className={"react-select"}
                                                                    classNamePrefix="react-select"
                                                                    name="client_id"
                                                                    options={clients}
                                                                    onChange={(selectedOption) => {
                                                                        getClient(selectedOption.value);
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>

                                                        <ClientForm client={client} doneAction={onDoneClientAction} pushButton={push} isTag={true} company={props?.company}/>
                                                    </>

                                                )}
                                            />

                                            <Step
                                                id="form"
                                                render={({push}) => (<ServiceScheduleForm pushButton={push} onClientEdit={onClientEdit} onClientVehicleEdit={onClientVehicleEdit} clientVehicle={clientVehicle} client={client} company={props?.company}/>)}
                                            />
                                        </Steps>
                                    }
                                </>)}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default View;
