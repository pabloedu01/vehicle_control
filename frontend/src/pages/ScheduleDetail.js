// @flow
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, ProgressBar } from 'react-bootstrap';
import useApi from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';
import { useForm } from 'react-hook-form';
import { FormInput } from '../components/';
import HyperDatepicker from '../components/Datepicker';

// component
import PageTitle from '../components/PageTitle';

const OrderList = () => {
    /*
     * form methods
     */
    const methods = useForm({
        defaultValues: {
            password: '12345',
            statictext: 'email@example.com',
            color: '#727cf5',
        },
    });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const onDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };
    const api = useApi();
    const history = useNavigate();

    // get list users
    const [users, setUsers] = useState('');
    const getListClients = async () => {
        const result = await api.getClients();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="client_name"
                    label="Nome do Cliente"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    errors={errors}
                    control={control}>
                    {result.data.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setUsers(CompFormSelect);
        } else {
            alert(result.msg);
        }
    };
    // getListOfTechinicalConsultor
    const [techinicalConsultor, setTechinicalConsultor] = useState('');
    const getListTechinicalConsultor = async () => {
        const result = await api.getTechnicalConsultant();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="technical_consultant_name"
                    label="Nome do Técnico"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    errors={errors}
                    control={control}>
                    {result.data.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setTechinicalConsultor(CompFormSelect);
        } else {
            alert(result.msg);
        }
    };
    // getvehicle Brand
    const [vehicleBrand, setVehicleBrand] = useState('');
    const getVehicleBrand = async () => {
        const result = await api.getVehicleBrand();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="vehicle_brand"
                    label="Marca do Veículo"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    errors={errors}
                    control={control}>
                    {result.data.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setVehicleBrand(CompFormSelect);
        } else {
            alert(result.msg);
        }
    };
    // getvehicle Model
    const [vehicleModel, setVehicleModel] = useState('');
    const getVehicleModels = async () => {
        const result = await api.getVehicleModel();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="vehicle_model"
                    label="Modelo do Veículo"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    errors={errors}
                    control={control}>
                    {result.data.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setVehicleModel(CompFormSelect);
        } else {
            console.log('veicleModel:', result.msg);
        }
    };
    const [vehicle, setVehicle] = useState('');
    const getVehicle = async () => {
        const result = await api.getVehicle();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="vehicle_name"
                    label="Nome do Veículo"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    errors={errors}
                    control={control}>
                    {result.data.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setVehicle(CompFormSelect);
        } else {
            console.log('Veicle:', result.msg);
        }
    };

    useEffect(() => {
        getListClients();
        getListTechinicalConsultor();
        getVehicleBrand();
        getVehicleModels();
        getVehicle();
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Agendamentos', path: '/apps/crm/orders' },
                    { label: 'Detalhe', path: '/apps/crm/orders', active: true },
                ]}
                title={'Agendamentos'}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={8}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between"></Row>
                                </Col>
                                <Col xl={4}>
                                    <div className="text-xl-end mt-xl-0 mt-2"></div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <h4 className="header-title mb-3">Cadastro de Agendamento</h4>

                                            <Wizard
                                                render={({ step, steps }) => (
                                                    <>
                                                        <ProgressBar
                                                            animated
                                                            striped
                                                            variant="success"
                                                            now={((steps.indexOf(step) + 1) / steps.length) * 100}
                                                            className="mb-3 progress-sm"
                                                        />

                                                        <Steps>
                                                            <Step
                                                                id="first"
                                                                render={({ next }) => (
                                                                    <Form>
                                                                        <Form.Group as={Row} className="mb-3">
                                                                            <Col md={6}>{users}</Col>
                                                                            <Col md={6}>{techinicalConsultor}</Col>
                                                                            <Col md={6}>
                                                                                <div className="mb-3">
                                                                                    <label> Data Marcada</label> <br />
                                                                                    <HyperDatepicker
                                                                                        hideAddon={true}
                                                                                        showTimeSelect
                                                                                        timeFormat="HH:mm"
                                                                                        tI={30}
                                                                                        dateFormat="dd MM yyyy h:mm aa"
                                                                                        timeCaption="time"
                                                                                        value={selectedDate}
                                                                                        onChange={(date) => {
                                                                                            onDateChange(date);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={6}>{vehicleBrand}</Col>
                                                                            <Col md={6}>{vehicleModel}</Col>
                                                                            <Col md={6}>{vehicle}</Col>
                                                                            <Col md={6}>
                                                                                <FormInput
                                                                                    label="Chassi Completo"
                                                                                    type="text"
                                                                                    name="text"
                                                                                    containerClass={'mb-3'}
                                                                                    register={register}
                                                                                    key="text"
                                                                                    errors={errors}
                                                                                    control={control}
                                                                                />
                                                                            </Col>
                                                                            <Col md={6}>
                                                                                <FormInput
                                                                                    label="Placa"
                                                                                    type="text"
                                                                                    name="text"
                                                                                    containerClass={'mb-3'}
                                                                                    register={register}
                                                                                    key="text"
                                                                                    errors={errors}
                                                                                    control={control}
                                                                                />
                                                                            </Col>
                                                                        </Form.Group>

                                                                        <ul className="list-inline wizard mb-0">
                                                                            <li className="next list-inline-item float-end">
                                                                                <Button
                                                                                    onClick={next}
                                                                                    variant="success">
                                                                                    Next
                                                                                </Button>
                                                                            </li>
                                                                        </ul>
                                                                    </Form>
                                                                )}
                                                            />
                                                            <Step
                                                                id="claims"
                                                                render={({ next, previous }) => (
                                                                    <Form>
                                                                        <Form.Group as={Row} className="mb-3">
                                                                            <Row>
                                                                                <Col md={8}></Col>
                                                                                <Col md={4}  style={{ textAlign: 'right' }}><Button>Novo Serviço</Button></Col>

                                                                            </Row>
                                                                           
                                                                        </Form.Group>

                                                                        <ul className="list-inline wizard mb-0">
                                                                            <li className="previous list-inline-item">
                                                                                <Button
                                                                                    onClick={previous}
                                                                                    variant="info">
                                                                                    Previous
                                                                                </Button>
                                                                            </li>
                                                                            <li className="next list-inline-item float-end">
                                                                                <Button
                                                                                    onClick={next}
                                                                                    variant="success">
                                                                                    Next
                                                                                </Button>
                                                                            </li>
                                                                        </ul>
                                                                    </Form>
                                                                )}
                                                            />
                                                            <Step
                                                                id="dumbledore"
                                                                render={({ previous }) => (
                                                                    <Row>
                                                                        <Col sm={12}>
                                                                            <div className="text-center">
                                                                                <h2 className="mt-0">
                                                                                    <i className="mdi mdi-check-all"></i>
                                                                                </h2>
                                                                                <h3 className="mt-0">Thank you !</h3>

                                                                                <p className="w-75 mb-2 mx-auto">
                                                                                    Quisque nec turpis at urna dictum
                                                                                    luctus. Suspendisse convallis
                                                                                    dignissim eros at volutpat. In
                                                                                    egestas mattis dui. Aliquam mattis
                                                                                    dictum aliquet.
                                                                                </p>

                                                                                <div className="mb-3">
                                                                                    <Form.Check
                                                                                        type="checkbox"
                                                                                        className="d-inline-block">
                                                                                        <Form.Check.Input type="checkbox" />{' '}
                                                                                        <Form.Check.Label>
                                                                                            I agree with the Terms and
                                                                                            Conditions
                                                                                        </Form.Check.Label>
                                                                                    </Form.Check>
                                                                                </div>
                                                                            </div>
                                                                        </Col>

                                                                        <Col sm={12}>
                                                                            <ul className="list-inline wizard mb-0">
                                                                                <li className="previous list-inline-item">
                                                                                    <Button
                                                                                        onClick={previous}
                                                                                        variant="info">
                                                                                        Previous
                                                                                    </Button>
                                                                                </li>

                                                                                <li className="next list-inline-item float-end">
                                                                                    <Button variant="success">
                                                                                        Submit
                                                                                    </Button>
                                                                                </li>
                                                                            </ul>
                                                                        </Col>
                                                                    </Row>
                                                                )}
                                                            />
                                                        </Steps>
                                                    </>
                                                )}
                                            />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderList;
