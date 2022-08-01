// @flow
import React, { useEffect, useState } from 'react';

import { Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

// actions
import {resetAuth, loginUser} from '../redux/actions';

// components
import { VerticalForm, FormInput } from '../components';

import AccountLayout from './AccountLayout';

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer footer-alt">
            <p className="text-muted">
                {t("Don't have an company?")}{' '}
                <Link to={'/register'} className="text-muted ms-1">
                    <b>{t('Cadastro Company')}</b>
                </Link>
            </p>
            <p className="text-muted">
                {t("Don't have an account?")}{' '}
                <Link to={'/user-register'} className="text-muted ms-1">
                    <b>{t('Cadastro')}</b>
                </Link>
            </p>
            <p className="text-muted">
                {t("Forgot Password?")}{' '}
                <Link to={'/forgot-password'} className="text-muted ms-1">
                    <b>{t('Recover Password')}</b>
                </Link>
            </p>
        </footer>
    );
};

const Login2 = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [user, setuser] = useState('');
    const [password, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const handleLoginButton = async (username, pass) => {
        try {
            if (username && pass) {
                dispatch(loginUser(username, pass));
            } else {
                setError('Digite os dados');
            }
        } catch (error) {
            setError('#001 - local - Erro de conexão com a API');
        }
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            username: yup.string().required('Digite seu usuario'),
            password: yup.string().required('Digite seu contraseña'),
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = (formData) => {
        handleLoginButton(formData['username'], formData['password']).then(() => {});
    };

    return (
        <>
            <AccountLayout bottomLinks={<BottomLink />}>
                <h4 className="mt-0">Log In</h4>
                <p className="text-muted mb-4">{t('Digite seu email e conta para acessar o sistema.')}</p>

                {error && (
                    <Alert variant="danger" className="my-2">
                        {error}
                    </Alert>
                )}

                <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                    <FormInput
                        label="Username ou E-mail"
                        type="text"
                        name="username"
                        placeholder="Digite seu Username ou E-mail"
                        containerClass={'mb-3'}
                        value={user}
                        onChange={(e) => setuser(e.target.value)}
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Digite seu Password"
                        onChange={(e) => setPass(e.target.value)}
                        containerClass={'mb-3'}
                    />

                    <div className="d-grid mb-0 text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            <i className="mdi mdi-login"></i> {t('Log In')}
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Login2;
