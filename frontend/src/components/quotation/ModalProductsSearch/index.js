import {useEffect, useState} from 'react';
import { Button, Modal,Col,Row } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { ContainerForProductsSearch } from "./ContainerForProductsSearch"
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import CurrencyInput from 'react-currency-masked-input'
import InputMaskPrice from "../../../components/InputMaskPrice";
import InputMaskPercent from "../../../components/InputMaskPercent";

const api = new APICore();

export function ModalProductsSearch({showModalProducts, setShowModalProducts, company_id, handleChangeProductsData}) {
  const [data, setData] = useState();
  const [isOpenProductValues, setIsOpenProductValues] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      price: "R$0.00",
    }
  });

  
  

  function getProducts () {
    api.get('/product?company_id='+company_id).then((response) => {
      console.log(response.data.data);
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
  }

  function onHideShowModalProductValues() {
    setIsOpenProductValues(false)
  }

  function addSelectedProduct () {
    handleChangeProductsData(productSelected)
    onHideShowModalProductValues()
    setProductSelected(null)
    setShowModalProducts(false)
  }

  function onSubmit(data) {
    console.log(data);
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
                        onChange={(e) => console.log("change", e.target.value)}
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
                        onChange={(e) => console.log("change", e.target.value)}
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