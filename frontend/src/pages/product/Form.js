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
            product_code: yup.string().required('Por favor, digite Código do Produto'),
            sale_value: yup.string().required('Por favor, digite Valor de Venda'),
            guarantee_value: yup.string().required('Por favor, digite Valor da Garantia'),
            unique_code: yup.string().required('Por favor, digite Código Único'),
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
            ajaxCall = api.update('/product/' + id,formData);
        } else {
            ajaxCall = api.post('/product',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/products/list`);
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
            product_code: null,
            sale_value: null,
            guarantee_value: null,
            unique_code: null,
            active: true,
        };

        if(id){
            api.get('/product/' + id).then((response) => {
                const {name,active,document,address} = response.data.data;

                setData({
                    name,active,document,address,
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
        methods.setValue('product_code', data?.product_code ?? null);
        methods.setValue('sale_value', data?.sale_value ?? null);
        methods.setValue('guarantee_value', data?.guarantee_value ?? null);
        methods.setValue('unique_code', data?.unique_code ?? null);
        methods.setValue('active', data?.active ?? true);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Produtos', path: '/products/list' },
                    { label: 'Cadastro', path: `/products/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Produtos'}
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
                                            label="Código do Produto"
                                            type="text"
                                            name="product_code"
                                            placeholder="Digite Código do Produto"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Valor de Venda"
                                            type="text"
                                            name="sale_value"
                                            placeholder="Digite Valor de Venda"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                    </Col>

                                    <Col md={6}>

                                        <FormInput
                                            label="Valor da Garantia"
                                            type="text"
                                            name="guarantee_value"
                                            placeholder="Digite Valor da Garantia"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Código Único"
                                            type="text"
                                            name="unique_code"
                                            placeholder="Digite Código Único"
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
