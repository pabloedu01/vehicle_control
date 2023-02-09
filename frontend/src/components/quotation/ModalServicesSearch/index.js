import {useEffect, useState} from 'react';
import { Button, Modal,Col,Row } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { ContainerForServicesSearch } from "./ContainerForServicesSearch"

import InputMaskPrice from "../../../components/InputMaskPrice";
import InputMaskPercent from "../../../components/InputMaskPercent";
import InputMaskNumber from "../../../components/InputMaskNumber";

const api = new APICore();

export function ModalServicesSearch({showModalServices, setShowModalServices, company_id, handleChangeServicesData}) {
  const [data, setData] = useState();
  const [isOpenServiceValues, setIsOpenServiceValues] = useState(false);
  const [serviceSelected, setServiceSelected] = useState(null);
  const [serviceValue, setServiceValue] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [quantityValue, setQuantityValue] = useState(1);
  

  function getServices () {
    api.get('/service?company_id='+company_id).then((response) => {
      console.log(response.data.data)
      setData(response.data.data)
    })
  }

  useEffect(() => {
    if (showModalServices) { 
      getServices()
    }
  },[showModalServices])

  function  onHideShowModalServices() {
    setShowModalServices(false)
  }

  function gotoServiceValues() {
    onHideShowModalServices()
    setIsOpenServiceValues(true)
    setServiceSelected(serviceSelected)
    setServiceValue(serviceSelected.sale_value)
  }

  function onHideShowModalServicesValues() {
    setIsOpenServiceValues(false)
  }

  function addSelectedService () {
    handleChangeServicesData({
      name: serviceSelected.description,
      service_id: serviceSelected.id,
      products_id: null,
      price: `${serviceValue}`,
      quantity: `${quantityValue}`,
      price_discount: `${discountValue ?? "0"}`
    })
    onHideShowModalServicesValues()
    setServiceSelected(null)
    setShowModalServices(false)
  }

  function calculateAmountDiscountValue(discount) {
    const price = parseFloat(serviceSelected?.sale_value).toFixed(2)    
    if(discount < 1 || discount.length < 1) {
      setServiceValue(serviceSelected?.sale_value);
      return
    }
    setServiceValue(parseFloat(price - (price * parseFloat(discount) / 100)).toFixed(2))     
  } 

  function calculatePercentDiscountValue(amount) {
    if(!serviceSelected?.sale_value){
      setDiscountValue(0)
      return
    }
    const serviceValueReal = parseFloat(serviceSelected?.sale_value).toFixed(2)
    if(amount < 1 || amount.length < 1) {
      setDiscountValue(0);
      return
    }
    setDiscountValue((serviceValueReal - parseFloat(amount)) * 100 / serviceValueReal)  
  } 

  function handlePriceChange(value) {  
    setServiceValue(value)
    
  }

  function handleDiscountChange(value) {
    setDiscountValue(value)
  }

  function handleSetAmountService(value) {
    setQuantityValue(value)
  }

  return (
    <>
      <Modal show={showModalServices} onHide={onHideShowModalServices}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Produtos</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um Produto abaixo</h5>
              <ContainerForServicesSearch 
                servicesData={data}
                setSelectedChangeServicesData={setServiceSelected}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={gotoServiceValues}
              disabled={!serviceSelected}
            >
                Proxímo
            </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={isOpenServiceValues} onHide={onHideShowModalServicesValues}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Produtos</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um Serviço abaixo</h5>
              <Row>
              <Col >
                <div className="form-group">
                  <label>Quantidade:</label> <br />
                    <InputMaskNumber 
                      handleSetAmount={handleSetAmountService}
                      quantityInitial={quantityValue}
                    />
                  </div>
                </Col>
              </Row>
                <Row>
                  <Col className='mt-2'>
                    <div className="form-group">
                      <label>Valor em R$:</label> <br />
                      <InputMaskPrice 
                        handlePriceChange={handlePriceChange}
                        // priceValue={productValue}
                        priceActual={serviceSelected?.standard_value}
                      />
                    </div>
                  </Col>
                </Row>
          
                <Row>
                <Col className='mt-2'>
                <div className="form-group">
                  <label>Desconto unitário em R$:</label> <br />
                  <InputMaskPrice 
                    handlePriceChange={handleDiscountChange}
                    priceActual={discountValue}
                  />
                </div>
              </Col>
                </Row>
      
           {/* 
              <Row>
                <Col className='mt-2'>
                  <div className="form-group">
                    <label>Desconto em %:</label> <br />
                    <InputMaskPercent 
                      handleDiscountChange={handleDiscountChange}
                      discountValue={discountValue}
                      calculateAmountDiscountValue={calculateAmountDiscountValue}
                    />
                  </div>
                </Col>
              </Row>
          */ }
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={addSelectedService}
              disabled={!serviceSelected}
            >
                salvar
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}