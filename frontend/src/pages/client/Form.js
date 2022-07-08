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
import classNames from "classnames";

const api = new APICore();

const Form = (props: {company?: any, client?: any, isTag?: boolean, previousButton?: any, pushButton?: any, doneAction?:any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required('Por favor, digite Nome Completo'),
            active: yup.boolean(),
            document: yup.string().required('Por favor, digite Documento'),
            address: yup.string().required('Por favor, digite a Endereço'),
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

        if(props?.client || id){
            ajaxCall = api.update('/client/' + (props?.client?.id || id),formData);
        } else {
            ajaxCall = api.post('/client',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then((response) => {
            if(props?.doneAction){
                props?.doneAction(response.data.data, props?.pushButton);
            } else {
                history(`/panel/company/${props.company?.id}/clients/list`);
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
            name: null,
            active: true,
            document: null,
            address: null,
        };

        if(props?.isTag !== true && id){
            api.get('/client/' + id).then((response) => {
                const {name,active,document,address} = response.data.data;

                setData({
                    name,active,document,address,
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            if(props?.client){
                const {name,active,document,address} = props?.client;

                setData({
                    name,active,document,address,
                });
            } else {
                setData(defaultData);
            }
        }
    };

    useEffect(() => {
        getData();
    }, [id, props?.client]);

    useEffect(() => {
        methods.setValue('name', data?.name ?? null);
        methods.setValue('active', data?.active ?? true);
        methods.setValue('document', data?.document ?? null);
        methods.setValue('address', data?.address ?? null);
    }, [data]);

    return (
        <>
            {
                props?.isTag !== true ?
                   <PageTitle
                        breadCrumbItems={[
                            { label: 'Clientes', path: '/clients/list' },
                            { label: 'Cadastro', path: `/clients/${id ? id + '/edit' : 'create'}`, active: true },
                        ]}
                        title={'Clientes'}
                        company={props.company}
                    />
                    : null
            }
            <Row>
                <Col xs={12}>
                    <Card className={classNames({'mb-0': props?.isTag === true})}>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit, (e) => {console.log(e);})} noValidate>
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
                                            label="Documento"
                                            type="text"
                                            name="document"
                                            placeholder="Digite Documento"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                        <FormInput
                                            label="Endereço"
                                            type="text"
                                            name="address"
                                            placeholder="Digite Endereço"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                    </Col>

                                    <Col md={6}>
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
