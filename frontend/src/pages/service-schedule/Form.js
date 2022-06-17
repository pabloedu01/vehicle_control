// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row} from "react-bootstrap";
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

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [clients, setClients] = useState([]);
    const [checklistVersions, setChecklistVersions] = useState([]);
    const [technicalConsultants, setTechnicalConsultants] = useState([]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            checklist_version_id: yup.number().required('Por favor, digite Versão do Reporte'),
            brand_id: yup.number().required('Por favor, digite Marca'),
            model_id: yup.number().required('Por favor, digite Modelo'),
            vehicle_id: yup.number().required('Por favor, digite Vehiculo'),
            code: yup.string().required('Por favor, digite Código'),
            chasis: yup.string().required('Por favor, digite Chasis'),
            plate: yup.string().required('Por favor, digite Plate'),
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
            brand_id: null,
            model_id: null,
            vehicle_id: null,
            code: null,
            chasis: null,
            plate: null,
            promised_date: new Date(),
            client_id: null,
            technical_consultant_id: null,
        };

        if(id){
            api.get('/service-schedule/' + id).then((response) => {
                const {vehicle:{model: {brand_id}, model: {brand}, model},vehicle:{model_id},vehicle_id,code,chasis,plate,promised_date,client_id,technical_consultant_id, checklist_version_id, checklist_version: checklistVersion, vehicle, client, technical_consultant: technicalConsultant} = response.data.data;

                setData({
                    vehicle_id,model_id,brand_id,code,chasis,plate,promised_date: new Date(promised_date),client_id,technical_consultant_id, checklist_version_id, checklistVersion, brand, model, technicalConsultant, client, vehicle
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const getBrands = () => {
        api.get('/vehicle-brand/active-brands',{company_id: props.company?.id}).then((response) => {
            setBrands(getAllOptions(response.data.data, data?.brand));
        },(error) => {
            setBrands([]);
        });
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

    const getModels = (brand_id?) => {
        api.get('/vehicle-model/active-vehicle-models',{brand_id: brand_id ?? methods.getValues('brand_id')}).then((response) => {
            setModels(getAllOptions(response.data.data, data?.model, (brand_id ?? methods.getValues('brand_id')) === data?.brand_id));
        },(error) => {
            setModels([]);
        });
    };

    const getVehicles = (model_id?) => {
        api.get('/vehicle/active-vehicles',{model_id: model_id ?? methods.getValues('model_id')}).then((response) => {
            setVehicles(getAllOptions(response.data.data, data?.vehicle,(model_id ?? methods.getValues('model_id')) === data?.model_id));
        },(error) => {
            setVehicles([]);
        });
    };

    const handleChangeBrand = () => {
        getModels();

        methods.setValue('model_id', null);
        methods.setValue('vehicle_id', null);
        setVehicles([]);
    };

    const handleChangeModel = () => {
        getVehicles();

        methods.setValue('vehicle_id', null);
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
            console.log('url', response.data.data.report);

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
            getBrands();
            getModels(data.brand_id);
            getVehicles(data.model_id);
            getClients();
            getChecklistVersions();
            getTechnicalConsultants();
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('code', data?.code ?? null);
        methods.setValue('chasis', data?.chasis ?? null);
        methods.setValue('plate', data?.plate ?? null);
        methods.setValue('promised_date', data?.promised_date ?? new Date());
        methods.setValue('client_id', data?.client_id ?? null);
        methods.setValue('technical_consultant_id', data?.technical_consultant_id ?? null);
        methods.setValue('brand_id', data?.brand_id ?? null);
        methods.setValue('model_id', data?.model_id ?? null);
        methods.setValue('vehicle_id', data?.vehicle_id ?? null);
        methods.setValue('checklist_version_id', data?.checklist_version_id ?? null);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Horários de Serviço', path: '/service-schedules/list' },
                    { label: 'Cadastro', path: `/service-schedules/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Horários de Serviço'}
                company={props.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Row>
                                    <Col md={6}>
                                        <FormInput
                                            label="Versão do Reporte"
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
                                            label="Marca"
                                            type="select"
                                            name="brand_id"
                                            containerClass={'mb-3'}
                                            options={brands}
                                            handleChange={handleChangeBrand}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Modelo"
                                            type="select"
                                            name="model_id"
                                            containerClass={'mb-3'}
                                            options={models}
                                            handleChange={handleChangeModel}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Vehiculo"
                                            type="select"
                                            name="vehicle_id"
                                            containerClass={'mb-3'}
                                            options={vehicles}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Chasis"
                                            type="text"
                                            name="chasis"
                                            placeholder="Digite Chasis"
                                            containerClass={'mb-3'}
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

                                        <FormInput
                                            label="Placa"
                                            type="text"
                                            name="plate"
                                            placeholder="Digite Placa"
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
        </>
    );
};

export default Form;
