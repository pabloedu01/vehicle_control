import React, {  useEffect, useRef, useState } from 'react';
import {Button, Col, Row, Card} from "react-bootstrap";

export function CardObservation({
  index, 
  selectedCardMakup, 
  onMouseOverSelected, 
  onEditObservations,
  typeMarkups,
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
  
  useEffect(() => {
    if (index === isEditingIndex) {
      if (cardRef.current) {
        cardRef.current.scrollIntoView({ block: "end", behavior: "smooth" })
      }
  }
  }, [index,isEditingIndex])

  // if (index === isEditingIndex) {
  //   if (cardRef.current) {
  //     cardRef.current.scrollIntoView({ block: "end", behavior: "smooth" })
  //   }
  // }

  function close() {
    setFileUploadDataTemp([]);
    setShowModalObservations(false);
    setMarkupActual(null)
    setIsEditingIndex(null)
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
        <Card.Header className='d-flex justify-content-between align-items-center' style={{ background: `${  selectedCardMakup === index ? 'rgba(0, 0, 0, 0.1)' : 'none'}`}}>
            <span onClick={() => {onEditObservations(index);}} style={{display: 'flex', width: '100%', flex: 1, fontWeight: 'bold'  }}>
                {typeMarkups[observation.markup.type]}
            </span>
        <div className="float-end d-flex justify-content-center align-items-center px-1" onClick={() => {
          if (isEditingIndex === index) {
            close()
          } else {
            onEditObservations(index)
          }

        
        }}>
          <span ><i className={isEditingIndex === index ? "mdi mdi-close-box" : 'mdi mdi-square-edit-outline'}
          /></span>
            </div>
        </Card.Header>
        <Card.Body  onClick={() => {observationsIndex === index || onEditObservations(index);}}>
            <Row>
            
            {isEditingIndex === index ? (
                <>
                    <Col md={12} >
                        <textarea style={{width: '100%', height: '80px'}} rows={4} value={observations ?? ''} onChange={(e) => {
                            setObservations(e.target.value)
                        }} placeholder="comentários"/>
                    </Col>

                    <Col md={12} className="d-flex justify-content-between align-items-center">
                    <Button variant="primary" onClick={() => {setFileUploadData(fileUploadDataTemp ?? []);setShowFileUpload(true);}}><span ><i className="dripicons-cloud-upload"/></span></Button>
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="primary" onClick={() => {
                          onDeleteObservations(index)
                        }}>
                             <span ><i className="mdi mdi-delete"/></span>
                        </Button>
                        <Button variant="primary" onClick={onSaveObservations}>
                            <span ><i className="mdi mdi-content-save"/></span>
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