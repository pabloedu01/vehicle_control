import React, {  useRef, useEffect } from 'react';
import {Button, Col, Row, Card} from "react-bootstrap";

export function CardObservationInicial({
  typeMarkups,
  setObservations,
  setFileUploadDataTemp,
  setShowModalObservations,
  setMarkupActual,
  setFileUploadData,
  fileUploadDataTemp,
  setShowFileUpload,
  observations,
  onSaveObservations,
  markupActual
}) {
  const createCardObservationRef = useRef(null)

    useEffect(() => { 
        if (createCardObservationRef.current) {
            createCardObservationRef.current.scrollIntoView({ block: "start", behavior: "smooth" })
        }
    }, [])
  

  return (
   <Card ref={createCardObservationRef} style={{border: '1px solid #000'}}>
        <Card.Header className='d-flex justify-content-between align-items-center'>
            <span style={{display: 'flex', width: '100%', flex: 1, fontWeight: 'bold'  }}>
                {typeMarkups[markupActual.type]}
            </span>
        </Card.Header>
        <Card.Body>
            <Row>
                <>
                    <Col md={12}>
                        <textarea style={{width: '100%', height: '80px'}} rows={4} value={observations ?? ''} onChange={(e) => {
                            setObservations(e.target.value);
                        }} placeholder="comentários"/>
                    </Col>

                    <Col md={12} className="d-flex justify-content-between align-items-center">
                    <Button variant="primary" onClick={() => {setFileUploadData(fileUploadDataTemp ?? []);setShowFileUpload(true);}}>Anexar Imagem</Button>
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="primary" onClick={() => {
                            setFileUploadDataTemp([]);
                            setShowModalObservations(false);
                            setMarkupActual(null)
                        }}>
                            Sair
                        </Button>
                        <Button variant="primary" onClick={onSaveObservations}>
                            Salvar
                        </Button>
                    </div>
                    </Col>
                </>
            </Row>
        </Card.Body>
    </Card>
  )
}