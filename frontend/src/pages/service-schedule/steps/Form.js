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
import classNames from "classnames";
import {getAllOptions} from "../../../utils/selectOptionsForm";

const api = new APICore();

const Form = (props: {company?: any, clientVehicle?:any, client?:any, handleReturnToClientList?:any, handleReturnToClientVehicleList?:any, pushButton?:any}): React$Element<React$FragmentType> => {
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
            client_vehicle_id: null,
            code: null,
            promised_date: moment().format('YYYY-MM-DDTHH:mm'),
            client_id: null,
            technical_consultant_id: null,
        };

        new Promise((resolve) => {
            if(id){
                api.get('/service-schedule/' + id).then((response) => {
                    const {client_vehicle: clientVehicle, client_vehicle_id,code,promised_date,client_id,technical_consultant_id, client, technical_consultant: technicalConsultant, vehicle_service: vehicleService} = response.data.data;

                    resolve({
                        client_vehicle_id,code,promised_date: promised_date,client_id,technical_consultant_id, technicalConsultant, client, clientVehicle, vehicleService
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
                /*storage.promised_date = new Date(storage.promised_date);*/

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

    const getTechnicalConsultants = () => {
        api.get('/technical-consultant/active-technical-consultants',{company_id: props.company?.id}).then((response) => {
            setTechnicalConsultants(getAllOptions(response.data.data, data?.technicalConsultant));
        },(error) => {
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
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row>
                <Col md={6}>
                    <FormInput
                        label="Data Prometida"
                        type="datetime-local"
                        name="promised_date"
                        placeholder="data prometida"
                        containerClass={'mb-3'}
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
