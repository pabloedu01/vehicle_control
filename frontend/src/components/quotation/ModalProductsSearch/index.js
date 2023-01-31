import {useEffect, useState} from 'react';
import { Button, Modal,Col,Row } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { ContainerForProductsSearch } from "./ContainerForProductsSearch"

import InputMaskPrice from "../../../components/InputMaskPrice";
import InputMaskPercent from "../../../components/InputMaskPercent";
import InputMaskNumber from "../../../components/InputMaskNumber";

const api = new APICore();

export function ModalProductsSearch({showModalProducts, setShowModalProducts, company_id, handleChangeProductsData}) {
  const [data, setData] = useState();
  const [isOpenProductValues, setIsOpenProductValues] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  const [productValue, setProductValue] = useState('');
  const [discountValue, setDiscountValue] = useState('0');
  const [quantityValue, setQuantityValue] = useState(0);
  

  function getProducts () {
    api.get('/product?company_id='+company_id).then((response) => {
      setData(response.data.data)
    })
  }

  useEffect(() => {
    if (showModalProducts) { 
      getProducts()
    }
  },[showModalProducts])

  function  onHideShowModalProducts() {
    setShowModalProducts(false)
  }

  function gotoProductValues() {
    onHideShowModalProducts()
    setIsOpenProductValues(true)
    setProductSelected(productSelected)
    setProductValue(productSelected.sale_value)
    console.log(productSelected.sale_value)
  }

  function onHideShowModalProductValues() {
    setIsOpenProductValues(false)
  }

  function addSelectedProduct () {
    handleChangeProductsData({
      ...productSelected,
      sale_value: productValue,
      quantity: quantityValue,
      discount_value: discountValue ?? "0"
    })
    onHideShowModalProductValues()
    setProductSelected(null)
    setShowModalProducts(false)
  }

  function calculateAmountDiscountValue(discount) {
    const price = parseFloat(productSelected?.sale_value).toFixed(2)    
    if(discount < 1 || discount.length < 1) {
      setProductValue(productSelected?.sale_value);
      return
    }
    setProductValue(parseFloat(price - (price * parseFloat(discount) / 100)).toFixed(2))     
  } 

  function calculatePercentDiscountValue(amount) {
    console.log('amount', amount)
    if(!productSelected?.sale_value){
      setDiscountValue(0)
      return
    }
    const productValueReal = parseFloat(productSelected?.sale_value).toFixed(2)
    if(amount < 1 || amount.length < 1) {
      setDiscountValue(0);
      return
    }
    setDiscountValue((productValueReal - parseFloat(amount)) * 100 / productValueReal)  
  } 

  function handlePriceChange(value) {
    console.log('price', value)
   
    setProductValue(value)
    
  }

  function handleDiscountChange(value) {
    setDiscountValue(value)
  }

  function handleSetAmountProduct(value) {
    setQuantityValue(value)
  }

  return (
    <>
      <Modal show={showModalProducts} onHide={onHideShowModalProducts}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Produtos</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um Produto abaixo</h5>
              <ContainerForProductsSearch 
                productsData={data}
                setSelectedChangeProductsData={setProductSelected}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={gotoProductValues}
              disabled={!productSelected}
            >
                Proxímo
            </Button>
          </Modal.Footer>
      </Modal>

      <Modal show={isOpenProductValues} onHide={onHideShowModalProductValues}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Produtos</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um Produto abaixo</h5>
                <Row>
                  <Col>
                    <div className="form-group">
                      <label>Valor:</label> <br />
                      <InputMaskPrice 
                        handlePriceChange={handlePriceChange}
                        // priceValue={productValue}
                        priceActual={productSelected?.sale_value}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                <Col className='mt-2'>
                <div className="form-group">
                  <label>Quantidade:</label> <br />
                  <InputMaskNumber 
                    handleSetAmountProduct={handleSetAmountProduct}
                    quantityValue={quantityValue}
                  />
                </div>
              </Col>
                </Row>
                <Row>
                <Col className='mt-2'>
                <div className="form-group">
                  <label>Desconto:</label> <br />
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
              onClick={addSelectedProduct}
              disabled={!productSelected}
            >
                salvar
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}