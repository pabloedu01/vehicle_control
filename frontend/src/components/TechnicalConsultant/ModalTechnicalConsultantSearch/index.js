import {useEffect, useState} from 'react';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";

import {ContainerForModalWithSearchTechnicalConsultants} from "./ContainerForModalWithSearchTechnicalConsultants"


const api = new APICore();

export function ModalTechnicalConsultantSearch({showModalSearchTechnicalConsultants, setShowModalSearchTechnicalConsultants, company_id, handleChangeTechnicalConsultantData}) {
  const [data, setData] = useState();
  const [TechnicalConsultantSelected, setTechnicalConsultantSelected] = useState();

  function getTechnicalConsultants () {
    api.get('/technical-consultant?company_id='+company_id).then((response) => {
      console.log(response.data.data);
      setData(response.data.data)
    })
  }



  useEffect(() => {
    if (showModalSearchTechnicalConsultants) { 
      getTechnicalConsultants()
    }
  },[showModalSearchTechnicalConsultants])

  
  function  onHideShowModalTechnicalConsultant() {
    setShowModalSearchTechnicalConsultants(false)
  }

  function handleSelectedTechnicalConsultant(TechnicalConsultant) {
    setTechnicalConsultantSelected(TechnicalConsultant)
  }

  function addSelectedTechnicalConsultant () {
    handleChangeTechnicalConsultantData(TechnicalConsultantSelected)
    onHideShowModalTechnicalConsultant()
    setTechnicalConsultantSelected(null)    
  }

  return (
    <>
      <Modal show={showModalSearchTechnicalConsultants} onHide={onHideShowModalTechnicalConsultant}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Consultor técnico</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um consultor técnico abaixo</h5>
              <ContainerForModalWithSearchTechnicalConsultants 
                technicalConsultantsData={data}
                handleSelectedTechnicalConsultant={handleSelectedTechnicalConsultant}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={addSelectedTechnicalConsultant}
              disabled={!TechnicalConsultantSelected}
            >
                salvar
            </Button>
          </Modal.Footer>
      </Modal>
    
    </>
  )
}