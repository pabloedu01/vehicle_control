// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Card, Col, Row, Badge, Carousel, Modal, ProgressBar} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {Link, useNavigate, useParams} from "react-router-dom";
import moment from "moment";

const api = new APICore();

const Preview = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id, type, checklistId} = useParams();
    const [data, setData] = useState(null);
    const [vehicleService, setVehicleService] = useState(null);
    const [stages, setStages] = useState([]);
    const [evidences, setEvidences] = useState([]);
    const [checklistData, setChecklistData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedEvidence, setSelectedEvidence] = useState(null);

    const getData = () => {
        if(id){
            let ajaxCall;

            switch(type){
                case 'service-schedules':
                    ajaxCall = api.get('/vehicle-service/' + checklistId);
                    break;
            }

            ajaxCall.then((response) => {
                switch(type){
                    case 'service-schedules':
                        let data;
                        const checklistData = {};

                        const {brand,client,vehicle, technical_consultant: technicalConsultant,checklist_version: checklistVersion, service_schedule: {client_vehicle: clientVehicle,...serviceSchedule}, ...vehicleService} = response.data.data;
                        data = {brand, client, technicalConsultant, vehicle, serviceSchedule, checklistVersion, clientVehicle};

                        vehicleService.items.forEach((checklistItem) => {
                            checklistData[checklistItem.id] = {
                                id: checklistItem.id,
                                value: checklistItem.pivot.value,
                                evidence: checklistItem.pivot.evidence,
                                observations: checklistItem.pivot.observations,
                                type: checklistItem.validation.type
                            };
                        });

                        const stages = vehicleService.stages.filter((stage) => stage.pivot.processed);
                        stages.forEach((stage, index) => {
                            stages[index].evidences = [].concat(...stage.items.map((checklistItem) => (checklistData[checklistItem.id]?.evidence || []).map((evidence) => {return {evidence, name: checklistItem.name, observations: checklistData[checklistItem.id].observations};})));
                        });

                        setEvidences([].concat(...stages.map((stage) => stage.evidences)));
                        setVehicleService(vehicleService);
                        setStages(stages);
                        setChecklistData(checklistData);
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

    const showImage = (evidence) => {
        setPreviewImage(evidence);
        setShowModal(true);
    };

    const handleImageChange = (e, selectedEvidence) => {
        e.preventDefault();
        setSelectedEvidence(selectedEvidence);
    };

    const onHideModal = () => {
        setPreviewImage(null);
        setShowModal(false);
    };

    /*si se cambia alguno de los parametros de id tipo o el vehicle service, se reinicializa todo*/
    useEffect(() => {
        if(evidences.length > 0){
            setSelectedEvidence(evidences[0]);
        }
    }, [evidences]);

    /*si se cambia alguno de los parametros de id tipo o el vehicle service, se reinicializa todo*/
    useEffect(() => {
        getData();
    }, [id, type, checklistId]);

    return (
        <>
            <Modal show={showModal} onHide={onHideModal} size="lg" scrollable={true} centered={true}>
                <Modal.Body className="p-0" style={{minHeight: '300px'}}>
                    <img
                        className="d-block w-100"
                        src={previewImage?.evidence}
                    />

                    <div className="carousel-caption">
                        <h3>{previewImage?.name}</h3>
                        <p>{previewImage?.observations}</p>
                    </div>
                </Modal.Body>
            </Modal>

            <PageTitle
                breadCrumbItems={[
                    { label: 'Checklist', path: `/${type}/${id}/checklist` },
                    { label: 'Visualización', path: `/${type}/${id}/checklist/${checklistId}`, active: true },
                ]}
                title={'Checklist'}
                company={props?.company}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="align-items-center">
                                {evidences.length > 0 ?
                                    <Col lg={5}>
                                        <Link to="#" className="text-center d-block mb-4">
                                            <img
                                                onClick={(e) => {
                                                    showImage(selectedEvidence);
                                                }}
                                                src={selectedEvidence?.evidence}
                                                className="img-fluid"
                                                style={{ width: '350px', height: '300px' }}
                                                alt={selectedEvidence?.name}
                                            />
                                        </Link>

                                        <div className="d-flex justify-content-center">
                                            {evidences.map((evidence) => (
                                                <Link
                                                    to="#"
                                                    onMouseOver={(e) => {
                                                        handleImageChange(e, evidence);
                                                    }}
                                                    onClick={(e) => {
                                                        handleImageChange(e, evidence);
                                                        showImage(evidence);
                                                    }}>
                                                    <img
                                                        src={evidence.evidence}
                                                        className="img-fluid img-thumbnail p-2"
                                                        style={{ width: '75px', height: '70px' }}
                                                        alt={evidence.name}
                                                    />
                                                </Link>
                                            ))
                                            }
                                        </div>
                                    </Col>
                                    : null
                                }

                                <Col lg={7}>
                                    <form className="ps-lg-4">
                                        <h2 className="mt-0">{data?.client?.name}</h2>
                                        <p className="mb-1"><b>Data da vistoria:</b> {moment(data?.serviceSchedule?.promised_date).format('DD/MM/YYYY H:mma')}</p>

                                        <div className="mt-4">
                                            <p style={{fontSize: '1.5rem'}}><b>Veículo</b>: {data?.vehicle?.name}</p>
                                        </div>

                                        <div className="mt-4">
                                            <p style={{fontSize: '1.5rem'}}><b>Cor</b>: {data?.clientVehicle?.color}</p>
                                        </div>

                                        <div className="mt-4">
                                            <p style={{fontSize: '1.5rem'}}><b>Consultor</b>: {data?.technicalConsultant?.name}</p>
                                        </div>

                                        <div className="mt-4">
                                            <p style={{fontSize: '1.5rem'}}><b>Placa</b>: {data?.clientVehicle?.plate}</p>
                                        </div>

                                        <div className="mt-4">
                                            <p style={{fontSize: '1.5rem'}}><b>Chassi</b>: {data?.clientVehicle?.chasis}</p>
                                        </div>

                                        <div className="mt-4">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <h6 className="font-14">Vistorias finalizadas:</h6>
                                                    <p className="text-sm lh-150">{(vehicleService?.stages || []).filter((stage) => stage.pivot.completed).length}/{(vehicleService?.stages || []).length}</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6 className="font-14">Número do checklist:</h6>
                                                    <p className="text-sm lh-150">{vehicleService?.id}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </Col>
                            </Row>
                            {stages.map((stage) => (
                              <Row>
                                  <div className="table-responsive mt-4">
                                      <table className="table table-bordered table-centered mb-0">
                                          <thead className="table-light">
                                          <tr>
                                              <th colSpan={4} className="text-center">{stage.name} {stage.pivot.completed ? '(Finalizado)' : null}</th>
                                          </tr>
                                          <tr>
                                              <th width="40%">Item</th>
                                              <th width="10%">Imagem ?</th>
                                              <th width="20%">Resposta</th>
                                              <th width="30%">Comentário</th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          {stage.items.map((checklistItem) => (
                                              <tr>
                                                  <td>{checklistItem.name}</td>
                                                  <td>{checklistData[checklistItem.id]?.evidence && checklistData[checklistItem.id]?.evidence.length > 0 ? 'Sim' : 'Nao'}</td>
                                                  <td>{checklistData[checklistItem.id]?.type === 'boolean' ? (checklistData[checklistItem.id]?.value ? <Badge className="bg-success-lighten text-success">Sim</Badge> : <Badge className="bg-danger-lighten text-danger">Nao</Badge>) : checklistData[checklistItem.id]?.value}</td>
                                                  <td>{checklistData[checklistItem.id]?.observations}</td>
                                              </tr>
                                          ))
                                          }
                                          </tbody>
                                      </table>
                                  </div>
                              </Row>
                            ))
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Preview;
