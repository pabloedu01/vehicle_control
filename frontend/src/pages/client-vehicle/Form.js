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

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
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
            chasis: yup.string().required('Por favor, digite Chasis'),
            color: yup.string().required('Por favor, digite Color'),
            number_motor: yup.string().required('Por favor, digite Motor'),
            renavan: yup.number().required('Por favor, digite Renavan'),
            plate: yup.string().required('Por favor, digite Placa'),
            mileage: yup.number().required('Por favor, digite KM'),
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
            ajaxCall = api.update('/client-vehicle/' + id,formData);
        } else {
            ajaxCall = api.post('/client-vehicle',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/client-vehicles/list`);
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
            chasis: null,
            color: null,
            number_motor: null,
            renavan: null,
            plate: null,
            mileage: null,
        };

        if(id){
            api.get('/client-vehicle/' + id).then((response) => {
                const {vehicle:{model: {brand_id}},vehicle:{model_id},vehicle_id,chasis,color,number_motor,renavan,plate,mileage} = response.data.data;

                getModels(brand_id);
                getVehicles(model_id);

                setData({
                    vehicle_id,chasis,color,number_motor,renavan,plate,mileage,model_id,brand_id
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
            const data = response.data.data.map((user) => {
                return {
                    value: user.id,
                    label: user.name
                };
            });

            setBrands(data);
        },(error) => {
            setBrands([]);
        });
    };

    const getModels = (brand_id?) => {
        api.get('/vehicle-model/active-vehicle-models',{brand_id: brand_id ?? methods.getValues('brand_id')}).then((response) => {
            const data = response.data.data.map((user) => {
                return {
                    value: user.id,
                    label: user.name
                };
            });

            setModels(data);
        },(error) => {
            setModels([]);
        });
    };

    const getVehicles = (model_id?) => {
        api.get('/vehicle/active-vehicles',{model_id: model_id ?? methods.getValues('model_id')}).then((response) => {
            const data = response.data.data.map((user) => {
                return {
                    value: user.id,
                    label: user.name
                };
            });

            setVehicles(data);
        },(error) => {
            setVehicles([]);
        });
    };

    const handleChangeBrand = () => {
        getModels();
    };

    const handleChangeModel = () => {
        getVehicles();
    };

    useEffect(() => {
        getBrands();
    }, []);

    useEffect(() => {
        getData();
    }, [id]);

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
            <PageTitle
                breadCrumbItems={[
                    { label: 'Vehiculos do Cliente', path: '/client-vehicles/list' },
                    { label: 'Cadastro', path: `/client-vehicles/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Formulário de Vehiculos do Cliente'}
                company={props.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit, (e) => {console.log(e);})} noValidate>
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