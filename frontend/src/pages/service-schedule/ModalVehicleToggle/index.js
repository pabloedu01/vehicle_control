import {useEffect, useState} from 'react';
import Select from 'react-select';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import useToggle  from '../../../hooks/useToggle'
import {ContainerForVehicleWithSearchVehicles} from "../../../components/ContainerForVehicleWithSearchVehicles"


const api = new APICore();

export function ModalVehicleToggle({showModalSearchVehicle, setShowModalSearchVehicle, company_id}) {
  const [data, setData] = useState();
  const [brands, setBrands] = useState([]);
  const [brandSelected, setBrandSelected] = useState();
  const [isOpenModel, setIsOpenModel] = useToggle();
  const [models, setModels] = useState([]);
  const [modelSelected, setModelSelected] = useState();
  const [isOpenVehicle, setIsOpenVehicle] = useToggle();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleSelected, setVehicleSelected] = useState([]);


  function getBrands () {
    api.get('/vehicle-brand?company_id='+company_id).then((response) => {
        setBrands(response.data.data)
    })
  }
  function getModels () {
    api.get('/vehicle-model?brand_id='+data.brand).then((response) => {

        setModels(response.data.data)
    })
  }
  function getVehicles () {
    api.get('/vehicle/active-vehicles?model_id='+data.model).then((response) => {
        console.log(response.data.data)
        setVehicles(response.data.data)
    })
  }

  useEffect(() => {
    if (showModalSearchVehicle) { 
      getBrands()
    }
  },[showModalSearchVehicle])

  useEffect(() => {
    if (isOpenModel) { 
      getModels()
    }
  },[isOpenModel])

  useEffect(() => {
    if (isOpenVehicle) { 
      getVehicles()
    }
  },[isOpenVehicle])
  
  function  onHideShowModalBrand() {
    setShowModalSearchVehicle(false)
  }
  function  onHideShowModalModel() {
    setIsOpenModel(false)
  }

  function handleGoToModel() {
    
      onHideShowModalBrand();
      setIsOpenModel(true); 
      setData({
        brand: brandSelected
      })
  }

  function handleGoToVehicle() {
    
      onHideShowModalModel();
      setIsOpenVehicle(true); 
      setData(prevState => ({
        ...prevState,
        model: modelSelected
      }))
  }

  function  onHideShowModalVehicle() {
    setIsOpenVehicle(false)
  }

  return (
    <>
        <Modal show={showModalSearchVehicle} onHide={onHideShowModalBrand}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Marca Veículo</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Selecione uma marca abaixo</h5>
                <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    options={brands.map(brandItem => (
                      { value: brandItem.id, label: brandItem.name }
                    ))     
                    }
                    placeholder="Selecione..."
                    onChange={(e) => setBrandSelected(e.value)}
                ></Select>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={handleGoToModel}
                    disabled={!brandSelected}
                >
                    Próximo
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={isOpenModel} onHide={onHideShowModalModel}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Modelo Veículo</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Selecione um modelo abaixo</h5>
                <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    options={models.map(modelItem => (
                      { value: modelItem.id, label: modelItem.name }
                    ))     
                    }
                    placeholder="Selecione..."
                    onChange={(e) => setModelSelected(e.value)}
                ></Select>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleGoToVehicle}
                disabled={!modelSelected}
              >
                  Próximo
              </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={isOpenVehicle} onHide={onHideShowModalVehicle}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Veículos</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Selecione um veículo abaixo</h5>
                <ContainerForVehicleWithSearchVehicles vehiclesData={vehicles} setSelectedVehicle={setData}/>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleGoToVehicle}
                disabled={!modelSelected}
              >
                  Próximo
              </Button>
            </Modal.Footer>
        </Modal>
    
    </>
  )
}