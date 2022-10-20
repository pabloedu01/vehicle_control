// @flow
import React, { useEffect, useState, useRef } from 'react';
import {Button, Col, Modal, Row, Card, Nav} from "react-bootstrap";
import FileUpload from "../../components/FileUpload";
import classnames from 'classnames';
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import { CardObservation } from './CardObservation'
import { CardObservationInicial } from './CardObservationInicial'


const VisualInspection = (props: { item: any, onChange: any, value: any }): React$Element<React$FragmentType> => {
    const [showModal, setShowModal] = useState(false);
    const [showModalObservations, setShowModalObservations] = useState(false);
    const [currentStep, setCurrentStep]  = useState(1);
    const [data, setData] = useState({});
    const [observationsIndex, setObservationsIndex] = useState(null);
    const [observationsList, setObservationsList] = useState([]);
    const [observations, setObservations] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [fileUploadData, setFileUploadData] = useState([]);
    const [fileUploadDataTemp, setFileUploadDataTemp] = useState([]);
    const [markupActual, setMarkupActual] = useState(null)
    const [selectedCardMakup, setSelectedCardMakup] = useState(null)
    const [isEditingIndex, setIsEditingIndex] = useState(null)

    const constraintsRef = useRef(null); 

    const steps = {
        '1': 'Frente',
        '2': 'Lateral esquerda',
        '3': 'Lateral direita',
        '4': 'Traseira',
        '5': 'Teto',
    };

    const typeMarkups = {
        A: 'Amassado',
        R: 'Riscado',
        X: 'Quebrado',
        F: 'Faltante'
    }

    const onSave = () => {
        props?.onChange(JSON.stringify(data));
        setShowModal(false);
        setMarkupActual(null)
        setShowModalObservations(false);
        setIsEditingIndex(null)
    };

    const onSaveObservations = () => {
        const currentObservationsList = [...observationsList];
        let newObservationsList;
        
        const markupActualSave = {
            ...markupActual,
            active: false
        }
       
        if(observationsIndex === null || !currentObservationsList.hasOwnProperty(observationsIndex)){
            newObservationsList = currentObservationsList.concat([{
                observations,
                markup: {...markupActualSave},
                images: fileUploadDataTemp
            }]);
        } else {
            currentObservationsList[observationsIndex] = {...currentObservationsList[observationsIndex], observations, markup: {...markupActualSave}};
            newObservationsList = currentObservationsList;
        }
        setIsEditingIndex(null)
        setMarkupActual(null)
        setObservationsList(newObservationsList);
        setData({...data, [currentStep]: {...(data[currentStep] ?? {}), observations: [...newObservationsList]}});
        setShowModalObservations(false);
        setFileUploadDataTemp([]);

    };

    const onCreateObservations = (type) => {
        if (!isEditingIndex) {
            setObservationsIndex(null);
            setObservations(null);
            setShowModalObservations(true);
            createPositionDrag(type)
        }
    };

    const onEditObservations = (index) => {
        setObservationsIndex(index);
        setObservations(observationsList[index].observations);
        setIsEditingIndex(index)
        setMarkupActual({...observationsList[index].markup, active: true})
    };

    const onDeleteObservations = (index) => {
        const currentObservationsList = [...observationsList];
        currentObservationsList.splice(index, 1);
        setObservationsList(currentObservationsList);
        setMarkupActual(null)
    };

    const validateFileImage = (file) => {
        const isValid = file.type.indexOf('image') === 0;

        if(!isValid){
            return 'El archivo ' + file.name + ' no es una imagen.';
        } else {
            return true;
        }
    };

    const handleUploadImages = (files) => {
        setFileUploadData(files);

        if(observationsIndex !== null){
            const currentObservationsList = [...observationsList];
            currentObservationsList[observationsIndex].images = files;

            setObservationsList(currentObservationsList);
        } else {
            setFileUploadDataTemp(files);
        }
    };

    useEffect(() => {
        setCurrentStep(1);
    }, [showModal]);

    useEffect(() => {
        setObservationsList(data.hasOwnProperty(currentStep) && data[currentStep].hasOwnProperty('observations') ? data[currentStep].observations : []);
    }, [currentStep]);

    useEffect(() => {
        const data = props?.value && props?.value.length > 0 ? JSON.parse(props?.value) : {};
        setData(data);
        setObservationsList(data.hasOwnProperty(currentStep) && data[currentStep].hasOwnProperty('observations') ? data[currentStep].observations : []);
    }, [props?.value]);

    useEffect(() => {
        if(data.hasOwnProperty(currentStep)){
            setData({...data, [currentStep]: {...(data[currentStep] ?? {}), observations: [...observationsList]}});
        }
    }, [observationsList]);

    function updatePositionMarkup(positionTop, positionLeft) {
        setMarkupActual(prevState => {
            return {
                ...prevState,
                position: {
                    top: prevState.position.top + positionTop,
                    left: prevState.position.left + positionLeft
                },
            }
        })
    }

    function createPositionDrag(type) {
        
        const markup = {
            position: {
                top: 0,
                left: 0
            },
            type,
            active: true
        }
        setMarkupActual(markup)
    }

    function onMouseOverSelected(index) {
        setSelectedCardMakup(index)
    }

    return (
        <>
            <FileUpload show={showFileUpload} handleClose={() => { setShowFileUpload(false); }} files={fileUploadData} handleFileUpload={handleUploadImages} validateFile={validateFileImage}/>
            
            <Modal show={showModal} onHide={ () => { setShowModal(false); } } size="xl"  fullscreen="lg-down" scrollable={true} centered={true}>
                <Modal.Header style={{padding: 0}} >
                    <Row className="d-flex w-100 justify-content-center align-items-center w-100 m-0">
                        <Nav as="ul" variant="pills" className="nav nav-pills bg-nav-pills nav-justified w-100 p-0" defaultActiveKey="1">
                            {Object.keys(steps).map((key) => (
                                <Nav.Item as="li" className="nav-item"  key={steps[key] + key} onClick={() => {
                                    setCurrentStep(parseInt(key, 10));
                                    setMarkupActual(null);
                                    setShowModalObservations(false);
                                }}>
                                    <Nav.Link href="#" eventKey={`${key}`} className="nav-link rounded-0 d-flex justify-content-center align-items-center h-100 py-2">
                                    <span className="d-lg-block">{steps[key]}</span>
                                </Nav.Link>
                            </Nav.Item>
                            ))}
                        </Nav>
                    </Row>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '300px'}} >
                    <Row >
                        <Col md={2} className="d-flex justify-content-center align-items-center button-markups" >
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <Button variant="primary" id="kneadedButton" onClick={() => onCreateObservations('A')} style={{ borderRadius: '50%' }} >
                                A
                            </Button>
                            <label htmlFor="kneadedButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                                AMASSADO
                            </label>
                            
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center">     
                                <Button variant="primary" id="scratchedButton" onClick={() => onCreateObservations('R')} style={{ borderRadius: '50%' }} >
                                    R
                                </Button>
                                <label htmlFor="scratchedButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                                    RISCADO
                                </label>
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <Button variant="primary" id="brokeButton" onClick={() => onCreateObservations('X')} style={{ borderRadius: '50%' }} >
                                    X
                                </Button>
                                <label htmlFor="brokeButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                                QUEBRADO
                                </label>
                            
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <Button variant="primary" id="brokeButton" onClick={() => onCreateObservations('X')} style={{ borderRadius: '50%' }} >
                                    F
                                </Button>
                                <label htmlFor="brokeButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                                FALTANTE
                                </label>
                            
                            </div>
                    
                        
                        </Col>
                        <Col md={4} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column', width: '450px', height: '270px', position: 'relative'}}>
                            <motion.div ref={constraintsRef} className="d-flex justify-content-center align-items-center " style={{ flexFlow: 'column', width: '450px', height: '270px'}}>
                                {(props?.item?.validation?.images || []).hasOwnProperty(currentStep) ? <img src={props?.item?.validation?.images[currentStep]} className="overflow-hidden" style={{maxWidth: '100%'}}/> : 'No image available'}
                                {steps[currentStep]}
                            {observationsList.length > 0 && observationsList.map((m, index)=> (
                                <motion.div 
                                    key={m.markup.type + (Math.random() * (10000 - 1) + 1) } 
                                    style={{
                                    background: `${selectedCardMakup === index || isEditingIndex === index ? '#000' : '#198754'}`,
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                    position: "absolute",
                                    zIndex: 1000,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: '#fff',
                                    cursor: "pointer",
                                    fontWeight: "bold"}}
                                    dragConstraints={constraintsRef}
                                    initial={{ top: m.markup.position.top, left:m.markup.position.left }}
                                    onClick={() => {onEditObservations(index);}}
                                    onMouseOver={() => onMouseOverSelected(index)} 
                                    onMouseOut={() => onMouseOverSelected(null)}
                                    dragTransition={{ bounceStiffness: 100, bounceDamping: 10, min: 0, max: 4 }}
                                    drag 
                                    dragListener={m.markup.active}
                                    onDragEnd={
                                        (event, info) => {
                                            const positionTop = info.offset.y
                                            const positionLeft = info.offset.x
                                            updatePositionMarkup(positionTop, positionLeft)
                                        }
                                    }
                                    >
                                        {m.markup.type}
                                    </motion.div>
                                ))}
                                {markupActual && (
                                    <motion.div 
                                    className="pos"
                                    style={{ 
                                    background: "#fd7e14",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                    position: "absolute",
                                    zIndex: 1000,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    lineHeight: "16px",
                                    fontSize: "16px",
                                    fontWeight: "bold"}}
                                    dragConstraints={constraintsRef}
                                    initial={{ top: markupActual.position.top, left:markupActual.position.left }}
                                    dragTransition={{ bounceStiffness: 100, bounceDamping: 10, min: 0, max: 4 }}
                                    drag 
                
                                    onDragEnd={
                                        (event, info) => {
                                            const positionTop = info.offset.y
                                            const positionLeft = info.offset.x
                                            updatePositionMarkup(positionTop, positionLeft)
                                        }
                                    }
                                    >
                                        {markupActual.type}
                                    </motion.div>
                                )}
                            </motion.div>
                        </Col>
                        <Col md={6} className="observationsContainer" >

                            {showModalObservations && 
                                (
                                    <CardObservationInicial
                                        typeMarkups={typeMarkups}
                                        setObservations={setObservations}
                                        setFileUploadDataTemp={setFileUploadDataTemp}
                                        setShowModalObservations={setShowModalObservations}
                                        setMarkupActual={setMarkupActual}
                                        setFileUploadData={setFileUploadData}
                                        fileUploadDataTemp={fileUploadDataTemp}
                                        setShowFileUpload={setShowFileUpload}
                                        observations={observations}
                                        onSaveObservations={onSaveObservations}
                                        markupActual={markupActual}
                                />
                                )
                            }

                            { observationsList.length > 0  ?
                                <>
                                    {observationsList.map((observation, index) => (
                                        <CardObservation 
                                            index={index}
                                            key={index}
                                            selectedCardMakup={selectedCardMakup} 
                                            onMouseOverSelected={onMouseOverSelected}
                                            onEditObservations={onEditObservations} 
                                            typeMarkups={typeMarkups}
                                            observation={observation}
                                            observationsIndex={observationsIndex}
                                            setObservations={setObservations}
                                            isEditingIndex={isEditingIndex}
                                            setFileUploadDataTemp={setFileUploadDataTemp}
                                            setShowModalObservations={setShowModalObservations}
                                            setMarkupActual={setMarkupActual}
                                            setIsEditingIndex={setIsEditingIndex}
                                            setFileUploadData={setFileUploadData}
                                            fileUploadDataTemp={fileUploadDataTemp}
                                            setShowFileUpload={setShowFileUpload}
                                            observations={observations}
                                            onDeleteObservations={onDeleteObservations}
                                            onSaveObservations={onSaveObservations} />
                                    ))}
                                </>: null
                            }
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setShowModal(false);
                        setMarkupActual(null)
                        setShowModalObservations(false);
                        setIsEditingIndex(null)
                    }}>
                        Sair
                    </Button>
                    <Button variant="primary" onClick={onSave}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button type="button" onClick={() => {setShowModal(true);}} variant="primary">
                Inspeção
            </Button>
        </>
    );
};

export default VisualInspection;
