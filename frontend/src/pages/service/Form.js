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
    const [serviceTypes, setServiceTypes] = useState([]);
    const [data, setData] = useState();

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            service_type_id: yup.number().required('Por favor, digite Tipo de Serviço'),
            service_code: yup.string().nullable().required('Por favor, digite Código de Serviço'),
            integration_code: yup.string().nullable(),
            description: yup.string().nullable().required('Por favor, digite Código de Descrição'),
            standard_quantity: yup.number().nullable().required('Por favor, digite Quantidade Padrão'),
            standard_value: yup.number().nullable().required('Por favor, digite Valor Padrão'),
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
            ajaxCall = api.update('/service/' + id,formData);
        } else {
            ajaxCall = api.post('/service',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/services/list`);
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
            service_code: null,
            service_type_id: null,
            integration_code: null,
            description: null,
            standard_quantity: null,
            standard_value: null,
            active: true,
        };

        if(id){
            api.get('/service/' + id).then((response) => {
                const {service_type_id,service_code,integration_code,description,standard_quantity,standard_value,active} = response.data.data;

                setData({
                    service_type_id,service_code,integration_code,description,standard_quantity,standard_value,active
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const getServiceTypes = () => {
        api.get('/service-type', {company_id: props?.company.id}).then((response) => {
            setServiceTypes(getAllOptions(response.data.data, data?.service_type));
        },(error) => {
            setServiceTypes([])
        });
    };

    useEffect(() => {
        if(data){
            getServiceTypes();
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('service_type_id', data?.service_type_id ?? null);
        methods.setValue('service_code', data?.service_code ?? null);
        methods.setValue('integration_code', data?.integration_code ?? null);
        methods.setValue('description', data?.description ?? null);
        methods.setValue('standard_quantity', data?.standard_quantity ?? null);
        methods.setValue('standard_value', data?.standard_value ?? null);
        methods.setValue('active', data?.active ?? true);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Serviços', path: '/services/list' },
                    { label: 'Cadastro', path: `/services/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Serviços'}
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
                                            label="Tipo de Serviço"
                                            type="select"
                                            name="service_type_id"
                                            containerClass={'mb-3'}
                                            options={serviceTypes}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Código de Serviço"
                                            type="text"
                                            name="service_code"
                                            placeholder="Digite Código de Serviço"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                        <FormInput
                                            label="Código de Integração"
                                            type="text"
                                            name="integration_code"
                                            placeholder="Digite Código de Integração"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Descrição"
                                            type="text"
                                            name="description"
                                            placeholder="Digite Descrição"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                    </Col>

                                    <Col md={6}>

                                        <FormInput
                                            label="Quantidade Padrão"
                                            type="text"
                                            name="standard_quantity"
                                            placeholder="Digite Quantidade Padrão"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Valor Padrão"
                                            type="text"
                                            name="standard_value"
                                            placeholder="Digite Descrição"
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
