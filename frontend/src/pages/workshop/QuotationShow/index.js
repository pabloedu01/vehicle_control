import { useEffect, useState } from 'react';
import {useNavigate, useParams,Link} from "react-router-dom";
import { Row, Col, Card, Button} from 'react-bootstrap';
import Select from 'react-select';

import { APICore } from '../../../helpers/api/apiCore';
import { formatDateTimePresentation } from '../../../utils/formatDateTimezone'


// components
import PageTitle from '../../../components/PageTitle';
import {ModalVehicleSearch} from "../../../components/Vehicle/ModalVehicleSearch"
import {ModalTechnicalConsultantSearch} from "../../../components/TechnicalConsultant/ModalTechnicalConsultantSearch"
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


const ItemsSelected = ({items = [], onDelete }) => {
    
    return (
        <>
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Itens</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                            <th>Desconto unitário</th>
                            <th>Total</th>
                            <th>Ações</th>

                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 && items.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item?.name || item?.product?.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatMoneyPt_BR(parseFloat(item.price))}</td>
                                    <td>{formatMoneyPt_BR(parseFloat(item.price_discount))}</td>
                                    <td>{formatMoneyPt_BR(parseFloat((item.price - item.price_discount) * parseInt(item.quantity)))}</td>
                                    <td align='center'>  
                                    <Link to="#" className="action-icon" onClick={() => onDelete(item.service_id || item.products_id)}>
                                        <i className="mdi mdi-delete"></i>
                                    </Link>
                                </td>
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
const QuotationInfo = ({details, technicalConsultantData, osTypes, handleTechnicalConsultantSelectedData, handleOsTypeSelectedData, showEditQuotationInfo, technicalConsultantDefault, osType }) => {
    const technicalConsultantDataFormatted = technicalConsultantData.map( item => ({ value: item.id, label: item.name }))
    console.log(osType)
    return (
        <>
            <ul className="list-unstyled mb-0 mt-2">
                <li>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Número do Orçamento:</span> {details?.quotationNumber && details.quotationNumber}
                    </p>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Data de emissão:</span> {details?.created_at && details.created_at}
                    </p>
                    { !showEditQuotationInfo && (     
                    <>
                    <p className="mb-2">
                        <span className="fw-bold me-2">Responsável:</span> {technicalConsultantDefault?.name && technicalConsultantDefault?.name}
                    </p>
                    
                    <p className="mb-0">
                        <span className="fw-bold me-2">Tipo de Orçamento:</span> {osType && osType}
                    </p>
                    
                    </>
                    )}
           
                </li>
                { showEditQuotationInfo && (
                <>
                    <li>
                            <div className="mb-2">
                            <label className="fw-bold">Responsável</label> <br />
                            <Select
                                className="react-select mt-1"
                                classNamePrefix="react-select"
                                options={technicalConsultantData.length > 0 ? technicalConsultantDataFormatted: []}
                                placeholder="Selecione..."
                                onChange={handleTechnicalConsultantSelectedData}
                                defaultValue={{ value: technicalConsultantDefault.id, label: technicalConsultantDefault.name }}
                            ></Select>
                        </div>
                    </li>
                    <li>
                        <div className="mb-0">
                            <label className="fw-bold">Tipo de Orçamento</label> <br />
                            <Select
                                className="react-select mt-1"
                                classNamePrefix="react-select"
                                options={osTypes.map( item => ({ value: item.id, label: item.name }))}
                                onChange={handleOsTypeSelectedData}
                                placeholder="Selecione..."
                            ></Select>
                        </div>
                    </li>
                </>
                )}
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
    const summaryReducer = summary.reduce((acc, curr) =>{
        // const calcPriceDiscountCurrent = parseFloat(calculatePriceDiscountValue((parseFloat(curr.price) * parseInt(curr.quantity)), curr.price_discount))
        const calcPriceQuantityCurrent = (parseFloat(curr.price) * parseInt(curr.quantity))
        const calcPriceDiscountedCurrent = ((parseFloat(curr.price) - parseFloat(curr.price_discount)) * parseInt(curr.quantity))
 
        return {
            itemsValue: acc.itemsValue + calcPriceQuantityCurrent,
            discountItemsValue: acc.discountItemsValue +(curr.price_discount * parseInt(curr.quantity)),
            servicesValue: 0,
            discountServicesValue: 0,
            discountTotalValue: acc.discountItemsValue + acc.discountServicesValue +(curr.price_discount * parseInt(curr.quantity)),
            total: acc.total + calcPriceDiscountedCurrent
         }
    }, {
       itemsValue: 0,
       discountItemsValue: 0,
       servicesValue: 0,
       discountServicesValue: 0,
       discountTotalValue: 0,
       total: 0
    } )

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
                        <td>Valor dos itens:</td>
                        <td>{formatMoneyPt_BR(summaryReducer.itemsValue)}</td>
                    </tr>
                    <tr>
                        <td>Descontos nos itens:</td>
                        <td style={{color: 'red'}}>{formatMoneyPt_BR(summaryReducer.discountItemsValue)}</td>
                    </tr>
                    <tr>
                        <td>Valor dos Serviços: </td>
                        <td>{formatMoneyPt_BR(summaryReducer.servicesValue)}</td>
                    </tr>
                    <tr>
                        <td>Desconto nos Serviços: </td>
                        <td style={{color: 'red'}}>{formatMoneyPt_BR(summaryReducer.discountServicesValue)}</td>
                    </tr>
                    <tr>
                        <th>Total de descontos:</th>
                        <td style={{color: 'red'}}>{formatMoneyPt_BR(summaryReducer.discountTotalValue)}</td>
                    </tr>
                    <tr style={{fontSize: '18px'}}>
                        <th>Total líquido:</th>
                        <td>{formatMoneyPt_BR(summaryReducer.total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default function QuotationShow() {
    const [isActiveSaveButton, setIsActiveSaveButton] = useState(false);
    const [showModalSearchVehicle, setShowModalSearchVehicle] = useState(false)
    const [clientVehicleData, setClientVehicleData] = useState(null)
    const [quotationData, setQuotationData] = useState(null)
    const [claimsData, setClaimsData] = useState([])
    const [isEditingClaims, setIsEditingClaims] = useState(false)
    const [itemsSelectedData, setItemsSelectedData] = useState([])

    const [technicalConsultantData, setTechnicalConsultantData] = useState([])
    const [technicalConsultantSelectedData, setTechnicalConsultantSelectedData] = useState([])

       
    const [osTypeSelectedData, setOsTypeSelectedData] = useState([])
    const [osTypes, setOsTypes] = useState([])

    const [showModalSearchClient, setShowModalSearchClient] = useState(false)
    const [showEditQuotationInfo, setShowEditQuotationInfo] = useState(false)
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
    // function handleChangeTechnicalConsultantData (data) {
    //     setTechnicalConsultantData(data)
    //     if(!isActiveSaveButton) {
    //         isSaveActive()
    //     }
    // }
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
        console.log(itemsSelectedData)
      const dataQuotation = {
        quotation_id: parseInt(idQuotation),
        company_id: parseInt(companyId),
        client_vehicle_id: clientVehicleData.id,
        client_id:clientData.id,
        os_type_id:osTypeSelectedData.id,
        consultant_id: technicalConsultantSelectedData.id,
        quotation_itens:itemsSelectedData.length > 0 ? itemsSelectedData.map(item => {
            delete item.name
            return item
        }) : [],
            
        claim_services: [
            {
                claim_service_id: 1
            },
            {
                claim_service_id: 2
            }
        ]
    }
        
        console.log(dataQuotation)
        api.update('/quotations',dataQuotation).then(response => console.log(response))
    }

    useEffect(() => {
        if(idQuotation) {
            api.get('/quotations/show/'+idQuotation).then((response) => {
                console.log(response.data.data)
                const {client, client_vehicle, quotation_itens,quotation_claim_service, technical_consultant, os_type_id} = response.data.data
                setClientData(client)
 
                // setTechnicalConsultantData([technical_consultant])
                setClientVehicleData(client_vehicle)
                setClaimsData(quotation_claim_service)
                setQuotationData({
                    quotationNumber: response.data.data.id,
                    created_at: formatDateTimePresentation(response.data.data.updated_at),
                    typeQuotation: null,
                    technical_consultant,
                    os_type_id
                })
                setItemsSelectedData(quotation_itens)
            })    
        }
    },[idQuotation])

    function handleItemsSelectedData(data) {
        setItemsSelectedData(prevState => [...prevState, data])
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }

    function onDeleteItemsSelectedData(id) {
        const itemsSelectedDataDeletedFiltered = itemsSelectedData.filter(item => (item.products_id !== id && item.service_id === null) || (item.service_id !== id && item.products_id === null))
         console.log(itemsSelectedDataDeletedFiltered)
         console.log(id)
         setItemsSelectedData(itemsSelectedDataDeletedFiltered)
     }

     function handleTechnicalConsultantSelectedData(data) {
        const technicalConsultant = technicalConsultantData.find( t => t.id === data.value)
        setTechnicalConsultantSelectedData(technicalConsultant)
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }
    function handleOsTypeSelectedData(data) {
        const osType = osTypes.find( t => t.id === data.value)
        setOsTypeSelectedData(osType)
        if(!isActiveSaveButton) {
            isSaveActive()
        }
    }

    async function handleEditQuotationInfo() {
        await api.get('/os?company_id='+companyId).then((response) => {
            setOsTypes(response.data.data)
        })    
        await api.get('/technical-consultant?company_id='+companyId).then((response) => {
            setTechnicalConsultantData(response.data.data)
        })    
        setShowEditQuotationInfo(true)
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
                            
                    <h4 className="header-title">Orçamento</h4>
                    <Button 
                            type="button" 
                            className='btn-sm px-2' 
                            variant="primary"
                            onClick={ handleEditQuotationInfo}
                        >
                            Editar                                       
                        </Button>
                    </div>
                        <QuotationInfo 
                            details={quotationData} 
                            technicalConsultantData={technicalConsultantData}
                            osTypes={osTypes}
                            handleTechnicalConsultantSelectedData={handleTechnicalConsultantSelectedData}
                            handleOsTypeSelectedData={handleOsTypeSelectedData}
                            showEditQuotationInfo={showEditQuotationInfo}
                            technicalConsultantDefault={quotationData?.technical_consultant}
                            osType={quotationData?.os_type_id}
                        />
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
                                    <ItemsSelected items={itemsSelectedData} onDelete={onDeleteItemsSelectedData}/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
            <ModalClientSearch 
                company_id={companyId} 
                showModalSearchClient={showModalSearchClient} 
                setShowModalSearchClient={setShowModalSearchClient} 
                handleChangeClientData={handleChangeClientData}
            />
    

            <ModalVehicleSearch 
                company_id={companyId} 
                showModalSearchVehicle={showModalSearchVehicle} 
                setShowModalSearchVehicle={setShowModalSearchVehicle} 
                handleChangeClientVehicleData={handleChangeClientVehicleData}
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

