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
    const [position, setPosition] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [fileUploadData, setFileUploadData] = useState([]);
    const [fileUploadDataTemp, setFileUploadDataTemp] = useState([]);
    const [markupActual, setMarkupActual] = useState(null)
    const [markups, setMarkups] = useState([]);

    const constraintsRef = useRef(null); 

    const steps = {
        '1': 'Frente',
        '2': 'Lateral esquerda',
        '3': 'Lateral direita',
        '4': 'Traseira',
        '5': 'Teto',
    };

    const onSave = () => {
        props?.onChange(JSON.stringify(data));
        setShowModal(false);
    };

    const onSaveObservations = () => {
        const currentObservationsList = [...observationsList];
        let newObservationsList;

        if(observationsIndex === null || !currentObservationsList.hasOwnProperty(observationsIndex)){
            newObservationsList = currentObservationsList.concat([{
                observations,
                position,
                images: fileUploadDataTemp
            }]);

        } else {
            currentObservationsList[observationsIndex] = {...currentObservationsList[observationsIndex], observations, position};
            newObservationsList = currentObservationsList;
        }


        const markupActualSave = {
            ...markupActual,
            active: false
        }

        setMarkups(prevState => [...prevState, markupActualSave])
        setMarkupActual(null)
        setObservationsList(newObservationsList);
        setData({...data, [currentStep]: {...(data[currentStep] ?? {}), observations: [...newObservationsList]}});
        setShowModalObservations(false);
        setFileUploadDataTemp([]);

    };

    const onCreateObservations = (type) => {
        setObservationsIndex(null);
        setObservations(null);
        setPosition(null);
        setShowModalObservations(true);
        createPositionDrag(type)
    };

    const onEditObservations = (index) => {
        setObservationsIndex(index);
        setObservations(observationsList[index].observations);
        setPosition(observationsList[index].position);
        setShowModalObservations(true);
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
            console.log('actual', {
                top: prevState.position.top + positionTop,
                left: prevState.position.left + positionLeft
            })
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
            number: markups.length + 1,
            active: true
        }
        setMarkupActual(markup)
    }

    return (
        <>
            <FileUpload show={showFileUpload} handleClose={() => { setShowFileUpload(false); }} files={fileUploadData} handleFileUpload={handleUploadImages} validateFile={validateFileImage}/>
            
            <Modal show={showModal} onHide={ () => { setShowModal(false); } } size="xl" fullscreen="lg-down" scrollable={true} centered={true}>
                <Modal.Header >
                    <Row className="d-flex w-100 justify-content-center align-items-center">
                        {Object.keys(steps).map((key) => (
                            <Col key={key}>
                                <div  onClick={() => {setCurrentStep(parseInt(key, 10));}}>
                                    {steps[key]}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '300px' }}>
                    <Row className="">
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
                        <Col md={7} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column', width: '500px', height: '270px' }}>
                            <motion.div ref={constraintsRef} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column', width: '500px', height: '270px',position: 'relative',background: 'blue' }}>
                                {(props?.item?.validation?.images || []).hasOwnProperty(currentStep) ? <img src={props?.item?.validation?.images[currentStep]} className="overflow-hidden" style={{maxWidth: '100%'}}/> : 'No image available'}
                                {steps[currentStep]}
                            {markups.length > 0 && markups.map(m => (
                                <motion.div 
                                    key={m.number + (Math.random() * (10000 - 1) + 1) } 
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
                                    border: "2px solid #fff",
                                    fontWeight: "bold"}}
                                    dragConstraints={constraintsRef}
                                    initial={{ top: m.position.top, left:m.position.left }}
                        
                                    dragTransition={{ bounceStiffness: 100, bounceDamping: 10, min: 0, max: 4 }}
                                    drag 
                                    dragListener={m.active}
                                    onDragEnd={
                                        (event, info) => {
                                            console.log({ top: m.position.top, left:m.position.left })
                                            console.log("end", info.offset.x, info.offset.y)
                                            const positionTop = info.offset.y
                                            const positionLeft = info.offset.x
                                            updatePositionMarkup(positionTop, positionLeft)
                                        }
                                    }
                                    >
                                        {m.number + m.type}
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
                                    border: "2px solid #fff",
                                    fontWeight: "bold"}}
                                    dragConstraints={constraintsRef}
                                    initial={{ top: markupActual.position.top, left:markupActual.position.left }}
                                //    initial={{ left:224.54544067382812, top:127.27273559570312 }}
                        
                                    dragTransition={{ bounceStiffness: 100, bounceDamping: 10, min: 0, max: 4 }}
                                    drag 
                
                                    onDragEnd={
                                        (event, info) => {
                                            console.log("end", info.offset.x, info.offset.y)
                                            const positionTop = info.offset.y
                                            const positionLeft = info.offset.x
                                            updatePositionMarkup(positionTop, positionLeft)
                                        }
                                    }
                                    >
                                        {markupActual.number + markupActual.type}
                                    </motion.div>
                                )}
                            </motion.div>
                        </Col>
                        <Col md={4} className="d-flex" style={{ flexFlow: 'column', justifyContent: 'space-between', maxHeight: '270px', overflowY: 'auto' }}>

                            {showModalObservations ?

                                <Card>
                                    <Card.Body>
                                        <Row className="">
                                            <Col md={12}>
                                            <Card.Title>1 - Amassado</Card.Title>
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
                                        <Button variant="primary" onClick={() => {setFileUploadDataTemp([]);setShowModalObservations(false);}}>
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
                                        <Card key={index}>
                                            <Card.Header>
                                                Title

                                                <div className="float-end">
                                                    <span onClick={() => {onEditObservations(index);}}><i className="mdi mdi-square-edit-outline" /></span>
                                                    <span onClick={() => {onDeleteObservations(index);}}><i className="mdi mdi-trash-can-outline" /></span>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col sm={9}>
                                                        {observation.observations}
                                                    </Col>
                                                    <Col sm={3}>
                                                        <span onClick={() => {setObservationsIndex(index);setFileUploadData(observation?.images ?? []);setShowFileUpload(true);}}><i className="mdi mdi-image-area"/></span>
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
                    <Button variant="primary" onClick={() => {setShowModal(false);}}>
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
