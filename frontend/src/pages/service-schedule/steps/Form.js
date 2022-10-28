// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row} from "react-bootstrap";
import {APICore} from "../../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {FormInput} from "../../../components";
import moment from 'moment';
import MaskedInput from 'react-text-mask';
// import classNames from "classnames";
import {getAllOptions} from "../../../utils/selectOptionsForm";

const api = new APICore();

const Form = (props: { company?: any, clientVehicle?: any, client?: any, handleReturnToClientList?: any, handleReturnToClientVehicleList?: any, pushButton?: any }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [technicalConsultants, setTechnicalConsultants] = useState([]);
    const [clientInfo, setClientInfo] = useState();
    const [clientVehicleInfo, setClientVehicleInfo] = useState(null);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            client_vehicle_id: yup.number().nullable().required('Por favor, digite Vehiculo'),
            code: yup.string().nullable(),
            promised_date: yup.date().nullable().required('Por favor, digite Data Prometida'),
            client_id: yup.number().nullable().required('Por favor, digite Cliente'),
            technical_consultant_id: yup.number().nullable().required('Por favor, digite Consultor Técnico'),
        })
    );

    /*
     * form methods
     */
    const methods = useForm({
        resolver: schemaResolver,
        defaultValues: {}
    });

    const {
        handleSubmit,
        register,
        control,
        formState: {errors},
    } = methods;

    const otherProps = {
        register,
        errors,
        control
    };

    const onSubmit = (formData) => {
        let ajaxCall;

        formData.promised_date = moment(formData.promised_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00');

        if(id){
            ajaxCall = api.update('/service-schedule/' + id, Object.assign(formData, {claims_service: []}));
        }
        else{
            ajaxCall = api.post('/service-schedule', Object.assign(formData, {
                company_id: props.company?.id,
                claims_service: []
            }));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/service-schedules/list`);
        }, (error) => {
            if(error.response.status === 400 && error.response.data.hasOwnProperty('errors')){
                for(let fieldName in error.response.data.errors){
                    if(error.response.data.errors.hasOwnProperty(fieldName)){
                        methods.setError(fieldName, {
                            type: 'custom',
                            message: error.response.data.errors[fieldName].join('<br>')
                        });
                    }
                }
            }
        });
    };

    const getData = () => {
        const defaultData = {
            client_vehicle_id: null,
            code: null,
            promised_date: moment().format('YYYY-MM-DDTHH:mm'),
            client_id: null,
            technical_consultant_id: null,
        };

        new Promise((resolve) => {
            if(id){
                api.get('/service-schedule/' + id).then((response) => {
                    const {client_vehicle: clientVehicle, client_vehicle_id, code, promised_date, client_id, technical_consultant_id, client, technical_consultant: technicalConsultant, vehicle_service: vehicleService} = response.data.data;

                    resolve({
                        client_vehicle_id,
                        code,
                        promised_date: promised_date,
                        client_id,
                        technical_consultant_id,
                        technicalConsultant,
                        client,
                        clientVehicle,
                        vehicleService
                    });
                }, (error) => {
                    resolve(defaultData);
                });
            }
            else{
                resolve(defaultData);
            }
        }).then((data) => {
            const storage = JSON.parse(localStorage.getItem('serviceSchedule'));
            if(storage){
                /*storage.promised_date = new Date(storage.promised_date);*/

                Object.assign(data, storage);
            }

            if(props?.client){
                Object.assign(data, {
                    client: props?.client,
                    client_id: props?.client?.id
                });
            }

            if(props?.clientVehicle){
                Object.assign(data, {
                    clientVehicle: props?.clientVehicle,
                    client_vehicle_id: props?.clientVehicle?.id
                });
            }

            setData(data);
        });
    };

    const getTechnicalConsultants = () => {
        api.get('/technical-consultant/active-technical-consultants', {company_id: props.company?.id}).then((response) => {
            setTechnicalConsultants(getAllOptions(response.data.data, data?.technicalConsultant));
        }, (error) => {
            setTechnicalConsultants([]);
        });
    };

    const onClickChecklist = (e) => {
        e.preventDefault();

        history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
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
        methods.setValue('promised_date', moment(data?.promised_date).format('YYYY-MM-DDTHH:mm') ?? moment().format('YYYY-MM-DDTHH:mm'));
        methods.setValue('client_id', data?.client_id ?? null);
        methods.setValue('technical_consultant_id', data?.technical_consultant_id ?? null);
        methods.setValue('client_vehicle_id', data?.client_vehicle_id ?? null);
    }, [data]);

    return (
        <Row>
            <Col lg={7}>
                <Card>
                    <Card.Body className="pt-4 px-4 pb-4">
                        <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Cliente</h4>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Nome :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="Text"
                                    name="name"
                                    placeholder="Digite seu Nome"  
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>CPF :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite seu CPF"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Telefone :</span>
                            </Col>
                            <Col lg={10}>
                                <Row >
                                    <Col lg={9} >
                                          <MaskedInput
                                mask={[
                                    '(',
                                    /[1-9]/,
                                    /\d/,
                                    ')',
                                    ' ',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    '-',
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                    /\d/,
                                ]}
                                placeholder="(__) ____-____"
                                className="form-control"
                            />
                                    </Col>
                                    <Col lg={3} >
                                        <Button  variant="primary" type="button" style={{width: '100%', minWidth: '60px'}} >
                                            Adicionar
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Email :</span>
                            </Col>
                            <Col lg={10}>
                                <Row>
                                    <Col lg={9} >
                                        <FormInput
                                            type="Text"
                                            name="name"
                                            placeholder="Digite seu email"
                                        />
                                            </Col>
                                    <Col lg={3} >
                                        <Button  variant="primary" type="button" style={{width: '100%', minWidth: '60px'}} >
                                            Adicionar
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Endereço :</span>
                            </Col>
                            <Col lg={10}>
                                <Row>
                                    <Col lg={9} >
                                        <FormInput
                                            type="Text"
                                            name="name"
                                            placeholder="Digite seu endereço"
                                        />
                                            </Col>
                                    <Col lg={3} >
                                        <Button  variant="primary" type="button" style={{width: '100%', minWidth: '60px'}}>
                                            Adicionar
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                       
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="pt-4 px-4 pb-4">
                        <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Veículo</h4>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Marca :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="Text"
                                    name="name"
                                    placeholder="Digite a marca"  
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Modelo :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite o modelo"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Veículo :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite o veículo"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Chassi :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite o chassi"
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg={2} className="d-flex align-items-center">
                                <span>Placa :</span>
                            </Col>
                            <Col lg={10}>
                                <FormInput
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite placa"
                                />
                            </Col>
                        </Row>
                    


                       
                    </Card.Body>
                </Card>
            </Col>

             

            <Col lg={5}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col lg={6}>
                                
                            </Col>
                            <Col lg={6}>
                              
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Form;
