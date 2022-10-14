// @flow
import React, { useEffect, useState, useRef } from 'react';
import {Button, Col, Modal, Row, Card} from "react-bootstrap";
import FileUpload from "../../components/FileUpload";
import {AnimatePresence, motion} from "framer-motion/dist/framer-motion";


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
    };

    const onSaveObservations = () => {
        const currentObservationsList = [...observationsList];
        let newObservationsList;
        
        const markupActualSave = {
            ...markupActual,
            active: false
        }
        console.log(markupActualSave);

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

        setMarkupActual(null)
        setObservationsList(newObservationsList);
        setData({...data, [currentStep]: {...(data[currentStep] ?? {}), observations: [...newObservationsList]}});
        setShowModalObservations(false);
        setFileUploadDataTemp([]);

    };

    const onCreateObservations = (type) => {
        setObservationsIndex(null);
        setObservations(null);
        setShowModalObservations(true);
        createPositionDrag(type)
    };

    const onEditObservations = (index) => {
        setObservationsIndex(index);
        setObservations(observationsList[index].observations);
        setShowModalObservations(true);
        setMarkupActual({...observationsList[index].markup, active: true})
    };

    const onDeleteObservations = (index) => {
        const currentObservationsList = [...observationsList];

        currentObservationsList.splice(index, 1);
        setObservationsList(currentObservationsList);
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

    return (
        <>
            <FileUpload show={showFileUpload} handleClose={() => { setShowFileUpload(false); }} files={fileUploadData} handleFileUpload={handleUploadImages} validateFile={validateFileImage}/>
            
            <Modal show={showModal} onHide={ () => { setShowModal(false); } } size="xl"  fullscreen="lg-down" scrollable={true} centered={true}>
                <Modal.Header >
                    <Row className="d-flex w-100 justify-content-center align-items-center">
                        {Object.keys(steps).map((key) => (
                            <Col key={key} className="d-flex justify-content-center align-items-center">
                                <div  onClick={() => {
                                    setCurrentStep(parseInt(key, 10));
                                    setMarkupActual(null)
                                    setShowModalObservations(false);
                                }}>
                                    {steps[key]}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '300px' }} >
                    <Row >
                        <Col md={2} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column' }}>
                        <Button variant="primary" id="kneadedButton" onClick={() => onCreateObservations('A')} style={{ borderRadius: '50%' }} >
                            A
                        </Button>
                        <label htmlFor="kneadedButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                            AMASSADO
                        </label>
                        <Button variant="primary" id="scratchedButton" onClick={() => onCreateObservations('R')} style={{ borderRadius: '50%' }} >
                            R
                        </Button>
                        <label htmlFor="scratchedButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                            RISCADO
                        </label>
                        <Button variant="primary" id="brokeButton" onClick={() => onCreateObservations('X')} style={{ borderRadius: '50%' }} >
                            X
                        </Button>
                        <label htmlFor="brokeButton" className="d-flex flex-column justify-content-center align-items-center mb-1">
                            QUEBRADO
                        </label>
                        <Button variant="primary" id="missingButton" onClick={() => onCreateObservations('F')} style={{ borderRadius: '50%' }} >
                            F
                        </Button>
                        <label htmlFor="missingButton" className="d-flex flex-column justify-content-center align-items-center ">
                            FALTANTE
                        </label>
                        
                        </Col>
                        <Col md={4} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column', width: '450px', height: '270px'}}>
                            <motion.div ref={constraintsRef} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column', width: '450px', height: '270px',position: 'relative'}}>
                                {(props?.item?.validation?.images || []).hasOwnProperty(currentStep) ? <img src={props?.item?.validation?.images[currentStep]} className="overflow-hidden" style={{maxWidth: '100%'}}/> : 'No image available'}
                                {steps[currentStep]}
                            {observationsList.length > 0 && observationsList.map((m, index)=> (
                                <motion.div 
                                    key={m.markup.type + (Math.random() * (10000 - 1) + 1) } 
                                    style={{ background: "#198754",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                    position: "absolute",
                                    zIndex: 1000,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontWeight: "bold"}}
                                    dragConstraints={constraintsRef}
                                    initial={{ top: m.markup.position.top, left:m.markup.position.left }}
                                    onClick={() => {onEditObservations(index);}}
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
                                    style={{ background: "#fd7e14",
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
                                //    initial={{ left:224.54544067382812, top:127.27273559570312 }}
                        
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
                        <Col md={6} className="d-flex" style={{ flexFlow: 'column', flex: 1 ,maxHeight: '270px', overflowY: 'auto' }}>

                            {showModalObservations ?

                                <Card>
                                    <Card.Body>
                                        <Row className="" >
                                            <Col md={12}>
                                            <Card.Title>{typeMarkups[markupActual.type]}</Card.Title>
                                            </Col>
                                            <Col md={12}>
                                                <textarea style={{width: '100%'}} rows={4} value={observations ?? ''} onChange={(e) => {setObservations(e.target.value);}} placeholder="comentarios"/>
                                            </Col>

                                            <Col md={12} className="d-flex justify-content-center align-items-center">
                                                <Button variant="primary" onClick={() => {setFileUploadData(fileUploadDataTemp ?? []);setShowFileUpload(true);}}>Anexar Imagem</Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-center align-items-center gap-2">
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
                                    </Card.Footer>
                                </Card>

                                : null}

                            { observationsList.length > 0 ?
                                <>
                                    <h3>Observações</h3>

                                    {observationsList.map((observation, index) => (
                                        <Card key={index} style={{border: '1px solid #000'}} >
                                            <Card.Header>
                                                <span onClick={() => {onEditObservations(index);}}>
                                                    {typeMarkups[observation.markup.type]}
                                                </span>
                                                <div className="float-end">
                                                    <span onClick={() => {onDeleteObservations(index);}}><i className="mdi mdi-close" /></span>
                                                </div>
                                            </Card.Header>
                                            <Card.Body onClick={() => {onEditObservations(index);}}>
                                                <Row>
                                                    <Col sm={9}>
                                                        {observation.observations}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
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
