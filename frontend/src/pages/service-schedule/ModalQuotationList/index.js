import {useEffect, useState} from 'react';
import { Row, Col, Card, Table, Pagination, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import swal from "sweetalert";

import { APICore } from "../../../helpers/api/apiCore";
import {formatMoneyPt_BR} from '../../../utils/formatMoneyPt_BR'
import { formatDateTimePresentation } from '../../../utils/formatDateTimezone'

const api = new APICore()

export function ModalQuotationList({ openModalQuotationList, setOpenModalQuotationList, company_id, plateVehicle }) {
  const [data, setData] = useState([])

  const history = useNavigate();
  
  function onHideModal() {
    setOpenModalQuotationList(false)
  }

  useEffect(() => { 
      if (openModalQuotationList) {
        console.log('entrou', openModalQuotationList)
          api.get(`/quotations?company_id=${company_id}&search=${plateVehicle}`)
            .then(res => {
                console.log(res.data.data)
                setData(res.data.data)
            })
    }    
  }, [openModalQuotationList])
    
     const onDelete = (registerId, newList) => {
        swal({
            title: 'Você tem certeza!',
            text: 'Irá excluir este registro',
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: {
                    text: 'Excluir',
                    value: 'confirm'
                }
            },
            dangerMode: true,
        }).then((confirm) => {
            if(confirm){
                api.delete('/quotations/' + registerId).then((response) => {
                    console.log(response)
                    if(response.status === 201) {
                        setData(prevState => prevState.filter(item => item.id!== registerId))
                    }
                }, () => {

                });
            }
        });
    };
  
  return (
      <Modal
        show={openModalQuotationList}
        onHide={onHideModal}
        size='lg'
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
                <Modal.Header onHide={onHideModal} closeButton>
                    <h4 className="modal-title">Tipo de orçamento</h4>
                </Modal.Header>
                <Modal.Body>
                
                    <Table responsive="md" size="sm" hover className="mb-0" >
                      <thead >
                          <tr>
                              <th>Numero</th>
                              <th>Data de criação</th>
                              <th>Responsável</th>
                              <th>Tipo Orçamento</th>
                              <th>Total Desconto</th>
                              <th>Total Geral</th>
                              <th>Ação</th>
                          </tr>
                      </thead>
                      <tbody >
                          {data && data?.map((record, index) => {
                              return (
                                  <tr key={index.toString()} onClick={(e) => {
                                      e.stopPropagation();
                                      history(`/panel/company/2/workshop/quotation/${record.id}`)
                                  }}>
                                      
                                      <td>{record.id ?? ' - '}</td>
                                      <td>{formatDateTimePresentation(record.created_at) ?? ' - '}</td>
                                      <td>{record.consultant_id ?? '-'}</td>
                                      <td>{record.os_type_id ?? '-'}</td>
                                      <td>{formatMoneyPt_BR(record.TotalGeralDesconto) ?? '-'}</td>
                                      <td>{formatMoneyPt_BR(record.TotalGeral) ?? '-'}</td>
                                   
                                        <td onClick={e => e.stopPropagation()}>  
                                            <Link to="#" className="action-icon" onClick={() => onDelete(record.id)}>
                                                <i className="mdi mdi-delete"></i>
                                            </Link>
                                        </td>
                                    
                                  </tr>
                              );
                          })}
                      </tbody>
                  </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onHideModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

  )
}