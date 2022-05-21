// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {  Alert, Row, Col } from 'react-bootstrap';
import useApi from '../services/api';
import {toastService} from "../services/toast";

//actions
import { resetAuth } from '../redux/actions';

import AccountLayout from './AccountLayout';
import Spinner from "../components/Spinner";

/* bottom link */
const BottomLink = ({ hidden = false }) => {
    return (
        <Row hidden={hidden} className="mt-3">
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

const ActivateUser = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const api = useApi();
    const {code} = useParams();
    const [verified, setVerified] = useState(null);

    const handleActivateUser = () => {
        api.activateUser({
            code
        }).then((result) => {
            if(result.httpCode === 200){
                setVerified(true);
                toastService.show('success', 'Usuário ativado');
                history('/login');
            } else {
                setVerified(false);
            }
        });
    };

    useEffect(() => {
        handleActivateUser();
    }, [code]);

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    return (
        <>
            <AccountLayout>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">Verificação de código</h4>
                </div>

                {verified === true && (
                    <Alert variant="success" className="my-2">
                        Usuário ativado
                    </Alert>
                )}

                {verified === false && (
                    <Alert variant="danger" className="my-2">
                        Usuário não ativado
                    </Alert>
                )}

                {verified === null && (
                    <Alert variant="info" className="my-2">
                        <Spinner />
                    </Alert>
                )}

                <BottomLink hidden={verified === null} />
            </AccountLayout>
        </>
    );
};

export default ActivateUser;
