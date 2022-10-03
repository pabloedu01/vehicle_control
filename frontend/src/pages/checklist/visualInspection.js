// @flow
import React, { useEffect, useState } from 'react';
import { APICore } from '../../helpers/api/apiCore';
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import FileUpload from "../../components/FileUpload";

const api = new APICore();

const VisualInspection = (props: { item: any, onChange: any, value: any }): React$Element<React$FragmentType> => {
    const [showModal, setShowModal] = useState(false);
    const [showModalObservations, setShowModalObservations] = useState(false);
    const [currentStep, setCurrentStep]  = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [data, setData] = useState({});
    const [observations, setObservations] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [fileUploadData, setFileUploadData] = useState([]);

    const steps = {
        '1': 'Frente',
        '2': 'Traseira',
        '3': 'Step 3',
        '4': 'Step 4',
        '5': 'Step 5',
    };

    const onSave = () => {
        props?.onChange(JSON.stringify(data));
        setShowModal(false);
    };

    const onSaveObservations = () => {
        setData({...data, [currentStep]: {...(data[currentStep] ?? {}), observations: observations}});
        setShowModalObservations(false);
    };

    const onNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const onPrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePositionChange = (e) => {
        /*
        const test = {
            currentStep: {
                option:{
                    selectedOption: 'posicion',
                },
                images: [],
                observations: [],
            }
        };*/

        setData({...data, [currentStep]: {...(data[currentStep] ?? {}), option: { ...(data[currentStep]?.option ?? {}), [selectedOption]: e.target.value }}});
    };

    const validateFileImage = (file) => {
        const isValid = file.type.indexOf('image') === 0;

        if(!isValid){
            return 'El archivo ' + file.name + ' no es una imagen.';
        } else {
            return true;
        }
    };

    const getSelectedOptionValue = () => {
        try{
            return data[currentStep]?.option[selectedOption] ?? '';
        } catch(e){
            return '';
        }
    };

    const handleUploadImages = (files) => {
        setFileUploadData(files);
        setData({...data, [currentStep]: {...(data[currentStep] ?? {}), images: files.map((file) => typeof file === 'string' ? file : file?.id)}});
    };

    useEffect(() => {
        setCurrentStep(1);
    }, [showModal]);

    useEffect(() => {
        setSelectedOption(null);
    }, [currentStep, showModal]);

    useEffect(() => {
        setData(props?.value && props?.value.length > 0 ? JSON.parse(props?.value) : {});
    }, [props?.value]);

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
                            <textarea style={{width: '100%'}} rows={5} value={observations ?? ''} onChange={(e) => {setObservations(e.target.value);}}/>
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
                            {(props?.item?.validation?.options || []).map((option, index) => (
                                <div key={index} onClick={() => {setSelectedOption(index);}}>
                                    {option}
                                </div>
                            ))}
                        </Col>
                        <Col md={2} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column' }}>
                            <input value={getSelectedOptionValue()} type="text" placeholder="position" onChange={handlePositionChange} style={{maxWidth: '100%'}} disabled={selectedOption === null}/>
                            {selectedOption !== null ? props?.item?.validation?.options[selectedOption] : null}
                        </Col>
                        <Col md={5} className="d-flex justify-content-center align-items-center" style={{ flexFlow: 'column' }}>
                            {(props?.item?.validation?.images || []).hasOwnProperty(currentStep) ? <img src={props?.item?.validation?.images[currentStep]} style={{maxWidth: '100%'}}/> : 'No image available'}
                            {steps[currentStep]}
                        </Col>
                        <Col md={3} className="d-flex" style={{ flexFlow: 'column', justifyContent: 'space-between' }}>
                            <Button variant="primary" onClick={() => {setFileUploadData(data[currentStep]?.images ?? []);setShowFileUpload(true);}} size={'lg'}>
                                Foto
                            </Button>

                            <Button variant="primary" onClick={() => {console.log(data[currentStep]?.observations);setObservations(data[currentStep]?.observations ?? null);setShowModalObservations(true);}} size={'lg'}>
                                Comentarios
                            </Button>

                            <Button variant="primary" onClick={onNext} size={'lg'} disabled={ currentStep === Object.keys(steps).length }>
                                Avanzar
                            </Button>

                            <Button variant="primary" onClick={onPrevious} size={'lg'} disabled={ currentStep === 1 }>
                                Volver
                            </Button>
                        </Col>
                    </Row>
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
