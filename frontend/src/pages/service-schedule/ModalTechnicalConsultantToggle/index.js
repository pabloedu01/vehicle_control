import {useEffect, useState} from 'react';
import Select from 'react-select';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";

const api = new APICore();

export function ModalTechnicalConsultantToggle({showModalSearchTechnicalConsultant, setShowModalSearchTechnicalConsultant, company_id, handleChangeTechnicalConsultantData}) {
  const [technicalConsultants, setTechnicalConsultants] = useState([]);
  const [technicalConsultantsSelected, setTechnicalConsultantsSelected] = useState(null);

  function getTechnicalConsultants () {
    api.get('/technical-consultant/active-technical-consultants?company_id='+company_id).then((response) => {
      console.log(response.data.data)
      setTechnicalConsultants(response.data.data)
    },(error) => {
      setTechnicalConsultants([]);
    })
  }

  useEffect(() => {
    if (showModalSearchTechnicalConsultant) { 
      getTechnicalConsultants()
    }
  },[showModalSearchTechnicalConsultant])

  
  function  onHideShowModalTechnicalConsultant() {
    setShowModalSearchTechnicalConsultant(false)
    setTechnicalConsultantsSelected(null)
  }

  function addSelectedTechnicalConsultant () {
    const technicalConsultant = technicalConsultants.filter(t => t.id === technicalConsultantsSelected)
    handleChangeTechnicalConsultantData(technicalConsultant[0])
    setTechnicalConsultantsSelected(null)
  }

  return (
    <>
        <Modal show={showModalSearchTechnicalConsultant} onHide={onHideShowModalTechnicalConsultant}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Consultor técnico</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Selecione um Consultor técnico</h5>
                <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    options={technicalConsultants.map(technicalConsultant => (
                      { value: technicalConsultant.id, label: technicalConsultant.name }
                    ))     
                    }
                    placeholder="Selecione..."
                    onChange={(e) => setTechnicalConsultantsSelected(e.value)}
                ></Select>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={addSelectedTechnicalConsultant}
                    disabled={!technicalConsultantsSelected}
                >
                    Salvar
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}