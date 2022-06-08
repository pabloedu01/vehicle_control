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

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required('Por favor, digite Nome'),
            description: yup.string(),
            code: yup.string(),
            active: yup.boolean(),
            type: yup.string().required('Por favor, digite O Tipo'),
            rule: yup.string().required('Por favor, digite Regra'),
            preview_data_value: yup.string().required('Por favor, digite Valor'),
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

        formData = {
            name: formData.name,
            description: formData.description,
            code: formData.code,
            active: formData.active,
            validation: {
                type: formData.type,
                rule: formData.rule,
            },
            preview_data: {
                value: formData.preview_data_value
            },
        };

        if(id){
            ajaxCall = api.update('/checklist-item/' + id,formData);
        } else {
            ajaxCall = api.post('/checklist-item',formData);
        }

        ajaxCall.then(() => {
            history(`/panel/checklist-items/list`);
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
            name: null,
            description: null,
            code: null,
            active: true,
            type: null,
            rule: null,
            preview_data_value: null
        };

        if(id){
            api.get('/checklist-item/' + id).then((response) => {
                const {name, description, code, active, validation: {type}, validation: {rule}, preview_data: {value: preview_data_value}} = response.data.data;

                setData({
                    name, description, code, active, type, rule, preview_data_value
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('name', data?.name ?? null);
        methods.setValue('description', data?.description ?? null);
        methods.setValue('code', data?.code ?? null);
        methods.setValue('active', data?.active ?? true);
        methods.setValue('type', data?.type ?? null);
        methods.setValue('rule', data?.rule ?? null);
        methods.setValue('preview_data_value', data?.preview_data_value ?? null);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Lista de verificação', path: '/panel/checklist-items/list' },
                    { label: 'Cadastro do Iten', path: `/panel/checklist-items/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                insideCompany={false}
                title={'Iten de lista de verificação'}
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
                                            label="Código"
                                            type="text"
                                            name="code"
                                            placeholder="Digite Código"
                                            containerClass={'mb-3'}
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
                                            label="Descrição"
                                            type="text"
                                            name="description"
                                            placeholder="Digite Descrição"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Valor Predefinição"
                                            type="text"
                                            name="preview_data_value"
                                            placeholder="Digite Valor Predefinição"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                    </Col>

                                    <Col md={6}>



                                        <FormInput
                                            label="O Tipo"
                                            type="text"
                                            name="type"
                                            placeholder="Digite O Tipo"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Regra"
                                            type="text"
                                            name="rule"
                                            placeholder="Digite Regra"
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
