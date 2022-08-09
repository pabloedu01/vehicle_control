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
            description: yup.string().nullable(),
            code: yup.string().required('Por favor, digite Código'),
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
            ajaxCall = api.update('/checklist-version/' + id,formData);
        } else {
            ajaxCall = api.post('/checklist-version',formData);
        }

        ajaxCall.then(() => {
            history(`/panel/checklist-versions/list`);
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
            active: true
        };

        if(id){
            api.get('/checklist-version/' + id).then((response) => {
                const {name, description, code, active} = response.data.data;

                setData({
                    name, description, code, active
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
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Versão do Checklist', path: '/panel/checklist-versions/list' },
                    { label: 'Cadastro', path: `/panel/checklist-versions/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                insideCompany={false}
                title={'Versão do Lista de verificação'}
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

                                    </Col>

                                    <Col md={6}>
                                        <FormInput
                                            label="Descrição"
                                            type="text"
                                            name="description"
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
