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
import {dataURLtoFile} from "../../utils/file";
import swal from "sweetalert";
import {toastService} from "../../services/toast";
import './style.css';
 
const elemPrefix = "test";
const getId = (index: number) => `${elemPrefix}${index}`;

const getItems = () =>
  Array(20)
    .fill(0)
    .map((_, ind) => ({ id: getId(ind) }));



const api = new APICore();

const ChecklistForm = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id, type, checklistVersionId, checklistId, stageId} = useParams();
    const [data, setData] = useState();
    const [checklistData, setChecklistData] = useState({});
    const [observationsData, setObservationsData] = useState({});
    const [evidences, setEvidences] = useState({});
    const [vehicleService, setVehicleService] = useState(null);
    const [forceToMoveStage, setForceToMoveStage] = useState(null);
    const [checklistVersion, setChecklistVersion] = useState(null);
    const [stage, setStage] = useState(null);
    const [stages, setStages] = useState([]);
    const [vehicleServiceStage, setVehicleServiceStage] = useState(null);
    const [checklistItems, setChecklistItems] = useState([]);
    const [errors, setErrors] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [fileUploadData, setFileUploadData] = useState([]);
    const [fileUploadId, setFileUploadId] = useState(null);

    const [cleanClientSignature, setCleanClientSignature] = useState(false);
    const [cleanTechnicalConsultantSignature, setCleanTechnicalConsultantSignature] = useState(false);
    const [drawSignatures, setDrawSignatures] = useState(false);
    const [clientSignatureImage, setClientSignatureImage] = useState(null);
    const [technicalConsultantSignatureImage, setTechnicalConsultantSignatureImage] = useState(null);
    const [clientSignatureDate, setClientSignatureDate] = useState(null);
    const [technicalConsultantSignatureDate, setTechnicalConsultantSignatureDate] = useState(null);
    const [clientSignatureStarted, setClientSignatureStarted] = useState(false);
    const [technicalConsultantSignatureStarted, setTechnicalConsultantSignatureStarted] = useState(false);
    const [clientSignature, setClientSignature] = useState(null);
    const [technicalConsultantSignature, setTechnicalConsultantSignature] = useState(null);

  

    const getChecklistItemValue = (code) => {
        const item = checklistItems.find((item) => item.code === code);

        function getValue(type, value){
            return type !== 'boolean' ? (value !== '' ? value : null) : (value ?? false);
        }

        return item ? getValue(item.validation.type, checklistData[item.id]) : null;
    };

    const getFormattedChecklist = (id) => {
        const item = checklistItems.find((item) => item.id === parseInt(id, 10));

        return {
            id,
            value: getChecklistItemValue(item.code),
            observations: observationsData.hasOwnProperty(id) && observationsData[id] !== '' ? observationsData[id] : null,
            evidence: evidences.hasOwnProperty(id) && evidences[id] !== null && evidences[id].length > 0 ? evidences[id].map((file) => typeof file === 'string' ? file : file?.id) : null,
        }
    };

    const getChecklistVersion = (checklistVersionId) => {
        api.get('/checklist-version/' + checklistVersionId + '/details').then((response) => {
            setChecklistVersion(response.data.data);
            setData({...data, checklistVersion: response.data.data});
        },(error) => {
            setChecklistVersion(null);
            setData({...data, checklistVersion: null});
        });
    };

    const getData = () => {
        if(id){
            let ajaxCall;

            switch(type){
                case 'service-schedules':
                    if(checklistId){
                        ajaxCall = api.get('/vehicle-service/' + checklistId);
                    } else {
                        ajaxCall = api.get('/service-schedule/' + id);
                    }
                    break;
            }

            ajaxCall.then((response) => {
                switch(type){
                    case 'service-schedules':
                        let data;

                        if(checklistId){
                            const {brand,client,vehicle, technical_consultant: technicalConsultant, ...vehicleService} = response.data.data;
                            data = {brand, client, technicalConsultant, vehicle};

                            setVehicleService(vehicleService);
                        } else {
                            const {client_vehicle:{vehicle,vehicle: {model: {brand}}}, client , technical_consultant: technicalConsultant} = response.data.data;
                            data = {brand, client, technicalConsultant, vehicle};
                            setVehicleService(null);
                        }

                        setData(data);
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

    const onPreviousStage = () => {
        const currentStageIndex = stages.indexOf(stage);

        if(currentStageIndex > 0){
            moveToStage(stages[currentStageIndex - 1].id);
        } else {
            if(stages.length > 0){
                moveToStage(stages[0].id);
            }
        }
    };

    const onNextStage = () => {
        const currentStageIndex = stages.indexOf(stage);

        if(stages[currentStageIndex + 1]){
            moveToStage(stages[currentStageIndex + 1].id);
        } else {
            /*swal({
                title: 'Completado',
                text: 'Checklist Completado',
                icon: 'success',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
            });*/

            history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
        }
    };

    const moveToStage = (stageId, checkIfIsAvailable = false) => {
        if(stage?.id !== stageId){
            if(vehicleService){
                setCleanClientSignature(!cleanClientSignature);

                history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist/${vehicleService.id}/edit/${stageId}`, { replace: true });
            } else {
                setForceToMoveStage(stageId);
            }
        }
    };

    const onSubmit = (complete) => {
        const files = [];

        if(!vehicleServiceStage?.completed){
            if(technicalConsultantSignatureStarted){
                if(technicalConsultantSignature && !technicalConsultantSignature.isEmpty()){
                    files.push(dataURLtoFile(technicalConsultantSignature.toDataURL('image/png'), 'technicalConsultantSignature.png'));
                } else {
                    setTechnicalConsultantSignatureImage(null);
                }
            }

            if(clientSignatureStarted){
                if(clientSignature && !clientSignature.isEmpty()){
                    files.push(dataURLtoFile(clientSignature.toDataURL('image/png'), 'clientSignature.png'));
                } else {
                    setClientSignatureImage(null);
                }
            }
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
            let localClientSignatureImage = null, localTechnicalConsultantSignatureImage = null;

            processedFiles.forEach((file) => {
                if(file.original_name === 'clientSignature.png'){
                    setClientSignatureImage(file.id);
                    localClientSignatureImage = file.id;
                }

                if(file.original_name === 'technicalConsultantSignature.png'){
                    setTechnicalConsultantSignatureImage(file.id);
                    localTechnicalConsultantSignatureImage = file.id;
                }
            });

            (new Promise((resolve, reject) => {
                if(!vehicleServiceStage?.completed && stage?.items.length > 0){
                    const formData = {
                        "stage_id": stage.id,
                        "checklist_version_id": data.checklistVersion.id,
                        "service_schedule_id": null,
                        "technical_consultant_id": data.technicalConsultant.id,
                        "brand_id": data.brand.id,
                        "client_id": data.client.id,
                        "client_name": data.client.name,
                        "fuel": getChecklistItemValue('fuel'),
                        "mileage": getChecklistItemValue('mileage'),
                        "client_signature": localClientSignatureImage ?? clientSignatureImage,
                        "client_signature_date": clientSignatureStarted ? moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (vehicleService?.client_signature_date ? moment(vehicleService?.client_signature_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (clientSignatureDate ? moment(clientSignatureDate).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : null)),
                        "technical_consultant_signature": localTechnicalConsultantSignatureImage ?? technicalConsultantSignatureImage,
                        "technical_consultant_signature_date": technicalConsultantSignatureStarted ? moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (vehicleService?.technical_consultant_signature_date ? moment(vehicleService?.technical_consultant_signature_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : (technicalConsultantSignatureDate ? moment(technicalConsultantSignatureDate).utc().format('YYYY-MM-DDTHH:mm:00+00:00') : null)),
                        "checklist": stage.items.map((item) => getFormattedChecklist(item.id)),
                        "completed": complete || ((localClientSignatureImage ?? clientSignatureImage) !== null && (localTechnicalConsultantSignatureImage ?? technicalConsultantSignatureImage) !== null)
                    };

                    switch(type){
                        case 'service-schedules':
                            formData.service_schedule_id = id;
                            formData.vehicle_id = data.vehicle.id;
                            break;
                    }

                    setErrors(null);

                    let ajaxCall;

                    if(vehicleService?.id){
                        ajaxCall = api.update('/vehicle-service/' + vehicleService?.id, formData);
                    } else {
                        ajaxCall = api.post('/vehicle-service',Object.assign(formData,{company_id: props.company?.id}));
                    }

                    ajaxCall.then((response) => {
                        setVehicleService(response.data.data);

                        resolve();
                    }, (error) => {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            })).then(() => {
                history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
                /*onNextStage();*/
            }).catch((error) => {
                manageAjaxError(error);
            });
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

    const manageAjaxError = (error) => {
        if(error.hasOwnProperty('response') && error.response?.status === 400 && error.response?.data.hasOwnProperty('errors')){
            const errors = [];

            Object.keys(error.response.data.errors).forEach((key) => {
                error.response.data.errors[key].forEach((message) => {
                    if(typeof message === 'string'){
                        errors.push(message);
                    } else {
                        message.forEach((text) => {
                            toastService.show('error', text);
                            errors.push(text);
                        });
                    }
                });
            });

            setErrors(errors);
        }
    };

    /*se instancian todos los valores de los items*/
    useEffect(() => {
        const newChecklistData = {};

        if(Object.keys(checklistData).length > 0 || vehicleService?.items){
            if(vehicleService?.items){
                const newObservationsData = {};
                const newEvidences = {};

                checklistItems.concat(vehicleService?.items || []).forEach((item) => {
                    if((checklistItems).find((checklistVersionItem) => checklistVersionItem.id === item.id)){
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
            (checklistItems).forEach((item) => {
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

        setChecklistData({...checklistData,...newChecklistData});
    }, [checklistVersion, vehicleService, checklistItems]);

    /*si se cambia alguno de los parametros de id tipo o el vehicle service, se reinicializa todo*/
    useEffect(() => {
        setStage(null);
        setChecklistVersion(null);
        getData();
    }, [id, type, checklistId]);

    /*si cambia el stage, o se pide redibujar o se cambia la referencia del dibujo*/
    useEffect(() => {
        if(clientSignature && vehicleServiceStage && !clientSignatureStarted){
            if(vehicleServiceStage?.client_signature_base64){
                setTimeout(() => {
                    clientSignature.clear();
                    clientSignature.fromDataURL(vehicleServiceStage?.client_signature_base64, {width: signatureWidth(),height: 200,ratio: 1});
                    clientSignature.off();
                },100);
            } else {
                setCleanClientSignature(!cleanClientSignature);
            }
        }

        if(technicalConsultantSignature && vehicleServiceStage && !technicalConsultantSignatureStarted){
            if(vehicleServiceStage?.technical_consultant_signature_base64){
                setTimeout(() => {
                    technicalConsultantSignature.clear();
                    technicalConsultantSignature.fromDataURL(vehicleServiceStage?.technical_consultant_signature_base64, {width: signatureWidth(),height: 200,ratio: 1});
                    technicalConsultantSignature.off();
                },100);
            } else {
                setCleanTechnicalConsultantSignature(!cleanTechnicalConsultantSignature);
            }
        }
    }, [vehicleServiceStage,drawSignatures, technicalConsultantSignature, clientSignature]);

    /*al cambiar un stage ó el vehicle service, limpiar la firma*/
    useEffect(() => {
        if(stage && vehicleService){
            const vehicleServiceStage = vehicleService.stages.find((localStage) => localStage.id === stage.id);

            setClientSignatureImage(vehicleServiceStage?.pivot?.client_signature ?? null);
            setTechnicalConsultantSignatureImage(vehicleServiceStage?.pivot?.technical_consultant_signature ?? null);
            setClientSignatureDate(vehicleServiceStage?.pivot?.client_signature_date ?? null);
            setTechnicalConsultantSignatureDate(vehicleServiceStage?.pivot?.technical_consultant_signature_date ?? null);

            setVehicleServiceStage({
                id: vehicleServiceStage?.id ?? null,
                client_signature_base64: vehicleServiceStage?.pivot?.client_signature_base64 ?? null,
                technical_consultant_signature_base64: vehicleServiceStage?.pivot?.technical_consultant_signature_base64 ?? null,
                completed: vehicleServiceStage?.pivot?.completed ?? false
            });
        } else {
            setClientSignatureImage(null);
            setTechnicalConsultantSignatureImage(null);
            setClientSignatureDate(null);
            setTechnicalConsultantSignatureDate(null);
            setVehicleServiceStage(null);
        }

        setClientSignatureStarted(false);
        setTechnicalConsultantSignatureStarted(false);

    }, [stage, vehicleService]);

    /*setear stages*/
    useEffect(() => {
        if(vehicleService){
            setStages(vehicleService.stages);
        }
    }, [vehicleService]);

    /*setear stages*/
    useEffect(() => {
        if(checklistVersion && !vehicleService){
            setStages(checklistVersion.stages);
        }
    }, [checklistVersion]);

    /*setear checklistItems*/
    useEffect(() => {
        setChecklistItems([].concat(...stages.map((stage) => stage.items)));
    }, [stages]);

    /*forzar la limpieza de la firma*/
    useEffect(() => {
        setTimeout(() => {
            if(clientSignature){
                clientSignature.clear();
                clientSignature.on();
            }
        },100);
    }, [cleanClientSignature]);

    /*forzar la limpieza de la firma*/
    useEffect(() => {
        setTimeout(() => {
            if(technicalConsultantSignature){
                technicalConsultantSignature.clear();
                technicalConsultantSignature.on();
            }
        },100);
    }, [cleanTechnicalConsultantSignature]);

    /*al setear la data, si aún no existe el checklist version, que busque inicializarlo*/
    useEffect(() => {
        if(data && !checklistVersion){
            getChecklistVersion(vehicleService?.checklist_version_id ?? checklistVersionId);
        }
    }, [data]);

    /*si al momento de mover hacia un stage, no existe aún el vehicle service, se hace un pequeño forzado para repetir la acción y dejar que el vehicle service se setee*/
    useEffect(() => {
        if(forceToMoveStage){
            moveToStage(forceToMoveStage);
            setForceToMoveStage(null);
        }
    }, [forceToMoveStage]);

    /*setea el stage actual, el que está en la url, de lo contrario tomará el primero*/
    useEffect(() => {
        if(stages.length > 0){
            const firstStage = stages[0];
            const localStageId = parseInt(stageId ?? firstStage.id, 10);
            const currentStage = stages.find((stage) => stage.id === localStageId);

            setStage(currentStage ?? firstStage);
        }
    }, [stageId, stages]);

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
                company={props?.company}
            />

            {/*{errors && (
                <Alert variant="danger" className="my-2" dismissible={true} onClose={() => {setErrors(null)}}>
                    <ul className="mb-0">
                        { errors.map((error, index) => <li key={index}>{error}</li>) }
                    </ul>
                </Alert>
            )}*/}

            <FileUpload show={showFileUpload} handleClose={() => { setShowFileUpload(false); }} files={fileUploadData} handleFileUpload={handleUploadImages} validateFile={validateFileImage}/>

            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-around">
                    
                            <div className='scrollmenu'>
                                    {(stages).map((localStage) => (
                                        <div className="cursor-pointer" key={localStage.id} >
                                           <h3 className={ stage?.id === localStage.id ? 'text-primary' : '' } onClick={() => {vehicleService ? moveToStage(localStage.id, true) : setStage(localStage);}}>{localStage.name}</h3>
                                             </div>
                                         ))}
                    </div>
                        


                        
                            
                           
                        </Card.Header>
                        <Card.Body>
                            <form>
                                {(stage?.items || []).map((item) => (
                                    <div key={item.id}>
                                        <Row className={"mb-3 mt-3 align-items-center"}>
                                            <Col md={3}>
                                                <b>{item.name}</b>
                                            </Col>
                                            <Col className="text-center" md={2}>
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
                                    <Col md={6} className=" justify-content-center text-center">
                                        <SignatureCanvas penColor='green'
                                                         ref={(ref) => {
                                                             setClientSignature(ref);
                                                         }}
                                                         onEnd={onEndClientSignature}
                                                         canvasProps={{
                                                             width: signatureWidth(),
                                                             height: 200,
                                                             className: 'signatureCanvas'
                                                         }}/>
                                        <br/>
                                        {clientSignatureDate ? moment(clientSignatureDate).format('DD/MM/YYYY H:mma') : ''}
                                        <br/><br/>

                                        <Row className="d-flex align-items-center mb-3 position-relative">
                                            {!vehicleServiceStage?.completed ?
                                                <Button variant="success" className="w-auto position-absolute" style={{right: '3em'}} type="button" onClick={() => {
                                                    setClientSignatureStarted(false);
                                                    setClientSignatureDate(null);
                                                    setClientSignatureImage(null);
                                                    clientSignature.on();
                                                    clientSignature.clear();
                                                }}><span className="mdi mdi-trash-can-outline"/></Button>
                                                : null}
                                            <span className="w-auto" style={{margin: '0 auto'}}>Assinatura do cliente</span>
                                        </Row>
                                    </Col>
                                    <Col md={6} className=" justify-content-center text-center">
                                        <SignatureCanvas penColor='green'
                                                         ref={(ref) => {
                                                             const newRefFrom = ref && ref.isEmpty() && technicalConsultantSignature !== null ? 'technicalConsultantSignature' : (ref === null && technicalConsultantSignature !== null ? 'technicalConsultantSignature' : 'ref');
                                                             let newRef = ref && ref.isEmpty() && technicalConsultantSignature !== null ? technicalConsultantSignature : (ref === null && technicalConsultantSignature !== null ? technicalConsultantSignature : ref);

                                                             if(newRefFrom === 'technicalConsultantSignature' && ref){
                                                                 ref.fromDataURL(newRef.toDataURL('image/png'), {width: signatureWidth(),height: 200,ratio: 1});
                                                                 newRef = ref;
                                                             }

                                                             setTechnicalConsultantSignature(newRef);
                                                         }}
                                                         onEnd={onEndTechnicalConsultantSignature}
                                                         canvasProps={{
                                                             width: signatureWidth(),
                                                             height: 200,
                                                             className: 'signatureCanvas'
                                                         }}/>
                                        <br/>
                                        <span>{technicalConsultantSignatureDate ? moment(technicalConsultantSignatureDate).format('DD/MM/YYYY H:mma') : ''}</span>
                                        <br/><br/>
                                        <Row className="d-flex align-items-center mb-3 position-relative">
                                            {!vehicleServiceStage?.completed ?
                                                <Button variant="success" className="w-auto position-absolute" style={{right: '3em'}} type="button" onClick={() => {
                                                    setTechnicalConsultantSignatureStarted(false);
                                                    setTechnicalConsultantSignatureDate(null);
                                                    setTechnicalConsultantSignatureImage(null);
                                                    technicalConsultantSignature.on();
                                                    technicalConsultantSignature.clear();
                                                }}><span className="mdi mdi-trash-can-outline"/></Button>
                                                : null}
                                            <span className="w-auto" style={{margin: '0 auto'}}>Assinatura do Consultor</span>
                                        </Row>
                                    </Col>
                                </Row>

                                <ul className="list-inline wizard mb-0">
                                    {!vehicleServiceStage?.completed
                                        ?
                                        (<>
                                            <li className="next list-inline-item">
                                                <Button type="button" onClick={() => {onSubmit(false)}} variant="primary">
                                                    Salvar
                                                </Button>
                                            </li>

                                            <li className="next list-inline-item">
                                                <Button type="button" onClick={() => {onSubmit(true);}} variant="primary">
                                                    Finalizar
                                                </Button>
                                            </li>
                                        </>)
                                        :
                                        <li className="next list-inline-item">
                                            <Button type="button" onClick={() => {onNextStage();}} variant="primary">
                                                Next
                                            </Button>
                                        </li>
                                    }
                                </ul>

                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ChecklistForm;
