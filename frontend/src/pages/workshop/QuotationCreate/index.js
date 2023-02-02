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
import {ModalServicesSearch} from "../../../components/quotation/ModalServicesSearch"
import {ModalProductsSearch} from "../../../components/quotation/ModalProductsSearch"
import {ClaimsSearch} from "./ClaimsSearch"
import {formatMoneyPt_BR} from '../../../utils/formatMoneyPt_BR'

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


function calculateAmountDiscountValue(amount, discount) {
   
    const price = parseFloat(amount).toFixed(2)    
    
    return parseFloat(price - (price * parseFloat(discount) / 100)).toFixed(2)     
}

function calculatePriceDiscountValue(amount, discount) {
    const price = parseFloat(amount).toFixed(2)    
    return parseFloat((price * parseFloat(discount) / 100)).toFixed(2)     
}

function calculateTotalNoDiscount(price, quantity) {
    return (parseFloat(price) * parseInt(quantity)).toFixed(2)
}


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
                        {items.length > 0 && items.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.sale_value}</td>
                                    <td>{item.discount_value}</td>
                                    <td>{calculateAmountDiscountValue(calculateTotalNoDiscount(item.sale_value,item.quantity), item.discount_value)}</td>
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
    const summary = props.summary || [];
    console.log(summary)
    const summaryReducer = summary.reduce((acc, curr) =>{
        const calcPriceDiscountCurrent = parseFloat(calculatePriceDiscountValue((parseFloat(curr.sale_value) * parseInt(curr.quantity)), curr.discount_value))
        const calcPriceQuantityCurrent = (parseFloat(curr.sale_value) * parseInt(curr.quantity))
 
        return {
            itemsValue: acc.itemsValue + calcPriceQuantityCurrent,
            discountItemsValue: acc.discountItemsValue + calcPriceDiscountCurrent,
            servicesValue: 0,
            discountServicesValue: 0,
            discountTotalValue: acc.discountItemsValue + acc.discountServicesValue + calcPriceDiscountCurrent,
            total: acc.total + calcPriceQuantityCurrent - calcPriceDiscountCurrent
         }
    }, {
       itemsValue: 0,
       discountItemsValue: 0,
       servicesValue: 0,
       discountServicesValue: 0,
       discountTotalValue: 0,
       total: 0
    } )

    console.log('Total ' ,summaryReducer)

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
                        <td>{formatMoneyPt_BR(summaryReducer.itemsValue)}</td>
                    </tr>
                    <tr>
                        <td>Descontos nos itens :</td>
                        <td style={{color: 'red'}}>{formatMoneyPt_BR(summaryReducer.discountItemsValue)}</td>
                    </tr>
                    <tr>
                        <td>Valor dos Serviços : </td>
                        <td>{formatMoneyPt_BR(summaryReducer.servicesValue)}</td>
                    </tr>
                    <tr>
                        <td>Desconto nos Serviços : </td>
                        <td style={{color: 'red'}}>{formatMoneyPt_BR(summaryReducer.discountServicesValue)}</td>
                    </tr>
                    <tr>
                        <th>Total de descontos :</th>
                        <td style={{color: 'red'}}>{formatMoneyPt_BR(summaryReducer.discountTotalValue)}</td>
                    </tr>
                    <tr style={{fontSize: '18px'}}>
                        <th>Total liquido:</th>
                        <td>{formatMoneyPt_BR(summaryReducer.total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default function QuotationCreate() {
    const [isActiveSaveButton, setIsActiveSaveButton] = useState(false);
    const [showModalSearchVehicle, setShowModalSearchVehicle] = useState(false)
    const [clientVehicleData, setClientVehicleData] = useState(null)
    const [quotationData, setQuotationData] = useState(null)
    const [claimsData, setClaimsData] = useState([])
    const [isEditingClaims, setIsEditingClaims] = useState(false)
    const [itemsSelectedData, setItemsSelectedData] = useState([])


    const [showModalSearchClient, setShowModalSearchClient] = useState(false)
    const [clientData, setClientData] = useState(null)

    const [showModalServices, setShowModalServices] = useState(false)
   
    const [showModalProducts, setShowModalProducts] = useState(false)
    
    const {companyId, idQuotation} = useParams()

    const api = new APICore()

    

    function handleChangeClientVehicleData (data) {
        setClientVehicleData(data)
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }
    function handleChangeClientData (data) {
        setClientData(data)
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }

    function handleClaimsData(data) {
        setClaimsData( prevState => [...prevState, {...data, id: prevState.length + 1}])
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }
   
    function toggleIsEditingClaims() {
        setIsEditingClaims(!isEditingClaims)
    }

    function isSaveActive() {
        setIsActiveSaveButton(true)
    }

    function saveQuotation() {
      const dataQuotation = {
            quotation_id: 24,
            company_id: 1,
            client_vehicle_id: 1,
            client_id:"",
            consultant_id: 1,
            quotation_itens: itemsSelectedData.map(item => (
                {
                    "service_id": item.service_id ? item.service_id: null,
                    "products_id": item.id,
                    "price": item.sale_value,
                    "price_discount": item.discount_value,
                    "quantity": item.quantity
                }
            )),
            claim_services: []
        }

        api.update('/quotations',dataQuotation).then(response => console.log(response))
        // console.log(dataQuotation)
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

    function handleItemsSelectedData(data) {
        setItemsSelectedData(prevState => [...prevState, data])
        // setItemsSelectedData(prevState => [data])
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }


    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Oficina', path: `/workshop/quotation/list` },
                    {
                        label: 'Orçamento',
                        path: '/workshop/quotation/list',
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
                            <OrderSummary summary={itemsSelectedData} />
                        </Card.Body>
                    </Card>
                
                </Col>
                        <Col lg={8}>
                      {isActiveSaveButton && <Row className='mb-3'>
                                <Col>
                                    <Button 
                                        type="button" 
                                        className='btn-md w-100 text-uppercase fw-bold' 
                                        variant="primary"
                                        onClick={saveQuotation}
                                    >
                                        salvar
                                    </Button>
                                </Col>
                            </Row>}
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
                                            <ClaimsSearch handleClaimsData={handleClaimsData} items={claimsData} />
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
                                                <Button 
                                                    type="button" 
                                                    className='btn-sm text-nowrap px-2' 
                                                    variant="primary"
                                                    onClick={() => setShowModalServices(true)}
                                                   
                                                    >
                                                    <i className="mdi mdi-plus"></i><span className=''>Serviços</span>
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    className='btn-sm text-nowrap px-2' 
                                                    variant="primary"
                                                    onClick={() => setShowModalProducts(true)}
                                                >
                                                    <i className="mdi mdi-plus"></i><span>Peças</span>
                                                </Button>
                                            </div>
    
                                        </Col>
                                    </Row>
                                    <ItemsSelected items={itemsSelectedData} />
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

            <ModalServicesSearch 
                showModalServices={showModalServices}
                setShowModalServices={setShowModalServices}
                company_id={companyId} 
                handleChangeServicesData={() => {}}
            />
            <ModalProductsSearch 
                showModalProducts={showModalProducts}
                setShowModalProducts={setShowModalProducts} 
                company_id={companyId} 
                handleChangeProductsData={handleItemsSelectedData}
            />
        </>
    );
};

