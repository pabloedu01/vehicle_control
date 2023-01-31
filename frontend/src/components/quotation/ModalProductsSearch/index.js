import {useEffect, useState} from 'react';
import { Button, Modal,Col,Row } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { ContainerForProductsSearch } from "./ContainerForProductsSearch"

import InputMaskPrice from "../../../components/InputMaskPrice";
import InputMaskPercent from "../../../components/InputMaskPercent";

const api = new APICore();

export function ModalProductsSearch({showModalProducts, setShowModalProducts, company_id, handleChangeProductsData}) {
  const [data, setData] = useState();
  const [isOpenProductValues, setIsOpenProductValues] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  const [productValue, setProductValue] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [disableInput, setDisableInput] = useState('price');
  

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
    setProductValue( parseFloat(productSelected.sale_value).toFixed(2))
  }

  function onHideShowModalProductValues() {
    setIsOpenProductValues(false)
  }

  function addSelectedProduct () {
    handleChangeProductsData(productSelected)
    console.log(productSelected)
    onHideShowModalProductValues()
    setProductSelected(null)
    setShowModalProducts(false)
  }

  function calculateAmountDiscountValue(discount) {
    const price = parseFloat(productSelected?.sale_value).toFixed(2)    
    if(discount.length < 1) {
      return 0;
    }
    return parseFloat(price - (price * parseFloat(discount) / 100)).toFixed(2)     
  } 

  function calculatePercentDiscountValue(amount) {
    if(!productSelected?.sale_value){
      return 0
    }
    const productValueReal = parseFloat(productSelected?.sale_value).toFixed(2)
    if(amount < 1) {
      return 100;
    }
    return (productValueReal - parseFloat(amount)) * 100 / productValueReal  
  } 

  function handlePriceChange(e) {
    let priceParser = parseFloat(e.target.value.replace(/,/g, '')).toFixed(2);
    if(isNaN(priceParser)){
      priceParser = 0
    }


    // console.log(parseFloat(priceParser).toFixed(2) > productSelected?.sale_value)
    // console.log(parseFloat(priceParser).toFixed(2))
    // console.log(productSelected?.sale_value)


    if(priceParser > productSelected?.sale_value) {
      console.log("não pode")
      setDiscountValue(0)
    }

    if(true) {
      setProductValue(0)
    }

    setProductValue(priceParser)
    
    if(priceParser.length > 0 && parseFloat(priceParser).toFixed(2) <= productSelected?.sale_value) {
      const valueDiscount = calculatePercentDiscountValue(priceParser)
      setDiscountValue(valueDiscount)
      setProductValue(parseFloat(priceParser).toFixed(2))
    } else {
      setDiscountValue(0)      
    }
    // console.log('discount', discountValue)
    // console.log('price', discountValue)
  }

  function handleDiscountChange(e) {
    const discountParser = parseFloat(e.target.value).toFixed(2);
    setDiscountValue(e.target.value)
    if(discountParser.length > 0 && discountParser <= 100) {
      const valueDiscount = calculateAmountDiscountValue(discountParser)
      setProductValue(valueDiscount)
    } else {
      setProductValue(parseFloat(productSelected.sale_value).toFixed(2))      
    }
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
                        className="form-control"
                        type="text"
                        placeholder="R$0.00"
                        onChange={handlePriceChange}
                        value={productValue}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Desconto:</label> <br />
                      <InputMaskPercent 
                        className="form-control"
                        type="text"
                        placeholder="00.00"
                        onChange={handleDiscountChange}
                        value={discountValue}
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