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
            name: yup.string().nullable().required('Por favor, digite Nome Completo'),
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
            ajaxCall = api.update('/tire-brand/' + id,formData);
        } else {
            ajaxCall = api.post('/tire-brand',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/tire-brands/list`);
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
        };

        if(id){
            api.get('/tire-brand/' + id).then((response) => {
                const {name} = response.data.data;

                setData({
                    name
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
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Pneus', path: '/tire-brands/list' },
                    { label: 'Cadastro', path: `/tire-brands/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Pneus'}
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
                                            label="Nome"
                                            type="text"
                                            name="name"
                                            placeholder="Digite Nome"
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
