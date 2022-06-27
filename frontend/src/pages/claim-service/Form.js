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
            integration_code: yup.number().required('Por favor, digite Código de Integração'),
            description: yup.string().required('Por favor, digite Descrição'),
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
            ajaxCall = api.update('/claim-service/' + id,formData);
        } else {
            ajaxCall = api.post('/claim-service',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/claim-services/list`);
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
            integration_code: null,
            description: null,
        };

        if(id){
            api.get('/claim-service/' + id).then((response) => {
                const {integration_code, description} = response.data.data;

                setData({
                    integration_code, description
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
        methods.setValue('integration_code', data?.integration_code ?? null);
        methods.setValue('description', data?.description ?? null);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Serviços de Reclamação', path: '/claim-services/list' },
                    { label: 'Cadastro', path: `/claim-services/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Serviços de Reclamação'}
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
