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
import classNames from 'classnames';

const api = new APICore();

const Form = (props: {company?: any, clientVehicle?: any, isTag?: boolean, plate?: string, chasis?: string, previousButton?: any, pushButton?: any, doneAction?:any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            brand_id: yup.number().required('Por favor, digite Marca'),
            model_id: yup.number().required('Por favor, digite Modelo'),
            vehicle_id: yup.number().required('Por favor, digite Vehiculo'),
            chasis: yup.string().nullable(),
            color: yup.string().nullable(),
            number_motor: yup.string().nullable(),
            renavan: yup.string().nullable(),
            plate: yup.string().required('Por favor, digite Placa'),
            mileage: yup.string().nullable(),
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

        if(props?.clientVehicle || id){
            ajaxCall = api.update('/client-vehicle/' + (props?.clientVehicle?.id || id),formData);
        } else {
            ajaxCall = api.post('/client-vehicle',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then((response) => {
            if(props?.doneAction){
                props?.doneAction(response.data.data, props?.pushButton);
            } else {
                history(`/panel/company/${props.company?.id}/client-vehicles/list`);
            }
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
            chasis: props?.chasis ?? null,
            color: null,
            number_motor: null,
            renavan: null,
            plate: props?.plate ?? null,
            mileage: null,
        };

        if(props?.isTag !== true && id){
            api.get('/client-vehicle/' + id).then((response) => {
                const {vehicle:{model: {brand_id, brand}, model},vehicle:{model_id},vehicle_id,chasis,color,number_motor,renavan,plate,mileage, vehicle} = response.data.data;

                setData({
                    vehicle_id,chasis,color,number_motor,renavan,plate,mileage,model_id,brand_id, brand, model, vehicle
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            if(props?.clientVehicle){
                const {vehicle:{model: {brand_id, brand}, model},vehicle:{model_id},vehicle_id,chasis,color,number_motor,renavan,plate,mileage, vehicle} = props?.clientVehicle;

                setData({
                    vehicle_id,chasis,color,number_motor,renavan,plate,mileage,model_id,brand_id, brand, model, vehicle
                });
            } else {
                setData(defaultData);
            }
        }
    };

    const getBrands = () => {
        api.get('/vehicle-brand/active-brands',{company_id: props.company?.id}).then((response) => {
            setBrands(getAllOptions(response.data.data, data?.brand));
        },(error) => {
            setBrands([]);
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

    useEffect(() => {
        if(data){
            getBrands();

            if(props?.isTag !== true && id || props?.clientVehicle){
                getModels(data.brand_id);
                getVehicles(data.model_id);
            }
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id, props?.clientVehicle]);

    useEffect(() => {
        methods.setValue('chasis', data?.chasis ?? null);
        methods.setValue('color', data?.color ?? null);
        methods.setValue('number_motor', data?.number_motor ?? null);
        methods.setValue('renavan', data?.renavan ?? null);
        methods.setValue('plate', data?.plate ?? null);
        methods.setValue('mileage', data?.mileage ?? null);
        methods.setValue('brand_id', data?.brand_id ?? null);
        methods.setValue('model_id', data?.model_id ?? null);
        methods.setValue('vehicle_id', data?.vehicle_id ?? null);
    }, [data]);

    return (
        <>
            {props?.isTag !== true ?
                <PageTitle
                    breadCrumbItems={[
                        { label: 'Veículo de passagem', path: '/client-vehicles/list' },
                        { label: 'Cadastro', path: `/client-vehicles/${id ? id + '/edit' : 'create'}`, active: true },
                    ]}
                    title={'Formulário de Veículo do Cliente'}
                    company={props.company}
                /> : null
            }

            <Row>
                <Col xs={12}>
                    <Card className={classNames({'mb-0': props?.isTag === true})}>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit, (e) => {})} noValidate>
                                <Row>
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
                                            label="Vehiculo"
                                            type="select"
                                            name="vehicle_id"
                                            containerClass={'mb-3'}
                                            options={vehicles}
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

                                        <FormInput
                                            label="KM"
                                            type="text"
                                            name="mileage"
                                            placeholder="Digite KM"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                    </Col>

                                    <Col md={6}>
                                        <FormInput
                                            label="Chasis"
                                            type="text"
                                            name="chasis"
                                            placeholder="Digite Chasis"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Color"
                                            type="text"
                                            name="color"
                                            placeholder="Digite Color"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Motor"
                                            type="text"
                                            name="number_motor"
                                            placeholder="Digite Motor"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Renavan"
                                            type="text"
                                            name="renavan"
                                            placeholder="Digite Renavan"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />


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
