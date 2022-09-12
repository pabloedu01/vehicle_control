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

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            brand_id: yup.number().nullable().required('Por favor, digite Marca'),
            model_id: yup.number().nullable().required('Por favor, digite Modelo'),
            model_year: yup.string().nullable().required('Por favor, digite Ano'),
            name: yup.string().nullable().required('Por favor, digite Nome Completo'),
            active: yup.boolean(),
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
            ajaxCall = api.update('/vehicle/' + id,formData);
        } else {
            ajaxCall = api.post('/vehicle',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/vehicles/list`);
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
            model_year: null,
            name: null,
            active: true
        };

        if(id){
            api.get('/vehicle/' + id).then((response) => {
                const {name,active,model_id, model_year, model: {brand_id}, model, brand} = response.data.data;

                setData({
                    name,active,model_id, model_year, brand_id, model, brand
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
            setModels(getAllOptions(response.data.data, data?.model,(brand_id ?? methods.getValues('brand_id')) === data?.brand_id));
        },(error) => {
            setModels([]);
        });
    };

    useEffect(() => {
        if(data){
            getBrands();

            if(id){
                getModels(data.brand_id);
            }
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('name', data?.name ?? null);
        methods.setValue('active', data?.active ?? true);
        methods.setValue('model_id', data?.model_id ?? null);
        methods.setValue('brand_id', data?.brand_id ?? null);
        methods.setValue('model_year', data?.model_year ?? null);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Veículos', path: '/vehicles/list' },
                    { label: 'Cadastro', path: `/vehicles/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Formulário de Veículos'}
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
                                            label="Marcas"
                                            type="select"
                                            name="brand_id"
                                            containerClass={'mb-3'}
                                            options={brands}
                                            handleChange={handleChangeBrand}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Nome"
                                            type="text"
                                            name="name"
                                            placeholder="Digite Nome"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Ative"
                                            type="checkbox"
                                            name="active"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <FormInput
                                            label="Modelo"
                                            type="select"
                                            name="model_id"
                                            containerClass={'mb-3'}
                                            options={models}
                                            {...otherProps}
                                        />
                                        <FormInput
                                            label="Ano"
                                            type="text"
                                            name="model_year"
                                            placeholder="Digite Ano"
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
