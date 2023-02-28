import { Modal, Button } from 'react-bootstrap'
import  { useNavigate} from 'react-router-dom'

export function ModalSelectTypeMaintenanceReview({
    openModalSelectTypeMaintenanceReview,
    setOpenModalSelectTypeMaintenanceReview,
    company_id,
    id
}) {

    function onHideModal() {
        setOpenModalSelectTypeMaintenanceReview(false)
    }

    const history = useNavigate();

    return (
        <Modal show={openModalSelectTypeMaintenanceReview} onHide={onHideModal}>
                <Modal.Header onHide={onHideModal} closeButton>
                    <h4 className="modal-title">Tipo de orçamento</h4>
                </Modal.Header>
                <Modal.Body>
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/${company_id}/workshop/quotation/create/${id}`) }}
                        disabled
                    >
                        1ª Revisão
                    </Button>
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/2/workshop/quotation/create/${id}`) }}
                        disabled
                    >
                        2ª Revisão
                    </Button>
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/2/workshop/quotation/create/${id}`) }}
                        disabled
                    >
                        3ª Revisão
                    </Button>
                    <Button 
                        variant="Primary"                             
                        className="btn btn-primary w-100 mb-2"
                        onClick={() => { history(`/panel/company/2/workshop/quotation/create/${id}`) }}
                        disabled
                    >
                        4ª Revisão
                    </Button>
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