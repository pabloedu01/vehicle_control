import {useEffect, useState} from 'react';
import Select from 'react-select';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import useToggle  from '../../../hooks/useToggle'
import {ContainerForVehicleWithSearchVehicles} from "../ContainerForVehicleWithSearchVehicles"


const api = new APICore();

export function ModalVehicleSearch({showModalSearchVehicle, setShowModalSearchVehicle, company_id, handleChangeClientVehicleData}) {
  const [data, setData] = useState();
  const [brands, setBrands] = useState([]);
  const [brandSelected, setBrandSelected] = useState();
  const [isOpenModel, setIsOpenModel] = useToggle();
  const [models, setModels] = useState([]);
  const [modelSelected, setModelSelected] = useState();
  const [isOpenVehicle, setIsOpenVehicle] = useToggle();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleSelected, setVehicleSelected] = useState([]);
  const [isOpenClientVehicle, setIsOpenClientVehicle] = useToggle();
  const [clientVehicles, setClientVehicles] = useState([]);
  const [clientVehicleSelected, setClientVehicleSelected] = useState(null);

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
        setVehicles(response.data.data)
    })
  }
  function getClientVehicle () {
    api.get('/client-vehicle?vehicle_id='+data.vehicle).then((response) => {
        setClientVehicles(response.data.data)
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

  useEffect(() => {
    if (isOpenClientVehicle) { 
      getClientVehicle()
    }
  },[isOpenClientVehicle])
  
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
  function handleGoToClientVehicle() {
      onHideShowModalVehicle();
      setIsOpenClientVehicle(true); 
      setData(prevState => ({
        ...prevState,
        vehicle: vehicleSelected
      }))
  }

  function  onHideShowModalClientVehicle() {
    setIsOpenClientVehicle(false)
  }

  function addSelectedClientVehicle () {
    handleChangeClientVehicleData(clientVehicleSelected)
    onHideShowModalClientVehicle()
    setClientVehicleSelected(null)
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
                <h4 className="modal-title">Modelo Veículo</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Selecione um modelo abaixo</h5>
                <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    options={vehicles.map(modelItem => (
                      { value: modelItem.id, label: modelItem.name }
                    ))     
                    }
                    placeholder="Selecione..."
                    onChange={(e) => setVehicleSelected(e.value)}
                ></Select>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={handleGoToClientVehicle}
                disabled={!vehicleSelected}
              >
                  Próximo
              </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={isOpenClientVehicle} onHide={onHideShowModalClientVehicle}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Veículos</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Selecione um veículo abaixo</h5>
                <ContainerForVehicleWithSearchVehicles 
                  vehiclesData={clientVehicles} 
                  setSelectedVehicle={setClientVehicleSelected}/>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={addSelectedClientVehicle}
                disabled={!clientVehicleSelected}
              >
                  salvar
              </Button>
            </Modal.Footer>
        </Modal>
    
    </>
  )
}