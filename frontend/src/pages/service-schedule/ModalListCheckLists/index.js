import {useEffect, useState} from 'react';
import { Row, Col, Card, Button, Modal, Table } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";

import List from "./List"


const api = new APICore();

export function ModalListCheckLists({showModalCheckList, setShowModalCheckList, company_id, id}) {
  function getCheckLists() {

  }

  useEffect(() => {
    if (showModalCheckList) { 
      getCheckLists()
    }
  },[showModalCheckList])

  
  
  function  onHideShowModalCheckLists() {
    setShowModalCheckList(false)
  }
  

  return (
    <>
      <Modal show={showModalCheckList} onHide={onHideShowModalCheckLists}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
            <Modal.Header closeButton>
                <h4 className="modal-title">Lista de checklists</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
              <List company={{ id: company_id }} id={id} type={'service-schedules'} />

            </Modal.Body>
        </Modal>
    </>
  )
}