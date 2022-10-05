// @flow
import React, { useEffect, useState } from 'react';
import {Button, Col, Modal, Row} from "react-bootstrap";
import FileUpload from "../../components/FileUpload";

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

    const steps = {
        '1': 'Frente',
        '2': 'Lateral esquerda',
        '3': 'Lateral direita',
        '4': 'Traseira',
        '5': 'Teto',
    };

    const onSave = () => {
        /*al guardar hay que setear bien los ids de las imagenes*/
        /*currentObservationsList[observationsIndex].images = files.map((file) => typeof file === 'string' ? file : file?.id);*/

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
                images: []
            }]);

        } else {
            currentObservationsList[observationsIndex] = {...currentObservationsList[observationsIndex], observations, position};
            newObservationsList = currentObservationsList;
        }

        setObservationsList(newObservationsList);
        setShowModalObservations(false);
    };

    const onCreateObservations = () => {
        setObservationsIndex(null);
        setObservations(null);
        setPosition(null);
        setShowModalObservations(true);
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

        const currentObservationsList = [...observationsList];
        currentObservationsList[observationsIndex].images = files;

        setObservationsList(currentObservationsList);
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

    return (
        <>
            <FileUpload show={showFileUpload} handleClose={() => { setShowFileUpload(false); }} files={fileUploadData} handleFileUpload={handleUploadImages} validateFile={validateFileImage}/>

            <Modal show={showModalObservations} onHide={ () => { setShowModalObservations(false); } } size="lg" scrollable={true} centered={true}>
                <Modal.Header closeButton>
                    <h4 className="modal-title">Comentarios</h4>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '300px' }}>
                    <Row className="mb-1">
                        <Col md={12}>
                            <textarea style={{width: '100%'}} rows={5} value={observations ?? ''} onChange={(e) => {setObservations(e.target.value);}} placeholder="comentarios"/>
                        </Col>

                        <Col md={2}>
                            <input value={position ?? ''} onChange={(e) => {setPosition(e.target.value);}} placeholder="posición"/>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {setShowModalObservations(false);}}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={onSaveObservations}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showModal} onHide={ () => { setShowModal(false); } } size="lg" scrollable={true} centered={true}>
                <Modal.Header closeButton>
                    <h4 className="modal-title">Inspeção visual</h4>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '300px' }}>
                    <Row className="mb-1">
                        <Col md={2} className="d-flex" style={{ flexFlow: 'column', justifyContent: 'space-between' }}>
                            {Object.keys(steps).map((key) => (
                                <div key={key} onClick={() => {setCurrentStep(parseInt(key, 10));}}>
                                    {steps[key]}
                                </div>
                            ))}
                        </Col>
                        <Col md={2} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column' }}>
                            <span><i className="mdi mdi-image-area"/></span>
                            imagen que se genera automaticamente
                        </Col>
                        <Col md={5} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column' }}>
                            {(props?.item?.validation?.images || []).hasOwnProperty(currentStep) ? <img src={props?.item?.validation?.images[currentStep]} style={{maxWidth: '100%'}}/> : 'No image available'}
                            {steps[currentStep]}
                        </Col>
                        <Col md={3} className="d-flex" style={{ flexFlow: 'column', justifyContent: 'space-between' }}>
                            <Button variant="primary" onClick={onCreateObservations} size={'lg'}>
                                <i className="mdi mdi-plus-circle"/> Comentarios
                            </Button>
                        </Col>
                    </Row>
                    { observationsList.length > 0 ?
                        <Row className="mb-1 mt-5">
                            <h3>Observaciones</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>Comentario</th>
                                    <th>Posición</th>
                                    <th>Imagenes</th>
                                    <th>Opciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {observationsList.map((observation, index) => (
                                    <tr key={index}>
                                        <td>{observation.observations}</td>
                                        <td>{observation.position}</td>
                                        <td><span onClick={() => {setObservationsIndex(index);setFileUploadData(observation?.images ?? []);setShowFileUpload(true);}}><i className="mdi mdi-image-area"/></span></td>
                                        <td>
                                            <span onClick={() => {onEditObservations(index);}}><i className="mdi mdi-square-edit-outline" /></span>
                                            <span onClick={() => {onDeleteObservations(index);}}><i className="mdi mdi-trash-can-outline" /></span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </Row>: null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {setShowModal(false);}}>
                        Cerrar
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
