// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Card, Col, ProgressBar, Row} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useParams} from "react-router-dom";
import { Wizard, Steps, Step } from 'react-albus';
import ClientVehicleForm from '../client-vehicle/Form';
import ClientForm from '../client/Form';
import ServiceScheduleForm from "./steps/Form";
import ClientVehicleList from "./steps/ClientVehicleList";
import ClientList from "./steps/ClientList";

const api = new APICore();

const FormWizard = (props: {company?: any}): React$Element<React$FragmentType> => {
    const {id} = useParams();
    const [clientVehicle, setClientVehicle] = useState(null);
    const [client, setClient] = useState(null);
    const [alreadyInForm, setAlreadyInForm] = useState(false);

    const onClientVehicleSelect = (clientVehicleId, push) => {
        getClientVehicle(clientVehicleId, push, () => {
            if(alreadyInForm){
                push('serviceScheduleForm');
            } else {
                push('clientList');
            }
        });
    };

    const onClientVehicleEdit = (clientVehicleId, push) => {
        getClientVehicle(clientVehicleId, push, () => {
            push('clientVehicleForm');
        });
    };

    const onClientVehicleCreate = (push) => {
        if(push){
            setClientVehicle(null);
            push('clientVehicleForm');
        }
    };

    const getClientVehicle =  (clientVehicleId, push, action) => {
        api.get('/client-vehicle/' + clientVehicleId).then((response) => {
            setClientVehicle(response.data.data);

            action();
        }).catch(() => {
            setClientVehicle(null);
        });
    };

    const onDoneClientVehicle = (data, push) => {
        setClientVehicle(data);

        if(push){
            push('clientVehicleList');
        }
    };

    const onReturnToClientVehicleList = (push) => {
        if(push){
            push('clientVehicleList');
        }
    };

    const onClientSelect = (clientId, push) => {
        getClient(clientId, push, () => {
            setAlreadyInForm(true);
            push('serviceScheduleForm');
        });
    };

    const onClientEdit = (clientId, push) => {
        getClient(clientId, push, () => {
            push('clientForm');
        });
    };

    const onClientCreate = (push) => {
        if(push){
            setClient(null);
            push('clientForm');
        }
    };

    const getClient =  (clientId, push, action) => {
        api.get('/client/' + clientId).then((response) => {
            setClient(response.data.data);

            action();
        }).catch(() => {
            setClient(null);
        });
    };

    const onDoneClient = (data, push) => {
        setClient(data);

        if(push){
            push('clientList');
        }
    };

    const onReturnToClientList = (push) => {
        if(push){
            push('clientList');
        }
    };

    useEffect(() => {
        if(id){
            setAlreadyInForm(true);
        }

        localStorage.setItem('serviceSchedule', null);
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Agenda de Serviços', path: '/service-schedules/list' },
                    { label: 'Cadastro', path: `/service-schedules/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Agenda de Serviços'}
                company={props?.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body className="p-0">
                            <Wizard
                                render={({step, steps}) => (<>
                                    <ProgressBar
                                        animated
                                        striped
                                        variant="success"
                                        now={((step.id === 'clientVehicleList' ? 1 : (step.id === 'clientVehicleForm' ? 2 : (step.id === 'clientList' ? 3 : (step.id === 'clientForm' ? 4 : 5)))) / steps.length) * 100}
                                        className="progress-sm"
                                    />

                                    {id ?
                                        <Steps>
                                            <Step
                                                id="serviceScheduleForm"
                                                render={({push}) => (<ServiceScheduleForm pushButton={push} handleReturnToClientList={onReturnToClientList} handleReturnToClientVehicleList={onReturnToClientVehicleList} clientVehicle={clientVehicle} client={client} company={props?.company}/>)}
                                            />

                                            <Step
                                                id="clientVehicleList"
                                                render={({push}) => (
                                                    <ClientVehicleList company={props?.company} handleSelect={onClientVehicleSelect} handleCreate={onClientVehicleCreate} handleEdit={onClientVehicleEdit} pushButton={push}/>
                                                )}
                                            />


                                            <Step
                                                id="clientVehicleForm"
                                                render={({push}) => (
                                                    <ClientVehicleForm clientVehicle={clientVehicle} handleDoneAction={onDoneClientVehicle} pushButton={push} isTag={true} company={props?.company}/>
                                                )}
                                            />

                                            <Step
                                                id="clientList"
                                                render={({push}) => (
                                                    <ClientList company={props?.company} handleSelect={onClientSelect} handleCreate={onClientCreate} handleEdit={onClientEdit} pushButton={push}/>
                                                )}
                                            />

                                            <Step
                                                id="clientForm"
                                                render={({push}) => (
                                                    <ClientForm client={client} handleDoneAction={onDoneClient} pushButton={push} isTag={true} company={props?.company}/>
                                                )}
                                            />
                                        </Steps>
                                    : <Steps>
                                            <Step
                                                id="clientVehicleList"
                                                render={({push}) => (
                                                    <ClientVehicleList company={props?.company} handleSelect={onClientVehicleSelect} handleCreate={onClientVehicleCreate} handleEdit={onClientVehicleEdit} pushButton={push}/>
                                                )}
                                            />


                                            <Step
                                                id="clientVehicleForm"
                                                render={({push}) => (
                                                    <ClientVehicleForm clientVehicle={clientVehicle} handleDoneAction={onDoneClientVehicle} pushButton={push} isTag={true} company={props?.company}/>
                                                )}
                                            />

                                            <Step
                                                id="clientList"
                                                render={({push}) => (
                                                    <ClientList company={props?.company} handleSelect={onClientSelect} handleCreate={onClientCreate} handleEdit={onClientEdit} pushButton={push}/>
                                                )}
                                            />

                                            <Step
                                                id="clientForm"
                                                render={({push}) => (
                                                    <ClientForm client={client} handleDoneAction={onDoneClient} pushButton={push} isTag={true} company={props?.company}/>
                                                )}
                                            />

                                            <Step
                                                id="serviceScheduleForm"
                                                render={({push}) => (<ServiceScheduleForm pushButton={push} handleReturnToClientList={onReturnToClientList} handleReturnToClientVehicleList={onReturnToClientVehicleList} clientVehicle={clientVehicle} client={client} company={props?.company}/>)}
                                            />
                                        </Steps>
                                    }
                                </>)}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default FormWizard;
