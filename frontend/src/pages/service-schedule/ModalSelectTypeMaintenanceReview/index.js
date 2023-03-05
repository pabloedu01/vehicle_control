import {useEffect, useState} from 'react';
import { Modal, Button } from 'react-bootstrap'
import  { Link, useNavigate} from 'react-router-dom'

import { APICore } from "../../../helpers/api/apiCore";


const api = new APICore();


export function ModalSelectTypeMaintenanceReview({
    openModalSelectTypeMaintenanceReview,
    setOpenModalSelectTypeMaintenanceReview,
    company_id,
    modelVehicleId,
    serviceScheduleId
}) {


    const [maintenanceReviewButtons, setMaintenanceReviewButtons] = useState([]);

    const history = useNavigate();
    
    function onHideModal() {
        setOpenModalSelectTypeMaintenanceReview(false)
    }

    useEffect(() => {
        if (openModalSelectTypeMaintenanceReview) {
            api.get(`/maintenance-review?company_id=${company_id}&model_id=${modelVehicleId}`).then(response => { setMaintenanceReviewButtons(response.data.data) })
        }
    },[openModalSelectTypeMaintenanceReview])


    return (
        <Modal show={openModalSelectTypeMaintenanceReview} onHide={onHideModal}>
                <Modal.Header onHide={onHideModal} closeButton>
                    <h4 className="modal-title">Tipo de orçamento</h4>
                </Modal.Header>
            <Modal.Body>
                {maintenanceReviewButtons.map((maintenanceReview, index) => (
                    <Link to={`/panel/company/${maintenanceReview.company_id}/workshop/quotation/maintenance-review/${maintenanceReview.id}/${modelVehicleId}`} key={index + "_"+maintenanceReview.id} state={{serviceScheduleId}}> 
                        <a 
                            key={index + "_"+maintenanceReview.id}
                            href='#'    
                            variant="Primary"                             
                            className="btn btn-primary w-100 mb-2"
                            // onClick={() => { history(`/panel/company/${maintenanceReview.company_id}/workshop/quotation/create/${id}`) }}
                            //onClick={() => { history(`/panel/company/${maintenanceReview.company_id}/workshop/quotation/maintenance-review/${maintenanceReview.id}/${modelVehicleId}`) }}
                            key={maintenanceReview.name + maintenanceReview.id + index}
                        >
                            {maintenanceReview.name}
                        </a>
                    </Link>
                ))}
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/${company_id}/workshop/quotation/create/${serviceScheduleId}`) }}>
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