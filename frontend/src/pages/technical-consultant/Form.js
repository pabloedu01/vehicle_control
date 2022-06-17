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
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [readOnlyName, setReadOnlyName] = useState(false);
    const [readOnlyUserId, setReadOnlyUserId] = useState(false);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            user_id: yup.number(),
            name: yup.string().required('Por favor, digite Nome Completo'),
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
            ajaxCall = api.update('/technical-consultant/' + id,Object.assign(formData,{ user_id: formData.user_id ? formData.user_id : null}));
        } else {
            ajaxCall = api.post('/technical-consultant',Object.assign(formData,{company_id: props.company?.id, user_id: formData.user_id ? formData.user_id : null}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/technical-consultants/list`);
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

    const getUsers = () => {
        api.get('/technical-consultant/available-users',{company_id: props.company?.id}).then((response) => {
            const options = [{value: 0, label: 'Without User'}].concat(getAllOptions(response.data.data, data.user));

            setAllUsers(options);
            setUsers(options);
        },(error) => {
            setUsers([{value: 0, label: 'Without User'}]);
            setAllUsers([{value: 0, label: 'Without User'}]);
        });
    };

    const getData = () => {
        const defaultData = {
            user_id: 0,
            name: null,
            active: true
        };

        if(id){
            api.get('/technical-consultant/' + id).then((response) => {
                const {user_id,name,active, user} = response.data.data;

                if(user_id){
                    setUsers([{value: user_id, label: name}]);
                    setReadOnlyName(true);
                    setReadOnlyUserId(true);
                } else {
                    setReadOnlyName(false);
                    setReadOnlyUserId(false);

                    if(users.length !== allUsers.length){
                        setUsers([...allUsers]);
                    }
                }

                setData({
                    name, user_id, active, user
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const onUserIdChange = (value) => {
        const user = users.find((user) => user.value === value);

        methods.clearErrors('name');

        if(user && user.value){
            methods.setValue('name', user.label);
            setReadOnlyName(true);
        } else {
            methods.setValue('name', '');
            setReadOnlyName(false);
        }
    };

    useEffect(() => {
        if(data){
            getUsers();
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('name', data?.name ?? null);
        methods.setValue('active', data?.active ?? true);
        methods.setValue('user_id', data?.user_id ?? 0);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Consultores Técnicos', path: '/technical-consultants/list' },
                    { label: 'Cadastro', path: `/technical-consultants/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Formulário de Consultor Técnico'}
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
                                            label="Usuario"
                                            type="select"
                                            name="user_id"
                                            placeholder="Digite Nome"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                            options={users}
                                            handleChange={onUserIdChange}
                                            isDisabled={readOnlyUserId}
                                        />

                                        <FormInput
                                            label="Nome"
                                            type="text"
                                            name="name"
                                            placeholder="Digite Nome"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                            readOnly={readOnlyName}
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
