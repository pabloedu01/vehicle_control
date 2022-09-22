// @flow
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import { Card, Col, Row, Badge, Carousel, Modal, ProgressBar, ListGroup } from 'react-bootstrap';
import { APICore } from '../../helpers/api/apiCore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Divider } from '@mui/material';

const api = new APICore();

const Preview = (props: { company?: any }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const { id, type, checklistId } = useParams();
    const [data, setData] = useState(null);
    const [vehicleService, setVehicleService] = useState(null);
    const [stages, setStages] = useState([]);
    const [evidences, setEvidences] = useState([]);
    const [checklistData, setChecklistData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedEvidence, setSelectedEvidence] = useState(null);

    const getData = () => {
        if (id) {
            let ajaxCall;

            switch (type) {
                case 'service-schedules':
                    ajaxCall = api.get('/vehicle-service/' + checklistId);
                    break;
            }

            ajaxCall.then(
                (response) => {
                    switch (type) {
                        case 'service-schedules':
                            let data;
                            const checklistData = {};

                            console.table(response.data.data);
                            const {
                                brand,
                                client,
                                vehicle,
                                technical_consultant: technicalConsultant,
                                checklist_version: checklistVersion,
                                service_schedule: { client_vehicle: clientVehicle, ...serviceSchedule },
                                ...vehicleService
                            } = response.data.data;
                            data = {
                                brand,
                                client,
                                technicalConsultant,
                                vehicle,
                                serviceSchedule,
                                checklistVersion,
                                clientVehicle,
                            };

                            vehicleService.items.forEach((checklistItem) => {
                                checklistData[checklistItem.id] = {
                                    id: checklistItem.id,
                                    value: checklistItem.pivot.value,
                                    evidence: checklistItem.pivot.evidence,
                                    observations: checklistItem.pivot.observations,
                                    type: checklistItem.validation.type,
                                };
                            });

                            const stages = vehicleService.stages.filter((stage) => stage.pivot.processed);
                            stages.forEach((stage, index) => {
                                stages[index].evidences = [].concat(
                                    ...stage.items.map((checklistItem) =>
                                        (checklistData[checklistItem.id]?.evidence || []).map((evidence) => {
                                            return {
                                                evidence,
                                                name: checklistItem.name,
                                                observations: checklistData[checklistItem.id].observations,
                                            };
                                        })
                                    )
                                );
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
                },
                (error) => {
                    setData(null);
                }
            );
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
        if (evidences.length > 0) {
            setSelectedEvidence(evidences[0]);
        }
    }, [evidences]);

    /*si se cambia alguno de los parametros de id tipo o el vehicle service, se reinicializa todo*/
    useEffect(() => {
        getData();
    }, [id, type, checklistId]);

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    const divStyle = {
        color: 'white',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.2)',
    };
    return (
        <>
            <Modal show={showModal} onHide={onHideModal} size="lg" scrollable={true} centered={true}>
                <Modal.Body className="p-0" style={{ minHeight: '300px' }}>
                    <img className="d-block w-100" src={previewImage?.evidence} />

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
                            <Row>
                                {evidences.length > 0 ? (
                                    <Col lg={6}>
                                        {/* <Link to="#" className="text-center d-block mb-4">
                                            <img
                                                onClick={(e) => {
                                                    showImage(selectedEvidence);
                                                }}
                                                src={selectedEvidence?.evidence}
                                                className="img-fluid"
                                                style={{ width: '350px', height: '300px' }}
                                                alt={selectedEvidence?.name}
                                            />
                                        </Link> */}

                                        <div className="d-flex justify-content-center">
                                            <Carousel activeIndex={index} indicators={false} onSelect={handleSelect}>
                                                {evidences.map((evidence) => (
                                                    <Carousel.Item>
                                                        <img
                                                            className="d-block w-100"
                                                            src={evidence.evidence}
                                                            alt={evidence.name}
                                                        />
                                                        <Carousel.Caption>
                                                            <h3 style={divStyle}>{evidence?.name}</h3>
                                                            <p style={divStyle}>{evidence?.observations}</p>
                                                        </Carousel.Caption>
                                                    </Carousel.Item>

                                                    //     to="#"
                                                    //     onMouseOver={(e) => {
                                                    //         handleImageChange(e, evidence);
                                                    //     }}
                                                    //     onClick={(e) => {
                                                    //         handleImageChange(e, evidence);
                                                    //         showImage(evidence);
                                                    //     }}>
                                                    //     <img
                                                    //         src={evidence.evidence}
                                                    //         className="img-fluid img-thumbnail p-2"
                                                    //         style={{ width: '75px', height: '70px' }}
                                                    //         alt={evidence.name}
                                                    //     />
                                                    // </Link>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </Col>
                                ) : null}

                                <Col lg={6}>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Header>
                                            <Row>
                                                <Col lg={4} sm={4} md={4} xs={3} style={{borderRight:'1px solid #D3D3D3'}}>
                                                    <img src={props?.company?.image} style={{ height: '3rem' }} />
                                                </Col>
                                                <Col lg={5} sm={5} md={5} xs={5} style={{borderRight:'1px solid #D3D3D3'}}>
                                                    <h1>{props?.company?.name}</h1>
                                                </Col>
                                                <Col lg={3} sm={3} md={3} xs={4}>
                                                    <h6 className="font-14">Checklist:</h6>
                                                    <p className="text-sm lh-150">Nº#{vehicleService?.id}</p>
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item style={{ textAlign: 'center' }}>
                                                <b>Informações da Empresa:</b>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <p>
                                                    <b>Razão social:</b> TUNAP DO BRASIL LTDA.
                                                </p>
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Endereço:</b> RUA LALALA....{' '}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> CEP:</b> 000.000.000-87{' '}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Telefone: </b>+55(11)333333333{' '}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Email::</b> tunap@tunap.com{' '}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            
                                            

                                        </ListGroup>
                                    </Card>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            <b>Informações do Cliente:</b>
                                        </Card.Header>

                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <p>
                                                    <b>Nome:</b> Pablo Eduardo
                                                </p>
                                                <p>
                                                    <b> CPF:</b> 000.000.000-00{' '}
                                                </p>
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Telefone: </b>+55(11)333333333{' '}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Email::</b> tunap@tunap.com{' '}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            <b>Informações do Veiculo:</b>
                                        </Card.Header>

                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                 
                                                
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Veículo</b>: {data?.vehicle?.name}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Cor</b>: {data?.clientVehicle?.color}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Placa</b>: {data?.clientVehicle?.plate}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Chassi</b>: {data?.clientVehicle?.chasis}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            <b>Informações da Vistoria:</b>
                                        </Card.Header>

                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                  
                                                
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Consultor</b>: {data?.technicalConsultant?.name}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Data da vistoria:</b>{' '}
                                                {moment(data?.serviceSchedule?.promised_date).format(
                                                    'DD/MM/YYYY H:mma'
                                                )}
                                                        </p>
                                                    </Col>
                                                </Row>
                                               
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                    
                                </Col>

                                {/* <Col lg={2}>
                                    <img src={props?.company?.image} alt="Company Logo" className="img-responsive" />
                                </Col> */}
                            </Row>

                            {stages.map((stage) => (
                                <Row>
                                    <div className="table-responsive mt-4">
                                        <table className="table table-bordered table-centered mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th colSpan={4} className="text-center">
                                                        {stage.name} {stage.pivot.completed ? '(Finalizado)' : null}
                                                    </th>
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
                                                        <td>
                                                            {checklistData[checklistItem.id]?.evidence &&
                                                            checklistData[checklistItem.id]?.evidence.length > 0
                                                                ? 'Sim'
                                                                : 'Nao'}
                                                        </td>
                                                        <td>
                                                            {checklistData[checklistItem.id]?.type === 'boolean' ? (
                                                                checklistData[checklistItem.id]?.value ? (
                                                                    <Badge className="bg-success-lighten text-success">
                                                                        Sim
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-danger-lighten text-danger">
                                                                        Nao
                                                                    </Badge>
                                                                )
                                                            ) : (
                                                                checklistData[checklistItem.id]?.value
                                                            )}
                                                        </td>
                                                        <td>{checklistData[checklistItem.id]?.observations}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Row>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Preview;
