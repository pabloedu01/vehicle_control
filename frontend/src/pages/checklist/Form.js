// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row, Form, Alert} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import moment from 'moment';
import Select from 'react-select';
import FileUpload from "../../components/FileUpload";
import SignatureCanvas from 'react-signature-canvas';
import {dataURLtoFile, toDataURL} from "../../utils/file";
import swal from "sweetalert";

const api = new APICore();

const ChecklistForm = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id, type} = useParams();
    const [data, setData] = useState();
    const [checklistData, setChecklistData] = useState({});
    const [observationsData, setObservationsData] = useState({});
    const [evidences, setEvidences] = useState({});
    const [checklistVersion, setChecklistVersion] = useState(null);
    const [errors, setErrors] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [fileUploadData, setFileUploadData] = useState([]);
    const [fileUploadId, setFileUploadId] = useState(null);

    const [drawSignatures, setDrawSignatures] = useState(false);
    const [signaturesUpdated, setSignaturesUpdated] = useState(false);
    const [clientSignatureImage, setClientSignatureImage] = useState(null);
    const [technicalConsultantSignatureImage, setTechnicalConsultantSignatureImage] = useState(null);
    const [clientSignatureDate, setClientSignatureDate] = useState(null);
    const [technicalConsultantSignatureDate, setTechnicalConsultantSignatureDate] = useState(null);
    const [clientSignatureStarted, setClientSignatureStarted] = useState(false);
    const [technicalConsultantSignatureStarted, setTechnicalConsultantSignatureStarted] = useState(false);
    const [clientSignature, setClientSignature] = useState(null);
    const [technicalConsultantSignature, setTechnicalConsultantSignature] = useState(null);

    const onSubmit = () => {
        const formData = {
            "checklist_version_id": data.checklistVersion.id,
            "service_schedule_id": null,
            "vehicle_id": null,
            "technical_consultant_id": data.technicalConsultant.id,
            "brand_id": data.brand.id,
            "client_id": data.client.id,
            "client_name": data.client.name,
            "client_signature": clientSignatureImage,
            "client_signature_date": clientSignatureStarted ? moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (data.vehicleService?.client_signature_date ? moment(data.vehicleService?.client_signature_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (clientSignatureDate ? moment(clientSignatureDate).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : null)),
            "technical_consultant_signature": technicalConsultantSignatureImage,
            "technical_consultant_signature_date": technicalConsultantSignatureStarted ? moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (data.vehicleService?.technical_consultant_signature_date ? moment(data.vehicleService?.technical_consultant_signature_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (technicalConsultantSignatureDate ? moment(technicalConsultantSignatureDate).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : null)),
            "fuel": checklistData[(checklistVersion?.items || []).find((item) => item.code === 'fuel')?.id] ?? null,
            "mileage": checklistData[(checklistVersion?.items || []).find((item) => item.code === 'mileage')?.id] ?? null,
            "checklist": Object.keys(checklistData).map((id) => {
                return {
                    id,
                    value: checklistData[id] !== '' ? checklistData[id] : null,
                    observations: observationsData.hasOwnProperty(id) && observationsData[id] !== '' ? observationsData[id] : null,
                    evidence: evidences.hasOwnProperty(id) && evidences[id] !== null && evidences[id].length > 0 ? evidences[id].map((file) => typeof file === 'string' ? file : file?.id) : null,
                };
            })
        };

        switch(type){
            case 'service-schedules':
                formData.service_schedule_id = id;
                formData.vehicle_id = data.vehicle.id;
                break;
        }

        setErrors(null);

        let ajaxCall;

        if(data.vehicleService?.id){
            ajaxCall = api.update('/vehicle-service/' + data.vehicleService?.id,Object.assign(formData, {claims_service: []}));
        } else {
            ajaxCall = api.post('/vehicle-service',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then((response) => {
            api.post('/checklist-version/' + data.checklistVersion.id + '/generate-report', {type, id, utcOffset: moment().utcOffset()}).then(() => {
                setSignaturesUpdated(false);
                history(`/panel/company/${props.company?.id}/service-schedules/list`);
            }).catch(() => {
                swal({
                    title: 'Error',
                    text: 'Ocorreu um erro ao gerar o relatório.',
                    icon: 'error',
                    buttons: {
                        confirm: {
                            text: 'Ok',
                            value: 'confirm'
                        }
                    },
                    dangerMode: true,
                });
            });
        }, (error) => {
            setSignaturesUpdated(false);

            if(error.hasOwnProperty('response') && error.response?.status === 400 && error.response?.data.hasOwnProperty('errors')){
                const errors = [];

                Object.keys(error.response.data.errors).forEach((key) => {
                    error.response.data.errors[key].forEach((message) => {
                        if(typeof message === 'string'){
                            errors.push(message);
                        } else {
                            message.forEach((text) => {
                                errors.push(text);
                            });
                        }
                    });
                });

                setErrors(errors);
            }
        });
    };

    const uploadSignatures = () => {
        const files = [];

        if(technicalConsultantSignatureStarted){
            files.push(dataURLtoFile(technicalConsultantSignature.toDataURL('image/png'), 'technicalConsultantSignature.png'));
        }

        if(clientSignatureStarted){
            files.push(dataURLtoFile(clientSignature.toDataURL('image/png'), 'clientSignature.png'));
        }

        Promise.all(files.map((file) => new Promise((resolve, reject) => {
            api.uploadFile('/file-upload/image', {image: file}).then((response) => {
                if(response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('id')){
                    resolve(response.data.data);
                } else {
                    reject();
                }
            }, (error) => {
                reject();
            });
        }))).then((processedFiles) => {
            processedFiles.forEach((file) => {
                if(file.original_name === 'clientSignature.png'){
                    setClientSignatureImage(file.id);
                }

                if(file.original_name === 'technicalConsultantSignature.png'){
                    setTechnicalConsultantSignatureImage(file.id);
                }
            });

            setSignaturesUpdated(true);
        }).catch((error) => {
            swal({
                title: 'Error',
                text: 'Ocorreu um erro ao carregar as assinaturas.',
                icon: 'error',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
                dangerMode: true,
            });
        });
    };

    const getChecklistVersion = (checklistVersionId) => {
        api.get('/checklist-version/' + checklistVersionId + '/items').then((response) => {
            setChecklistVersion(response.data.data);
        },(error) => {
            setChecklistVersion(null);
        });
    };

    const getData = () => {
        if(id){
            let ajaxCall;

            switch(type){
                case 'service-schedules':
                    ajaxCall = api.get('/service-schedule/' + id);
                    break;
            }

            ajaxCall.then((response) => {
                switch(type){
                    case 'service-schedules':
                        const {checklist_version: checklistVersion,client_vehicle:{vehicle,vehicle: {model: {brand}}}, client, vehicle_service : vehicleService, technical_consultant: technicalConsultant} = response.data.data;

                        getChecklistVersion(checklistVersion.id);

                        setClientSignatureImage(vehicleService?.client_signature);
                        setTechnicalConsultantSignatureImage(vehicleService?.technical_consultant_signature);
                        setClientSignatureDate(vehicleService?.client_signature_date);
                        setTechnicalConsultantSignatureDate(vehicleService?.technical_consultant_signature_date);
                        setData({brand, client, vehicleService, checklistVersion, technicalConsultant, vehicle});
                        setDrawSignatures(true);
                        break;
                    default:
                        setData(response.data.data);
                        break;
                }
            },(error) => {
                setData(null);
            });
        } else {
            setData(null);
        }
    };

    const handleFieldChange = (id, value) => {
        setChecklistData({...checklistData, [id]: value});
    };

    const handleObservationsChange = (id, value) => {
        if(!checklistData.hasOwnProperty(id)){
            setChecklistData({...checklistData, [id]: null});
        }

        setObservationsData({...observationsData, [id]: value});
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
        if(!checklistData.hasOwnProperty(fileUploadId)){
            setChecklistData({...checklistData, [fileUploadId]: null});
        }

        setFileUploadData(files);
        setEvidences({...evidences, [fileUploadId]: files});
    };

    const handleClickUploadImage = (id) => {
        setFileUploadId(id);
        setFileUploadData(evidences[id] ?? []);
        setShowFileUpload(true);
    };

    const onEndTechnicalConsultantSignature = () => {
        setTechnicalConsultantSignatureStarted(true);
        setTechnicalConsultantSignatureDate(moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00'));
    };

    const onEndClientSignature = () => {
        setClientSignatureStarted(true);
        setClientSignatureDate(moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00'));
    };

    const signatureWidth = () => {
        let width = document.getElementById('signatures')?.offsetWidth || 1000;

        if(width > 800){
            width = (width/2)*0.7;
        } else {
            width = (width)*0.9;
        }

        return width;
    };

    useEffect(() => {
        const newChecklistData = {};

        if(Object.keys(checklistData).length > 0 || data?.vehicleService?.items){
            if(data.vehicleService?.items){
                const newObservationsData = {};
                const newEvidences = {};
                (data.vehicleService?.items || []).forEach((item) => {
                    if((checklistVersion?.items || []).find((checklistVersionItem) => checklistVersionItem.id === item.id)){
                        switch(item.validation.type){
                            case 'boolean':
                                newChecklistData[item.id] = Boolean(parseInt(item?.pivot.value, 0) ?? false);
                                break;
                            case 'list':
                                newChecklistData[item.id] = item?.pivot.value ?? (item.validation.hasOwnProperty('options') && item.validation.options.length > 0 ? item.validation.options[0] : null);
                                break;
                            default:
                                newChecklistData[item.id] = item?.pivot.value ?? '';
                                break;
                        }

                        if(item?.pivot.observations){
                            newObservationsData[item.id] = item?.pivot.observations;
                        }

                        if(item?.pivot.evidence){
                            newEvidences[item.id] = item?.pivot.evidence;
                        }
                    }
                });

                setObservationsData(newObservationsData);
                setEvidences(newEvidences);
            }
        }
        else{
            (checklistVersion?.items || []).forEach((item) => {
                switch(item.validation.type){
                    case 'boolean':
                        newChecklistData[item.id] = false;
                        break;
                    case 'list':
                        newChecklistData[item.id] = item.validation.hasOwnProperty('options') && item.validation.options.length > 0 ? item.validation.options[0] : null;
                        break;
                    default:
                        newChecklistData[item.id] = '';
                        break;
                }
            });
        }

        setChecklistData(newChecklistData);
    }, [checklistVersion, data]);

    useEffect(() => {
        getData();
    }, [id, type]);

    useEffect(() => {
        if(signaturesUpdated){
            onSubmit();
        }

        setClientSignatureStarted(false);
        setTechnicalConsultantSignatureStarted(false);
    }, [signaturesUpdated]);

    useEffect(() => {
        if(drawSignatures){
            if(data?.vehicleService && data?.vehicleService?.client_signature_base64){
                clientSignature.fromDataURL(data?.vehicleService && data?.vehicleService?.client_signature_base64);
                clientSignature.off();
            }

            if(data?.vehicleService && data?.vehicleService?.technical_consultant_signature_base64){
                technicalConsultantSignature.fromDataURL(data?.vehicleService?.technical_consultant_signature_base64);
                technicalConsultantSignature.off();
            }

            setDrawSignatures(false);
        }
    }, [data,drawSignatures]);

    return (
        <>
            <PageTitle
                breadCrumbItems={

                    type === 'service-schedules' ?
                        [
                            { label: 'Agenda de Serviços', path: '/service-schedules/list' },
                            { label: 'Editar', path: `/service-schedules/${id}/edit` },
                            { label: 'Checklist', active: true },
                        ]:
                    [{ label: 'Checklist', active: true },]
                }
                title={'Checklist ' + (checklistVersion?.name ?? '')}
                company={props.company}
            />

            {errors && (
                <Alert variant="danger" className="my-2" dismissible={true} onClose={() => {setErrors(null)}}>
                    <ul className="mb-0">
                        { errors.map((error, index) => <li key={index}>{error}</li>) }
                    </ul>
                </Alert>
            )}

            <FileUpload show={showFileUpload} handleClose={() => { setShowFileUpload(false); }} files={fileUploadData} handleFileUpload={handleUploadImages} validateFile={validateFileImage}/>

            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <form>
                                {(checklistVersion?.items || []).map((item) => (
                                    <div key={item.id}>
                                        <Row className={"mb-3 mt-3 align-items-center"}>
                                            <Col md={3}>
                                                <b>{item.name}</b>
                                            </Col>
                                            <Col md={2}>
                                                {item.validation.type === 'boolean' ? <Form.Check type="switch" checked={checklistData[item.id] ?? false} onChange={(e) => { handleFieldChange(item.id, e.target.checked); }} name="checklist_version_id"/> :
                                                    (item.validation.type === 'list' ?
                                                            <Select
                                                                className={"react-select"}
                                                                classNamePrefix="react-select"
                                                                options={(item.validation?.options ?? []).map((option) => {return {value: option, label: option};})}
                                                                value={(item.validation?.options ?? []).map((option) => {return {value: option, label: option};}).find((option) => option.value === checklistData[item.id]) || null}
                                                                onChange={(selectedOption) => {
                                                                    handleFieldChange(item.id, selectedOption.value);
                                                                }}
                                                            />

                                                    :
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={item.name}
                                                            onChange={(e) => {
                                                                handleFieldChange(item.id, e.target.value);
                                                            }}
                                                            value={checklistData[item.id] ?? ''}
                                                            autoComplete="off">
                                                        </Form.Control>
                                                    )
                                                }
                                            </Col>
                                            <Col md={1} className="d-flex justify-content-center">
                                                <i className={"mdi mdi-image-area" + (evidences[item.id] ? " text-success" : "")} style={{fontSize: '30px'}} onClick={(e) => { handleClickUploadImage(item.id) }}/>
                                            </Col>
                                            <Col md={1}>
                                                Observação
                                            </Col>
                                            <Col md={4}>
                                                <Form.Control
                                                    type="textarea"
                                                    placeholder="Observações"
                                                    onChange={(e) => {
                                                        handleObservationsChange(item.id, e.target.value);
                                                    }}
                                                    value={observationsData[item.id] ?? ''}
                                                    autoComplete="off">
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                        <hr/>
                                    </div>
                                ))}

                                <Row className="mb-5 mt-5" id="signatures">
                                    <Col md={6} className=" justify-content-center text-center" >
                                        <SignatureCanvas penColor='green'
                                                         ref={(ref) => { setClientSignature(ref); }}
                                                         onEnd={onEndClientSignature}
                                                         canvasProps={{width: signatureWidth(), height: 200, className: 'signatureCanvas'}} />
                                                         <br/>
                                        {clientSignatureDate ? moment(clientSignatureDate).format('DD/MM/YYYY H:mma') : ''}
                                        <br/><br/>

                                        <Row className="d-flex align-items-center mb-3 position-relative">
                                            <Button variant="success" className="w-auto position-absolute" style={{right: '3em'}} type="button" onClick={() => { clientSignature.on();clientSignature.clear(); }}><span className="mdi mdi-trash-can-outline"/></Button>

                                            <span className="w-auto" style={{margin: '0 auto'}}>Assinatura do cliente</span>
                                        </Row>
                                    </Col>
                                    <Col md={6} className=" justify-content-center text-center">
                                        <SignatureCanvas penColor='green'
                                                         ref={(ref) => { setTechnicalConsultantSignature(ref); }}
                                                         onEnd={onEndTechnicalConsultantSignature}
                                                         canvasProps={{width: signatureWidth(), height: 200, className: 'signatureCanvas'}} />
                                        <br/>
                                        <span>{technicalConsultantSignatureDate ? moment(technicalConsultantSignatureDate).format('DD/MM/YYYY H:mma') : ''}</span>
                                        <br/><br/>
                                        <Row className="d-flex align-items-center mb-3 position-relative">
                                            <Button variant="success" className="w-auto position-absolute" style={{right: '3em'}} type="button" onClick={() => { technicalConsultantSignature.on();technicalConsultantSignature.clear(); }}><span className="mdi mdi-trash-can-outline"/></Button>

                                            <span className="w-auto" style={{margin: '0 auto'}}>Assinatura do Consultor</span>
                                        </Row>
                                    </Col>
                                </Row>

                                <div className="mb-3 mb-0">
                                    <Button variant="primary" type="button" onClick={uploadSignatures}>
                                        Cadastro
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ChecklistForm;
