import {useEffect, useState} from 'react';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { ContainerForServicesSearch } from "./ContainerForServicesSearch"


const api = new APICore();

export function ModalServicesSearch({showModalServices, setShowModalServices, company_id, handleChangeServicesData}) {
  const [data, setData] = useState();
  const [isOpenServices, setIsOpenServices] = useState(false);
  const [serviceSelected, setServiceSelected] = useState(null);

  function getBrands () {
    api.get('/vehicle-brand?company_id='+company_id).then((response) => {
      setData(response.data.data)
    })
  }

  useEffect(() => {
    if (showModalServices) { 
      getBrands()
      setIsOpenServices(true)
    }
  },[showModalServices])

  function  onHideShowModalServices() {
    setIsOpenServices(false)
  }

  function addSelectedClientVehicle () {
    handleChangeServicesData(serviceSelected)
    onHideShowModalServices()
    setServiceSelected(null)
  }

  return (
    <>
      <Modal show={isOpenServices} onHide={onHideShowModalServices}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Veículos</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um serviço abaixo</h5>
              <ContainerForServicesSearch 
                servicesData={data}
                setSelectedChangeServicesData={setServiceSelected}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={addSelectedClientVehicle}
              disabled={!serviceSelected}
            >
                Proxímo
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}