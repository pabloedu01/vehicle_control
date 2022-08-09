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
            email: yup.string().required('Por favor, digite Email').email('Por favor insira um e-mail válido'),
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
            email: formData['email'],
        };

        api.post('/recover-password',data).then((response) => {
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
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">Recupere sua senha</h4>
                    <p className="text-muted mb-4">
                        Recuperar sua senha leva menos de um minuto!
                    </p>
                </div>

                <VerticalForm onSubmit={onSubmit} customMethods={methods} resolver={schemaResolver} defaultValues={{}}>
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Digite seu Email"
                        containerClass={'mb-3'}
                    />

                    <div className="mb-3 mb-0 text-center">
                        <Button variant="primary" type="submit">
                            Recuperar
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Register;
