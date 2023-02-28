import {useEffect, useState} from 'react';
import { Button, Modal,Col,Row } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { ContainerForKitsSearch } from "./ContainerForKitsSearch"

import InputMaskPrice from "../../InputMaskPrice";
import InputMaskNumber from "../../InputMaskNumber";

const api = new APICore();

export function ModalKitsSearch({showModalKits, setShowModalKits, company_id, handleChangeProductsData, handleChangeServicesData}) {
  const [data, setData] = useState();
  const [isOpenKitValues, setIsOpenKitValues] = useState(false);
  const [kitSelected, setKitSelected] = useState(null);
  // const [kitValue, setKitValue] = useState('');
  // const [discountValue, setDiscountValue] = useState(0);
  // const [quantityValue, setQuantityValue] = useState(1);
  

  function getKits () {
    api.get('/kit?search=&company_id='+company_id).then((response) => {
      console.log(response.data.data)
      setData(response.data.data)
    })
  }

  useEffect(() => {
    if (showModalKits) { 
      getKits()
    }
  },[showModalKits])

  function  onHideShowModalKits() {
    setShowModalKits(false)
  }

  
  function onHideShowModalKitValues() {
    setIsOpenKitValues(false)
  }
  
  async function addSelectedKit() {
    // await handleChangeKitsData({
      //   service_id: null,
      //   products_id: productSelected.id,
      //   name: productSelected.name,
      //   price: `${productValue ?? "0"}`,
      //   quantity: `${quantityValue ?? "0"}`,
      //   price_discount: `${discountValue ?? "0"}`
      // })
    
    
      if(kitSelected.products.length > 0) {
        kitSelected.products.map(product => {
          handleChangeProductsData(product)
        })
      }
      if(kitSelected.services.length > 0) {
        kitSelected.services.map(service => {
          handleChangeServicesData(service)
        })
      }

      onHideShowModalKitValues()
      setKitSelected(null)
      setShowModalKits(false)
  }
  
  // function gotoProductValues() {
  //   onHideShowModalKits()
  //   setIsOpenKitValues(true)
  //   setKitSelected(kitSelected)
  //   setKitValue(kitSelected.sale_value)
  // }
    
  // function calculateAmountDiscountValue(discount) {
  //   const price = parseFloat(kitSelected?.sale_value).toFixed(2)    
  //   if(discount < 1 || discount.length < 1) {
  //     setKitValue(kitSelected?.sale_value);
  //     return
  //   }
  //   setKitValue(parseFloat(price - (price * parseFloat(discount) / 100)).toFixed(2))     
  // } 

  // function calculatePercentDiscountValue(amount) {
  //   if(!kitSelected?.sale_value){
  //     setDiscountValue(0)
  //     return
  //   }
  //   const productValueReal = parseFloat(kitSelected?.sale_value).toFixed(2)
  //   if(amount < 1 || amount.length < 1) {
  //     setDiscountValue(0);
  //     return
  //   }
  //   setDiscountValue((productValueReal - parseFloat(amount)) * 100 / productValueReal)  
  // } 

  // function handlePriceChange(value) { 
  //   console.log('price', value)
  //   setKitValue(value)
    
  // }

  // function handleDiscountChange(value) {
  //   setDiscountValue(value)
  // }

  // function handleSetAmountProduct(value) {
  //   setQuantityValue(value)
  // }

  return (
    <>
      <Modal show={showModalKits} onHide={onHideShowModalKits}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Kits</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um kit abaixo</h5>
              <ContainerForKitsSearch 
                kitsData={data}
                setSelectedChangeKitsData={setKitSelected}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={addSelectedKit}
              disabled={!kitSelected}
            >
                Salvar
            </Button>
          </Modal.Footer>
      </Modal>

      {/*
    
      <Modal show={isOpenKitValues} onHide={onHideShowModalKitValues}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Produtos</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um Produto abaixo</h5>
              <Row>
              <Col >
                <div className="form-group">
                  <label>Quantidade:</label> <br />
                    <InputMaskNumber 
                      handleSetAmount={handleSetAmountProduct}
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
                        priceActual={kitSelected?.sale_value}
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
          
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={addSelectedKit}
              disabled={!kitSelected}
            >
                salvar
            </Button>
          </Modal.Footer>
        </Modal>
      */}

    </>
  )
}