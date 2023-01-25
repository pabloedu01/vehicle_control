import {useEffect, useState} from 'react';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";

import {ContainerForModalWithSearchClients} from "./ContainerForModalWithSearchClients"


const api = new APICore();

export function ModalClientSearch({showModalSearchClient, setShowModalSearchClient, company_id, handleChangeClientData}) {
  const [data, setData] = useState();
  const [clientSelected, setClientSelected] = useState();

  function getClients () {
    api.get('/client?company_id='+company_id).then((response) => {
      setData(response.data.data)
    })
  }



  useEffect(() => {
    if (showModalSearchClient) { 
      getClients()
    }
  },[showModalSearchClient])

  
  function  onHideShowModalClient() {
    setShowModalSearchClient(false)
  }

  function handleSelectedClient(client) {
    setClientSelected(client)
  }

  function addSelectedClient () {
    handleChangeClientData(clientSelected)
    onHideShowModalClient()
    setClientSelected(null)    
  }

  return (
    <>
      <Modal show={showModalSearchClient} onHide={onHideShowModalClient}>
          <Modal.Header closeButton>
              <h4 className="modal-title">Cliente</h4>
          </Modal.Header>
          <Modal.Body className='py-3'>
              <h5>Selecione um veículo abaixo</h5>
              <ContainerForModalWithSearchClients 
                clientsData={data}
                handleSelectedClient={handleSelectedClient}
              />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={addSelectedClient}
              disabled={!clientSelected}
            >
                salvar
            </Button>
          </Modal.Footer>
      </Modal>
    
    </>
  )
}