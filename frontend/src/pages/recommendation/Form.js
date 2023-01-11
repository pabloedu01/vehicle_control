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
import {getAllOptions} from "../../utils/selectOptionsForm";
import ServicesSelection from "./ServiceSelection";

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [claimServices, setClaimServices] = useState([]);
    const [maintenanceReviews, setMaintenanceReviews] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            brand_id: yup.number().nullable().required('Por favor, digite Marca'),
            model_id: yup.number().nullable().required('Por favor, digite Modelo'),
            vehicle_id: yup.number().nullable().required('Por favor, digite Veículo'),
            claim_service_id: yup.number().nullable().required('Por favor, digite Reclamações'),
            maintenance_review_id: yup.number().nullable().required('Por favor, digite Revisión de Mantenimiento'),
            service_type_id: yup.number().nullable().required('Por favor, digite Tipo de Servicio'),
            name: yup.string(),
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

        if(id){
            ajaxCall = api.update('/recommendation/' + id,{...formData, services: selectedServices});
        } else {
            ajaxCall = api.post('/recommendation',{...formData, services: selectedServices, company_id: props.company?.id});
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/recommendations/list`);
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
            brand_id: null,
            model_id: null,
            vehicle_id: null,
            claim_service_id: null,
            maintenance_review_id: null,
            service_type_id: null,
            name: null,
            brand: null,
            model: null,
            vehicle: null,
            maintenanceReview: null,
            serviceType: null,
            claimService: null,
            services: []
        };

        if(id){
            api.get('/recommendation/' + id).then((response) => {
                const {services,vehicle:{model: {brand_id, brand}, model},vehicle:{model_id},vehicle_id, name, vehicle, claim_service: claimService, maintenance_review: maintenanceReview, service_type: serviceType, service_type_id, claim_service_id, maintenance_review_id} = response.data.data;

                setSelectedServices(services.map((item) => {
                    return {
                      id: item.id,
                      name: item.description,
                      value: item.pivot?.value ?? ''
                    };
                }));

                setData({
                    name, model_id, brand_id, vehicle_id, service_type_id, claim_service_id, maintenance_review_id, brand, model, vehicle, claimService, maintenanceReview, serviceType, services
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const handleChangeBrand = () => {
        getModels();

        methods.setValue('model_id', null);
        methods.setValue('vehicle_id', null);
        setVehicles([]);
    };

    const getServices = (serviceTypeId?) => {
        api.get('/service/active-services', {service_type_id: serviceTypeId ?? methods.getValues('service_type_id')}).then((response) => {
            setServices(response.data.data.map((service) => {
                return {
                    id: service.id,
                    name: service.description,
                };
            }));
        },(error) => {
            setServices([]);
        });
    };

    const handleChangeServiceType = () => {
        getServices();
    };

    const handleChangeModel = () => {
        getVehicles();
        getMaintenanceReviews();

        methods.setValue('vehicle_id', null);
        methods.setValue('maintenance_review_id', null);
    };

    const getBrands = () => {
        api.get('/vehicle-brand/active-brands',{company_id: props.company?.id}).then((response) => {
            setBrands(getAllOptions(response.data.data, data?.brand));
        },(error) => {
            setBrands([]);
        });
    };

    const getClaimServices = () => {
        api.get('/claim-service',{company_id: props.company?.id}).then((response) => {
            setClaimServices(getAllOptions(response.data.data, data?.claimService, true, 'id', 'description'));
        },(error) => {
            setClaimServices([]);
        });
    };

    const getMaintenanceReviews = (model_id?) => {
        api.get('/maintenance-review',{model_id: model_id ?? methods.getValues('model_id')}).then((response) => {
            setMaintenanceReviews(getAllOptions(response.data.data, data?.maintenanceReview,(model_id ?? methods.getValues('model_id')) === data?.model_id));
        },(error) => {
            setMaintenanceReviews([]);
        });
    };

    const getServiceTypes = () => {
        api.get('/service-type',{company_id: props.company?.id}).then((response) => {
            setServiceTypes(getAllOptions(response.data.data, data?.serviceType));
        },(error) => {
            setServiceTypes([]);
        });
    };

    const getModels = (brand_id?) => {
        api.get('/vehicle-model/active-vehicle-models',{brand_id: brand_id ?? methods.getValues('brand_id')}).then((response) => {
            setModels(getAllOptions(response.data.data, data?.model,(brand_id ?? methods.getValues('brand_id')) === data?.brand_id));
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

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        if(data){
            getBrands();
            getClaimServices();
            getServiceTypes();
            getClaimServices();

            if(id)
            {
                getServices(data.service_type_id);
                getModels(data.brand_id);
                getMaintenanceReviews(data.model_id);
                getVehicles(data.model_id);
            }
        }
    }, [data]);

    useEffect(() => {
        methods.setValue('brand_id', data?.brand_id ?? null);
        methods.setValue('model_id', data?.model_id ?? null);
        methods.setValue('vehicle_id', data?.vehicle_id ?? null);
        methods.setValue('claim_service_id', data?.claim_service_id ?? null);
        methods.setValue('maintenance_review_id', data?.maintenance_review_id ?? null);
        methods.setValue('service_type_id', data?.service_type_id ?? null);
        methods.setValue('name', data?.name ?? null);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Recomendaciones', path: '/recommendations/list' },
                    { label: 'Cadastro', path: `/recommendations/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Recomendaciones'}
                company={props.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit, (e) => {})} noValidate>
                                <Row>
                                    <Col md={6}>
                                        <FormInput
                                            label="Nome"
                                            type="text"
                                            name="name"
                                            placeholder="Digite Nome"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Reclamaçõ"
                                            type="select"
                                            name="claim_service_id"
                                            containerClass={'mb-3'}
                                            options={claimServices}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Tipo de Servicio"
                                            type="select"
                                            name="service_type_id"
                                            containerClass={'mb-3'}
                                            options={serviceTypes}
                                            handleChange={handleChangeServiceType}
                                            {...otherProps}
                                        />
                                    </Col>


                                    <Col md={6}>

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
                                            label="Veículo"
                                            type="select"
                                            name="vehicle_id"
                                            containerClass={'mb-3'}
                                            options={vehicles}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Revisión de Mantenimiento"
                                            type="select"
                                            name="maintenance_review_id"
                                            containerClass={'mb-3'}
                                            options={maintenanceReviews}
                                            {...otherProps}
                                        />

                                    </Col>

                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <ServicesSelection company={props?.company} available={services} selected={selectedServices} id={id} onChange={setSelectedServices}/>
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
