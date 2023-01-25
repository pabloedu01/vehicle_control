import { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { Row, Col, Card, Button} from 'react-bootstrap';
import Select from 'react-select';

import { APICore } from '../../../helpers/api/apiCore';
import { formatDateTimePresentation } from '../../../utils/formatDateTimezone'


// components
import PageTitle from '../../../components/PageTitle';
import {ModalVehicleSearch} from "../../../components/Vehicle/ModalVehicleSearch"
import {ModalClientSearch} from "../../../components/Client/ModalClientSearch"
import {ClaimsSearch} from "./ClaimsSearch"


// Item Table
const ClaimItems = (props) => {
    const items = props.items || [];
    return (
        <>
            <div className="table-responsive">
                <table className="table mb-0">
                
                    <tbody>
                        {items.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item.description}</td>
                                    <td align='right'>{}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};
const ItemsSelected = (props) => {
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
                            <th>Desconto</th>
                            <th>Total</th>

                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}</td>
                                    <td>{item.price}</td>
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

const ClientInfo3 = (props) => {
    const details = props.details || {};
    return (
        <>
            <h5>{details.name}</h5>

            <address className="mb-0 font-14 address-lg">
                {details.address && details.address}
                <br />
                {details.address_2}
                <br />
                <abbr title="Phone">P:</abbr> {details.phone && details.phone.map((item, index) => <span>{`${item}${index < details.phone.length? ' - ' : ''}`}</span>)} <br />
                <abbr title="Email">E:</abbr> {details.email && details.email.map((item, index) => (<><span>{`${item}${index < details.phone.length? ' - ' : ''}`}</span><br /></>))}
            </address>
        </>
    );
};

const ClientInfo = (props) => {
    const details = props.details || {};
    return (
        <>
            <ul className="list-unstyled mb-0 mt-2">
                <li>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Nome:</span> {details.name}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Telefone:</span> {details.phone && details.phone.map((item, index) => <span>{`${item}${index < details.phone.length? ' - ' : ''}`}</span>)}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Email:</span> {details.email && details.email.map((item, index) => <span>{`${item}${index < details.phone.length? ' - ' : ''}`}</span>)}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Endereço:</span> {details.address && details.address}
                    </p>
                    <p className="mb-0">
                        <span className="fw-bold me-2">CPF:</span> {details.document && details.document}
                    </p>
                </li>
            </ul>
            
        </>
    );
};
const QuotationInfo = (props) => {
    const details = props.details || {};
    return (
        <>
            <ul className="list-unstyled mb-0 mt-2">
                <li>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Número do Orçamento:</span> {details.quotationNumber && details.quotationNumber}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Data de emissão:</span> {details.created_at && details.created_at}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Responsavel:</span> {details.technical_consultant && details.technical_consultant}
                    </p>
                    <p className="mb-0">
                        <span className="fw-bold me-2">Tipo de Orçamento:</span> {''}
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
                        <span className="fw-bold me-2">Marca:</span> {details.vehicle?.model?.brand?.name}
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

const OrderSummary = (props) => {
    const summary = props.summary || {};

    return (
        <div className="table-responsive">
            <table className="table mb-0">
                <thead className="table-light">
                    <tr>
                        <th>Descrição</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Valor dos itens :</td>
                        <td>{summary.gross_total}</td>
                    </tr>
                    <tr>
                        <td>Descontos nos itens :</td>
                        <td style={{color: 'red'}}>{summary.shipping_charge}</td>
                    </tr>
                    <tr>
                        <td>Valor dos Serviços : </td>
                        <td>{summary.tax}</td>
                    </tr>
                    <tr>
                        <td>Desconto nos Serviços : </td>
                        <td style={{color: 'red'}}>{summary.tax}</td>
                    </tr>
                    <tr>
                        <th>Total de descontos :</th>
                        <td style={{color: 'red'}}>{summary.net_total}</td>
                    </tr>
                    <tr style={{fontSize: '18px'}}>
                        <th>Total liquido:</th>
                        <td>{summary.net_total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default function QuotationCreate() {
    const [showModalSearchVehicle, setShowModalSearchVehicle] = useState(false)
    const [clientVehicleData, setClientVehicleData] = useState(null)
    const [quotationData, setQuotationData] = useState(null)
    const [claimsData, setClaimsData] = useState(null)
    const [isEditingClaims, setIsEditingClaims] = useState(false)
    
    const [showModalSearchClient, setShowModalSearchClient] = useState(false)
    const [clientData, setClientData] = useState(null)
    
    const {companyId, idQuotation} = useParams()

    const api = new APICore()

    const order = {
        id: '#BM31',
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
        setClientData(data)
    }

    function handleClaimsData(data) {
        console.log(data)
        setClaimsData( prevState => [...prevState, {...data, id: prevState.length + 1}])
    }
   
    function toggleIsEditingClaims() {
        setIsEditingClaims(!isEditingClaims)
    }

    useEffect(() => {
        if(idQuotation) {
            api.get('/quotations/show/'+idQuotation).then((response) => {
                const {client, client_vehicle, quotation_claim_service} = response.data.data
                setClientData(client)
                setClientVehicleData(client_vehicle)
                setClaimsData(quotation_claim_service)
                setQuotationData({
                    quotationNumber: response.data.data.id,
                    created_at: formatDateTimePresentation(response.data.data.updated_at),
                    technical_consultant: response.data.data?.technical_consultant?.name,
                    typeQuotation: null,
                })
            })    
        }
    },[idQuotation])


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
                    <Col lg={4}>
                    <Card>
                    <Card.Body>
                        <div className='d-flex align-items-start justify-content-between'>
                        
                            <h4 className="header-title">Dados do Orcamento</h4>
                        </div>
                        <QuotationInfo details={quotationData} />
                    </Card.Body>
                </Card>
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
                                    {clientData ? "Editar" : "Adicionar"}                                       
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
                                {clientVehicleData ? "Editar" : "Adicionar"}                                       
                            </Button>
                        </div>
                            <VehicleInfo details={clientVehicleData} />
                        </Card.Body>
                    </Card>
                    
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mb-3">Resumo do Orçamento</h4>
                            <OrderSummary summary={order} />
                        </Card.Body>
                    </Card>
                
                </Col>
                        <Col lg={8}>
                            <Card>
                                <Card.Body>
                                <div className='d-flex align-items-start justify-content-between'>
                                <h4 className="header-title">Reclamações</h4>
                                <Button 
                                    type="button" 
                                    className='btn-sm px-2' 
                                    variant="primary"
                                    disabled={isEditingClaims}
                                    onClick={toggleIsEditingClaims}
                                >
                                    Editar                                  
                                </Button>
                            </div>
                            {isEditingClaims && <Row>
                                        <Col className='mt-2 mb-2'>
                                             <ClaimsSearch handleClaimsData={handleClaimsData} />
                                        </Col>
                                    </Row>
                            }
                     
                                    <ClaimItems items={claimsData} />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Body>

                                    <Row className='mt-2'>
                                        <Col className="d-flex align-items-center justify-content-between">
                                            <h4 className="header-title">Items selecionado</h4>
                                            <div sm={4} className="d-flex align-content-center justify-content-end mb-2 mt-1 gap-1">
                                                <Button type="button" className='btn-sm text-nowrap px-2' variant="primary">
                                                    <i className="mdi mdi-plus"></i><span className=''>Pacotes</span>
                                                </Button>
                                                <Button type="button" className='btn-sm text-nowrap px-2' variant="primary">
                                                    <i className="mdi mdi-plus"></i><span className=''>Serviços</span>
                                                </Button>
                                                <Button type="button" className='btn-sm text-nowrap px-2' variant="primary">
                                                    <i className="mdi mdi-plus"></i><span>Peças</span>
                                                </Button>
                                            </div>
    
                                        </Col>
                                    </Row>

                     
                                    <ItemsSelected items={order.items} />
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

