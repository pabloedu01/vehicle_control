// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import {toastService} from "../services/toast";

//actions
import { resetAuth } from '../redux/actions';

// components
import { VerticalForm, FormInput } from '../components/';

import AccountLayout from './AccountLayout';
import {APICore} from "../helpers/api/apiCore";

const api = new APICore();

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    Já tem conta?
                    <Link to={'/login'} className="text-muted ms-1">
                        <b>Login</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Register = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useNavigate();

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().nullable().required(t('Por favor, digite Nome Completo')),
            username: yup.string().nullable().required(t('Por favor, digite Usuário')),
            email: yup.string().nullable().required('Por favor, digite Email').email('Por favor insira um e-mail válido'),
            password: yup.string().nullable().required(t('Por favor, digite Senha')),
        })
    );

    /*
     * form methods
     */
    const methods = useForm({ resolver: schemaResolver, defaultValues: {} });

    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        const data = {
            name: formData['name'],
            email: formData['email'],
            username: formData['username'],
            password: formData['password'],
        };

        api.post('/user-register',data).then((response) => {
            toastService.show('success', 'Ative sua conta a partir da mensagem que enviamos para o e-mail.');

            history('/login');
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

    return (
        <>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">Cadastro</h4>
                    <p className="text-muted mb-4">
                        Não tem uma conta? Crie sua conta, leva menos de um minuto.
                    </p>
                </div>

                <VerticalForm onSubmit={onSubmit} customMethods={methods} resolver={schemaResolver} defaultValues={{}}>
                     <FormInput
                        label="Nome"
                        type="text"
                        name="name"
                        placeholder="Digite seu Nome"
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Digite seu Email"
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label="Usuário"
                        type="text"
                        name="username"
                        placeholder="Digite seu Usuário"
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label="Senha"
                        type="password"
                        name="password"
                        placeholder="Digite seu Senha"
                        containerClass={'mb-3'}
                    />

                    <div className="mb-3 mb-0 text-center">
                        <Button variant="primary" type="submit">
                            Cadastro
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Register;
