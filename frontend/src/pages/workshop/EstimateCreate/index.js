import { Row, Col, Card, Button} from 'react-bootstrap';
import Select from 'react-select';
import {useNavigate, useParams} from "react-router-dom";

// components
import PageTitle from '../../../components/PageTitle';
import {ModalVehicleSearch} from "../../../components/Vehicle/ModalVehicleSearch"
import {ModalClientSearch} from "../../../components/Client/ModalClientSearch"
import { useState } from 'react';

// Item Table
const Items = (props) => {
    const items = props.items || [];
    return (
        <>
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Itens</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const ClientInfo = (props) => {
    const details = props.details || {};
    console.log(details)
    return (
        <>
            <ul className="list-unstyled mb-0 mt-2">
                <li>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Nome:</span> {details.name}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Telefone:</span> {details.phone.map((item, index) => <span>{`${item}${index < details.phone.length? ' - ' : ''}`}</span>)}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Email:</span> {details.email.map((item, index) => <span>{`${item}${index < details.phone.length? ' - ' : ''}`}</span>)}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Endereço:</span> {details.address}
                    </p>
                    <p className="mb-0">
                        <span className="fw-bold me-2">Cep:</span> xxx
                    </p>
                </li>
            </ul>
        </>
    );
};

const VehicleInfo = (props) => {
    const details = props.details || {};
    return (
        <>
            <ul className="list-unstyled mb-0 mt-2">
                <li>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Marca:</span> {details.vehicle?.model.brand.name}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Modelo:</span> {details.vehicle?.model.name}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Veículo:</span> {details.vehicle?.name}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Chassi:</span> {details.chasis}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Placa:</span> {details.plate}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Quilometragem:</span> {details.mileage}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">ano:</span> {details.vehicle?.model_year}
                    </p>
                    <p className="mb-0">
                        <span className="fw-bold me-2">Cor:</span> {details.color}
                    </p>
                </li>
            </ul>
        </>
    );
};



// order details
export default function EstimateCreate() {
    const [showModalSearchVehicle, setShowModalSearchVehicle] = useState(false)
    const [clientVehicleData, setClientVehicleData] = useState(null)
    
    const [showModalSearchClient, setShowModalSearchClient] = useState(false)
    const [clientData, setClienData] = useState(null)
    
    const {companyId} = useParams();

    const order = {
        id: 'BM31',
        order_status: 'Packed',
        items: [
            {
                id: 1,
                name: 'The Military Duffle Bag',
                quantity: 3,
                price: '$128',
                total: '$384',
            },
            {
                id: 2,
                name: 'Mountain Basket Ball',
                quantity: 1,
                price: '$199',
                total: '$199',
            },
            {
                id: 3,
                name: 'Wavex Canvas Messenger Bag',
                quantity: 5,
                price: '$180',
                total: '$900',
            },
            {
                id: 4,
                name: 'The Utility Shirt',
                quantity: 2,
                price: '$79',
                total: '$158',
            },
            {
                id: 5,
                name: 'The Utility Shirt',
                quantity: 2,
                price: '$79',
                total: '$158',
            },
            {
                id: 6,
                name: 'The Utility Shirt',
                quantity: 2,
                price: '$79',
                total: '$158',
            },
            {
                id: 7,
                name: 'The Utility Shirt',
                quantity: 2,
                price: '$79',
                total: '$158',
            },
        ],
        gross_total: '$1641',
        shipping_charge: '$23',
        tax: '$19.22',
        net_total: '$1683.22',
        shipping: {
            provider: 'Stanley Jones',
            address_1: '795 Folsom Ave, Suite 600',
            address_2: 'San Francisco, CA 94107',
            phone: '(123) 456-7890 ',
            mobile: '(+01) 12345 67890',
        },
        billing: {
            type: 'Credit Card',
            provider: 'Visa ending in 2851',
            valid: '02/2020',
        },
        delivery: {
            provider: 'UPS Delivery',
            order_id: '#BM31',
            payment_mode: 'COD',
        },
    };

    function handleChangeClientVehicleData (data) {
        setClientVehicleData(data)
    }
    function handleChangeClientData (data) {
        setClienData(data)
    }
   
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'eCommerce', path: '/apps/ecommerce/order/details' },
                    {
                        label: 'Orçamento',
                        path: '/apps/ecommerce/order/details',
                        active: true,
                    },
                ]}
                title={'Orçamento'}
            />

            <Row>
                <Col>
                   

                    <Row>
                        <Col lg={8}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col xs={7} >
                                            <h4 className="header-title mt-2">Orçamento #{order.id}</h4>
                                        </Col>
                                        <Col xs={5} className="d-flex align-items-center" >


                                            <label className='fw-bold me-1' >Tipo:</label> 
                                            <Select
                                                className="react-select w-100"
                                                classNamePrefix="react-select"
                                                options={[
                                                    { value: '1', label: "Tipo 1" },
                                                    { value: '2', label: "Tipo 2" },
                                                    { value: '3', label: "Tipo 3" },
                                                    { value: '3', label: "3" },
                                                ]}
                                                placeholder="Selecione..."
                                                onChange={(e) => console.log(e.value)}
                                            ></Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='d-flex align-items-center mt-2 gap-2 '>
                                            <div className="app-search w-100">
                                                <div className="form-group position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Digite uma sugestão..."
                                                        onChange={(e) => console.log(e.target.value)}
                                                    />
                                                    <span className="mdi mdi-magnify search-icon"></span>
                                                </div>
                                            </div>
                                            <Button type="button" className='text-nowrap' variant="outline-secondary">
                                                Pesquisar sugestões
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Row className='mt-2'>
                                        <Col sm={4}>
                                            
                                        </Col>
                                        <Col sm={4} className="d-flex align-items-center justify-content-center">
                                            <h4 className="header-title">Items selecionado</h4>
                                        </Col>
                                        <Col sm={4} className="d-flex align-content-center justify-content-end mb-2 mt-1 gap-1">
                                            <Button type="button" className='btn-sm text-nowrap px-2' variant="primary">
                                                <i className="mdi mdi-plus"></i><span className=''>Serviços</span>
                                            </Button>
                                            <Button type="button" className='btn-sm text-nowrap px-2' variant="primary">
                                                <i className="mdi mdi-plus"></i><span>Peças</span>
                                            </Button>
                                        </Col>
                                    </Row>

                     
                                    <Items items={order.items} />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card>
                                <Card.Body>
                                    <div className='d-flex align-items-start justify-content-between'>
                                    
                                        <h4 className="header-title">Cliente</h4>
                                        <Button 
                                            type="button" 
                                            className='btn-sm px-2' 
                                            variant="primary"
                                            onClick={ () => setShowModalSearchClient(true)}
                                        >
                                            Adicionar                                       
                                        </Button>
                                    </div>
                                    <ClientInfo details={clientData} />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body>
                                <div className='d-flex align-items-start justify-content-between'>
                                    <h4 className="header-title">Veículo</h4>
                                    <Button 
                                        type="button" 
                                        className='btn-sm px-2' 
                                        variant="primary"
                                        onClick={() => setShowModalSearchVehicle(true)}
                                    >
                                        Adicionar                                       
                                    </Button>
                                </div>
                                    <VehicleInfo details={clientVehicleData} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <ModalVehicleSearch 
                company_id={companyId} 
                showModalSearchVehicle={showModalSearchVehicle} 
                setShowModalSearchVehicle={setShowModalSearchVehicle} 
                handleChangeClientVehicleData={handleChangeClientVehicleData}
            />
            <ModalClientSearch 
                company_id={companyId} 
                showModalSearchClient={showModalSearchClient} 
                setShowModalSearchClient={setShowModalSearchClient} 
                handleChangeClientData={handleChangeClientData}
            />
        </>
    );
};

