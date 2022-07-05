// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, ProgressBar, Row, Form} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {FormInput} from "../../components";
import moment from 'moment';
import swal from "sweetalert";
import classNames from "classnames";
import {getAllOptions} from "../../utils/selectOptionsForm";
import { Wizard, Steps, Step } from 'react-albus';
import ClientVehicleForm from '../client-vehicle/Form';

const api = new APICore();

const ServiceScheduleForm = (props: {company?: any, clientVehicle?:any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [clientVehicles, setClientVehicles] = useState([]);
    const [clients, setClients] = useState([]);
    const [checklistVersions, setChecklistVersions] = useState([]);
    const [technicalConsultants, setTechnicalConsultants] = useState([]);

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
            client_vehicle_id: props?.clientVehicle?.id ?? null,
            code: null,
            promised_date: new Date(),
            client_id: null,
            technical_consultant_id: null,
        };

        if(id){
            api.get('/service-schedule/' + id).then((response) => {
                const {client_vehicle: clientVehicle, client_vehicle_id,code,promised_date,client_id,technical_consultant_id, checklist_version_id, checklist_version: checklistVersion, client, technical_consultant: technicalConsultant} = response.data.data;

                setData({
                    client_vehicle_id,code,promised_date: new Date(promised_date),client_id,technical_consultant_id, checklist_version_id, checklistVersion, technicalConsultant, client, clientVehicle
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const getClients = () => {
        api.get('/client/active-clients',{company_id: props.company?.id}).then((response) => {
            setClients(getAllOptions(response.data.data, data?.client));
        },(error) => {
            setClients([]);
        });
    };

    const getChecklistVersions = () => {
        api.get('/checklist-version/active-checklist-versions').then((response) => {
            setChecklistVersions(getAllOptions(response.data.data, data?.checklistVersion));
        },(error) => {
            setChecklistVersions([]);
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

    const onClickChecklist = (e) => {
        e.preventDefault();

        history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
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

    useEffect(() => {
        if(data){
            getClients();
            getChecklistVersions();
            getTechnicalConsultants();
            getClientVehicles();
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
                        label="Cliente"
                        type="select"
                        name="client_id"
                        containerClass={'mb-3'}
                        options={clients}
                        {...otherProps}
                    />

                    <FormInput
                        label="Vehiculo"
                        type="select"
                        name="client_vehicle_id"
                        containerClass={'mb-3'}
                        options={clientVehicles}
                        {...otherProps}
                    />

                    <FormInput
                        label="Consultor Técnico"
                        type="select"
                        name="technical_consultant_id"
                        containerClass={'mb-3'}
                        options={technicalConsultants}
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

                    <FormInput
                        label="Código"
                        type="text"
                        name="code"
                        placeholder="Digite Código"
                        containerClass={'mb-3'}
                        {...otherProps}
                    />

                </Col>

                <Col md={6}>
                    <div className={classNames({'d-grid': id, 'd-none': !id})}>
                        <Button variant="primary" size={'lg'} type="buttom" onClick={onClickChecklist}>
                            Checklist
                        </Button>
                        <div className="mb-3"/>
                        <Button  variant="primary" size={'lg'} type="buttom" onClick={onClickPrintChecklist}>
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

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const onSearch = () => {
        api.get('/client-vehicle/search', {search}).then((response) => {
            setClientVehicle(response.data.data);
        }).catch(() => {
            setClientVehicle(null);
        });
    };

    const onDoneAction = (data, push) => {
        setClientVehicle(data);

        if(push){
            push('form');
        }
    };

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
                            {id ? <ServiceScheduleForm company={props?.company}/> :

                                <Wizard
                                    render={({step, steps}) => (<>
                                        <ProgressBar
                                            animated
                                            striped
                                            variant="success"
                                            now={((steps.indexOf(step) + 1) / steps.length) * 100}
                                            className="progress-sm"
                                        />

                                        <Steps>
                                            <Step
                                                id="createClientVehicle"
                                                render={({previous,push}) => (
                                                    <>
                                                        <Row className="justify-content-center mb-5 mt-5">
                                                            <Col xs={3}>
                                                                <Form.Control
                                                                    size="lg"
                                                                    type="text"
                                                                    placeholder="Buscar"
                                                                    onChange={(e) => {
                                                                        handleSearchChange(e.target.value);
                                                                    }}
                                                                    autoComplete="off">
                                                                </Form.Control>
                                                            </Col>
                                                            <Col xs={1}>
                                                                <Button size="lg" onClick={() => {onSearch();}} variant="success">Buscar</Button>
                                                            </Col>
                                                        </Row>

                                                        <ClientVehicleForm clientVehicle={clientVehicle} doneAction={onDoneAction} pushButton={push} isTag={true} company={props?.company}/>
                                                    </>

                                                    )}
                                            />

                                            <Step
                                                id="form"
                                                render={() => (<ServiceScheduleForm clientVehicle={clientVehicle} company={props?.company}/>)}
                                            />
                                        </Steps>

                                    </>)}
                                />
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default View;
