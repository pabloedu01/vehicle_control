import {useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap'
import  { useNavigate} from 'react-router-dom'

import { APICore } from "../../../helpers/api/apiCore";


const api = new APICore();


export function ModalSelectTypeMaintenanceReview({
    openModalSelectTypeMaintenanceReview,
    setOpenModalSelectTypeMaintenanceReview,
    company_id,
    id
}) {


    const [maintenanceReviewButtons, setMaintenanceReviewButtons] = useState([]);

    const history = useNavigate();
    
    function onHideModal() {
        setOpenModalSelectTypeMaintenanceReview(false)
    }

    useEffect(() => {
        if (openModalSelectTypeMaintenanceReview) {
            api.get(`/maintenance-review?company_id=2&model_id=1`).then(response => { setMaintenanceReviewButtons(response.data.data) })
        }
    },[openModalSelectTypeMaintenanceReview])


    return (
        <Modal show={openModalSelectTypeMaintenanceReview} onHide={onHideModal}>
                <Modal.Header onHide={onHideModal} closeButton>
                    <h4 className="modal-title">Tipo de orçamento</h4>
                </Modal.Header>
            <Modal.Body>
                {maintenanceReviewButtons.map((maintenanceReview, index) => (
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/${maintenanceReview.company_id}/workshop/quotation/create/${id}`) }}
                        disabled
                        key={maintenanceReview.name + maintenanceReview.id + index}
                    >
                        {maintenanceReview.name}
                    </Button>
                ))}
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/2/workshop/quotation/create/${id}`) }}>
                        Outros Serviços
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onHideModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
  )
}