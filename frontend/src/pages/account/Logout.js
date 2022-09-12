// @flow
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { useApi } from '../../services/api';
//actions
import { logoutUser } from '../redux/actions';

// components
import AccountLayout from './AccountLayout';
 
import logoutIcon from '../assets/images/logout-icon.svg';

/* bottom link */ 
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to ')}{' '}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Logout = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const api = useApi();
    const uselogout = async () => {
        const result = await api.logout();

    }
    useEffect(() => {
        uselogout();
        dispatch(logoutUser());
    }, [dispatch]);

    return (
        <>
            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Até a próxima !')}</h4>
                    <p className="text-muted mb-4">{t('Você saiu com sucesso !')}</p>

                    <div className="logout-icon m-auto">
                        <img src={logoutIcon} alt="" />
                    </div>
                </div>
            </AccountLayout>
        </>
    );
};

export default Logout;
