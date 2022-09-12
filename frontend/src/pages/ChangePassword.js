// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {Link, useNavigate, useParams} from 'react-router-dom';
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
    const {code} = useParams();

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            password: yup.string().nullable().required('Por favor, digite Contraseña'),
            repeat_password: yup.string().nullable().required('Por favor, digite Repetir Contraseña'),
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
            password: formData['password'],
            repeat_password: formData['repeat_password'],
            code
        };

        api.post('/change-password',data).then((response) => {
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

    const handleUserVerificationCode = () => {
        api.post('/user-verification-code',{
            code
        }).then((response) => {

        }, (error) => {
            history('/login');
        });
    };

    useEffect(() => {
        handleUserVerificationCode();
    }, [code]);

    return (
        <>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">Change Password</h4>
                    <p className="text-muted mb-4">
                        Cambie su contraseña
                    </p>
                </div>

                <VerticalForm onSubmit={onSubmit} customMethods={methods} resolver={schemaResolver} defaultValues={{}}>
                    <FormInput
                        label="Contraseña"
                        type="password"
                        name="password"
                        placeholder="Digite seu password"
                        containerClass={'mb-3'}></FormInput>

                    <FormInput
                        label="Repetir Contraseña"
                        type="password"
                        name="repeat_password"
                        placeholder="Digite seu password otra vez"
                        containerClass={'mb-3'}></FormInput>

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
