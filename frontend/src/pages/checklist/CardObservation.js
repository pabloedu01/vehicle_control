import React, {  useRef } from 'react';
import {Button, Col, Row, Card} from "react-bootstrap";

export function CardObservation({
  index, 
  selectedCardMakup, 
  onMouseOverSelected, 
  onEditObservations, typeMarkups,
  observation,
  observationsIndex,
  setObservations,
  isEditingIndex,
  setFileUploadDataTemp,
  setShowModalObservations,
  setMarkupActual,
  setIsEditingIndex,
  setFileUploadData,
  fileUploadDataTemp,
  setShowFileUpload,
  observations,
  onDeleteObservations,
  onSaveObservations
}) {
  const cardRef = useRef(null)

    if (index === isEditingIndex) {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ block: "start", behavior: "smooth" })
    }
  }

  return (
    <Card key={index} ref={cardRef} style={{ border: '1px solid #000' }} onMouseOver={() => {
      if (!isEditingIndex) {
        onMouseOverSelected(index)
      }
    }} onMouseOut={() => {
      if (!isEditingIndex) {
        onMouseOverSelected(null)
      }
    }}>
        <Card.Header className='d-flex justify-content-between align-items-center' style={{ background: `${selectedCardMakup === index ? 'rgba(0, 0, 0, 0.1)' : 'none'}`}}>
            <span onClick={() => {onEditObservations(index);}} style={{display: 'flex', width: '100%', flex: 1, fontWeight: 'bold'  }}>
                {typeMarkups[observation.markup.type]}
            </span>
            <div className="float-end d-flex justify-content-center align-items-center px-1" onClick={() => {onDeleteObservations(index);}}>
                <span ><i className="mdi mdi-close" /></span>
            </div>
        </Card.Header>
        <Card.Body  onClick={() => {observationsIndex === index || onEditObservations(index);}}>
            <Row>
            
            {isEditingIndex === index ? (
                <>
                    <Col md={12} >
                        <textarea style={{width: '100%', height: '80px'}} rows={4} value={observations ?? ''} onChange={(e) => {
                            console.log('editing',e.target.value)
                            setObservations(e.target.value)
                        }} placeholder="comentários"/>
                    </Col>

                    <Col md={12} className="d-flex justify-content-between align-items-center">
                    <Button variant="primary" onClick={() => {setFileUploadData(fileUploadDataTemp ?? []);setShowFileUpload(true);}}>Anexar Imagem</Button>
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="primary" onClick={() => {
                            setFileUploadDataTemp([]);
                            setShowModalObservations(false);
                            setMarkupActual(null)
                            setIsEditingIndex(null)
                        }}>
                            Sair
                        </Button>
                        <Button variant="primary" onClick={onSaveObservations}>
                            Salvar
                        </Button>
                    </div>
                    </Col>
                </>
            ):
                (<Col sm={9}>
                    {observation.observations}
                </Col> )
            }
            </Row>
        </Card.Body>
    </Card>
  )
}