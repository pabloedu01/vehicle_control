// @flow
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, ProgressBar, Tab, Nav, Table, Modal } from 'react-bootstrap';
import useApi from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Wizard, Steps, Step } from 'react-albus';
import { useForm } from 'react-hook-form';
import { FormInput } from '../components/';
import HyperDatepicker from '../components/Datepicker';
import PageTitle from '../components/PageTitle';

// dummy records
const records = [
    { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
    { id: 2, firstName: 'Jacob', lastName: 'Thornton', username: '@fat' },
    { id: 3, firstName: 'Dave', lastName: 'G', username: '@dave' },
    { id: 4, firstName: 'Nik', lastName: 'N', username: '@nikn' },
    { id: 5, firstName: 'Shreyu', lastName: 'Navadiya', username: '@sn' },
];
// component

const OrderList = () => {
    /*
     * Defaults Table
     */
    const [claimTable, setClaimTable] = useState([]);
    const [serviceTable, setServiceTable] = useState([]);
    const [serviceValue, setServiceValue] = useState([]);
    /*
     * modal methods
     */
    const [modal2, setModal2] = useState(false);
    const [comment, setComment] = useState('');
    const toggle2 = () => {
        setModal2(!modal2);
    };
    const clearModal2 = () => {
        toggle2();
    };
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

    //getClaims
    const [claimList, setClaimList] = useState([]);
    const [actualClaim, setActualClaim] = useState('');
    const [claims, setClaims] = useState('');
    const getClaims = async () => {
        const result = await api.getClaims();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="claim_name"
                    label="Nome do Reclamação"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    onChange={(e) => {
                        setActualClaim(e.target.value);
                        console.log(e.target.value);
                    }}
                    errors={errors}
                    control={control}>
                    {result.data.map((item, index) => {
                        return (
                            <option key={index} value={index}>
                                {item.description}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setClaimList(result.data);
            setClaims(CompFormSelect);
        } else {
            alert(result.msg);
        }
    };
    const [intable, setInTable] = useState([]);
    const newClaim = async () => {
        if (actualClaim != '') {
            let table = [];
            const data = [
                {
                    id: claimList[actualClaim].id,
                    description: claimList[actualClaim].description,
                    service: '',
                    products: '',
                    serviceValue: '',
                    productsValue: '',
                },
            ];
            let newtable = claimTable.concat(data);
            setClaimTable(newtable);
            console.log(newtable);
        } else {
            alert('selecione uma reclamação');
        }
    };
    const [serviceList, setServiceList] = useState([]);
    const [actualService, setActualService] = useState('');
    const [services, setServices] = useState('');
    const getServices = async () => {
        const result = await api.getServices();
        if (result.msg == '¡Success!') {

            let otions = [{id:'',description:''}];
            let optdata = otions.concat(result.data)
            const CompFormSelect = (
                <FormInput
                    name="service_name"
                    label="Nome do Serviço"
                    type="select"
                    containerClass="mb-3"
                    className="form-select"
                    register={register}
                    key="select"
                    errors={errors}
                    control={control}
                    onChange={(e) => {
                        setActualService(e.target.options.selectedIndex -1);
                        console.log(e.target.options.selectedIndex);
                    }}>
                    {optdata.map((item, index) => {
                        return (
                            <option key={index} value={item.id}>
                                {item.description}
                            </option>
                        );
                    })}
                </FormInput>
            );
            setServiceList(result.data);
            setServices(CompFormSelect);
        } else {
            alert(result.msg);
        }
    };
    const [products, setProducts] = useState('');
    const getProducts = async () => {
        const result = await api.getProducts();
        if (result.msg == '¡Success!') {
            const CompFormSelect = (
                <FormInput
                    name="product_name"
                    label="Nome do Produto"
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
            setProducts(CompFormSelect);
        } else {
            alert(result.msg);
        }
    };

    useEffect(() => {
        getListClients();
        getListTechinicalConsultor();
        getVehicleBrand();
        getVehicleModels();
        getVehicle();
        getClaims();
        getServices();
        getProducts();
    }, []);

    const newService = async () => {
        if (actualService != '') {
            let table = [];
            const data = [
                {
                    id: serviceList[actualService].id,
                    actual_service: serviceList[actualService].id,
                    description: serviceList[actualService].description,
                    service: '',
                    products: [],
                    serviceValue: serviceValue,
                    productsValue: '',
                },
            ];
            let newtable = serviceTable.concat(data);
            setServiceTable(newtable);
            console.log(newtable);
        } else {
            alert('selecione um serviço');
        }
    };
    const addService = async () => {
        await newService();
        setServiceValue('');
    };
    const addProducts = async () => {

    }
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
                                                                        <Row>
                                                                            <Col md={10}>{claims}</Col>
                                                                            <Col md={2}>
                                                                                <Button
                                                                                    onClick={(e) => {
                                                                                        newClaim();
                                                                                        toggle2();
                                                                                    }}>
                                                                                    Novo Serviço
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                        <Form.Group as={Row} className="mb-3">
                                                                            <Row>
                                                                                <Col md={8}>
                                                                                    <Table className="mb-0">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>#</th>
                                                                                                <th>Reclamação</th>
                                                                                                <th>Serviço</th>
                                                                                                <th>Peças</th>
                                                                                                <th>
                                                                                                    Valor de Serviços
                                                                                                </th>
                                                                                                <th>Valor de Peças</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {claimTable.map(
                                                                                                (record, index) => {
                                                                                                    return (
                                                                                                        <tr key={index}>
                                                                                                            <th scope="row">
                                                                                                                {
                                                                                                                    record.id
                                                                                                                }
                                                                                                            </th>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    record.description
                                                                                                                }
                                                                                                            </td>

                                                                                                            <td>
                                                                                                                {
                                                                                                                    record.service
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    record.products
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    record.serviceValue
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    record.productsValue
                                                                                                                }
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </tbody>
                                                                                    </Table>
                                                                                </Col>
                                                                                
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
            <Modal show={modal2} onHide={clearModal2}>
                <Modal.Header onHide={clearModal2} closeButton>
                    <h4 className="modal-title"> Service Managers</h4>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Col} controlId="formGridState">
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>{services}</Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Valor Serv"
                                                    name="serviceValue"
                                                    value={serviceValue}
                                                    onChange={(e) => setServiceValue(e.target.value)}
                                                />
                                            </Col>
                                            <Col md={2} className="align-items-center text-center pt-3">
                                                <Button
                                                    onClick={(e) => {
                                                        addService();
                                                    }}>
                                                    <i className="mdi mdi-plus me-1" />
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Table className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nome Serviço</th>
                                                    <th>Valor</th>
                                                    <th>Produtos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {serviceTable.map((record, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th scope="row">{record.id}</th>
                                                            <td>{record.description}</td>
                                                            <td>
                                                               
                                                                {record.serviceValue}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    onClick={(e) => {
                                                                        addProducts();
                                                                    }}>
                                                                    <i className="mdi mdi-plus me-1" />
                                                                </Button> {' '} {record.products}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={clearModal2}>
                        Close
                    </Button>{' '}
                    <Button variant="primary" onClick={(e) => handleSubmit()}>
                        Autorizar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default OrderList;
