// @flow
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import { Card, Col, Row, Badge, Modal, ListGroup} from 'react-bootstrap';
import { APICore } from '../../helpers/api/apiCore';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import "./style.css";

const api = new APICore();

const Preview = (props) => {
    const history = useNavigate();
  //  const { id, type, checklistId, token } = useParams();
    const [data, setData] = useState(null);
    
    const [companyInfo, setCompanyInfo] = useState(null)
  
    const [vehicleService, setVehicleService] = useState(null);
    const [stages, setStages] = useState([]);
    const [checklistData, setChecklistData] = useState({});
    const [showModalImagePreview, setShowModalImagePreview] = useState(false);
    const [showModalGallery, setShowModalGallery] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const { companyId, idQuotation } = useParams()

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            props.text
        </Tooltip>
    );
    const getData = () => {

        api.get('/company/'+companyId).then(
            (response) => {
                setCompanyInfo(response.data.data);
            },
            (error) => {
                setData(null);
            }
        );

        api.get('/quotations/show/'+idQuotation).then(
            (response) => {
                console.log(response.data.data);
                setData(response.data.data);                
            },
            (error) => {
                setData(null);
            }
        );
        
    };

    useEffect(() => {
        getData();
    }, [idQuotation]);

    const divStyle = {
        color: 'white',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.2)',
    };
    
    const [isMobile, setIsMobile] = useState(false)
 
    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 720) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }
    
    // create an event listener
    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })

    function checkMobile(value) {
        let val = limit(value,10)
        if (isMobile) {
            return val
        } else {
            return value
        }
    }
    function limit(text, count){
        return text.slice(0, count) + (text.length > count ? "..." : "");
    }

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg={12}>
                                    <Card style={{ width: '100%' }}>
                                        <Card.Header>
                                            <Row >
                                                <Col lg={4} sm={4} md={4} xs={4}>
                                                <div className='cabecalho'>
                                                        <div className='center'>
                                                            <img src={companyInfo?.image} style={{ height: '4rem' }} />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={8} sm={8} md={8} xs={8} >
                                                    <div className='cabecalho'>
                                                        <div className='center'>
                                                        <h2><b>{companyInfo?.name}</b></h2>
                                                        </div>
                                                    </div>
                                                        
                                                </Col>
                                              
                                            </Row>
                                        </Card.Header>
                                        
                                            <ListGroup variant="flush">
                                                <ListGroup.Item style={{ textAlign: 'center' }}>
                                                    <b>Informações da Empresa:</b>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <p>
                                                        <b>Razão social:</b> {companyInfo?.corporate_name}
                                                    </p>
                                                    <Row>
                                                        <Col lg={6}>
                                                            <p>
                                                                <b> Endereço:</b> {companyInfo?.address}
                                                            </p>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <p>
                                                                <b> CEP:</b> {companyInfo?.postal_code}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={6}>
                                                            <p>
                                                                <b> Telefone: </b>{companyInfo?.phone}
                                                            </p>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <p>
                                                                <b> Email::</b> {companyInfo?.email}
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
                                                    <b>Nome:</b>  {data?.client?.name}
                                                </p>
                                                <p>
                                                    <b> CPF:</b> {data?.client?.document}{' '}
                                                </p>
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Telefone: </b>
                                                           {data?.client?.phone &&
                                                           data?.client?.phone.map((phone)=> (
                                                           <p>{phone}</p> 
                                                           ))} 
                                                            
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                            <b> Email::</b> 
                                                            {data?.client?.email ??
                                                            data?.client?.email.map((email)=> (
                                                           <p>{email}</p> 
                                                           ))} 
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
                                                        <b>Veículo</b>: {data?.client_vehicle?.vehicle?.name}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Cor</b>: {data?.client_vehicle?.color}
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Placa</b>: {data?.client_vehicle?.plate}
                                                        </p>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <p>
                                                        <b>Chassi</b>: {data?.client_vehicle?.chasis}
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
                                                    <Col lg={4}>
                                                        <p>
                                                        <b>Consultor</b>: {data?.technicalConsultant?.name}
                                                        </p>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <p>
                                                        <b>Data da vistoria:</b>{' '}
                                                {moment(data?.serviceSchedule?.promised_date).format(
                                                    'DD/MM/YYYY H:mma'
                                                )}
                                                        </p>
                                                    </Col>
                                                    <Col lg={4}>
                                                    <p> <b>Checklist Nº </b>: {vehicleService?.id}</p>
                                                    </Col>
                                                    
                                                </Row>
                                               
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                    
                                </Col>
                            </Row>
                            {/*
                                {stages.map((stage) => (
                                    <Row key={stage.id}>
                                        <div className="table-responsive mt-4">
                                            <table className="table table-bordered table-centered mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th colSpan={4} className="text-center">
                                                            {stage.name} {stage.pivot.completed ? '(Finalizado)' : null}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th width="38%">Item</th>
                                                        <th width="12%">Imagem ?</th>
                                                        <th width="20%">Resposta</th>
                                                        <th width="30%">Comentário</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stage.items.map((checklistItem) =>
                                                        checklistData[checklistItem.id]?.type === 'visualInspection' ?
                                                            (<>
                                                                <tr key={checklistItem.id}>
                                                                    <td>{checklistItem.name}</td>
                                                                    <td>
                                                                        {checklistData[checklistItem.id]?.evidence &&
                                                                        checklistData[checklistItem.id]?.evidence.length > 0
                                                                            ? <Badge className="bg-success-lighten text-success" onClick={() => {setEvidences(checklistData[checklistItem.id]?.evidence);setShowModalGallery(true);}}>
                                                                                Sim
                                                                            </Badge>
                                                                            : <Badge className="bg-danger-lighten text-danger">
                                                                                Nao
                                                                            </Badge>}
                                                                    </td>
                                                                    <td/>
                                                                    {checklistData[checklistItem.id]?.observations ? (
                                                                            <OverlayTrigger
                                                                                placement="top"
                                                                                delay={{ show: 10, hide: 300 }}
                                                                                overlay={
                                                                                    <Tooltip id="button-tooltip">
                                                                                        {checklistData[checklistItem.id]?.observations}
                                                                                    </Tooltip>}
                                                                            >
                                                                                <p>{checkMobile(checklistData[checklistItem.id]?.observations)}</p>
                                                                            </OverlayTrigger>
                                                                            //    checklistData[checklistItem.id]?.observations
                                                                        )
                                                                        :null}
                                                                </tr>

                                                                {Object.keys(JSON.parse(checklistData[checklistItem.id]?.value)).map((step) =>
                                                                    JSON.parse(checklistData[checklistItem.id]?.value)[step].observations.map((observations, index) => (
                                                                        <tr key={'visualInspection-' + checklistItem.id + '-' + step}>
                                                                            <td>{checklistItem.name + ' - ' + steps[step] + ' (Comentário ' + (index + 1) + ')'}</td>
                                                                            <td>{observations?.images &&
                                                                            observations?.images.length > 0
                                                                                ? <Badge className="bg-success-lighten text-success" onClick={() => {setEvidences(observations?.images);setShowModalGallery(true);}}>
                                                                                    Sim
                                                                                </Badge>
                                                                                : <Badge className="bg-danger-lighten text-danger">
                                                                                    Nao
                                                                                </Badge>}</td>
                                                                            <td/>
                                                                            <td>{observations.observations}</td>
                                                                        </tr>
                                                                    ))
                                                                )}


                                                            </>)
                                                                :

                                                                <tr key={checklistItem.id}>
                                                                    <td>{checklistItem.name}</td>
                                                                    <td>
                                                                        {checklistData[checklistItem.id]?.evidence &&
                                                                        checklistData[checklistItem.id]?.evidence.length > 0
                                                                            ? <Badge className="bg-success-lighten text-success" onClick={() => {console.log(checklistData[checklistItem.id]?.evidence);setEvidences(checklistData[checklistItem.id]?.evidence);setShowModalGallery(true);}}>
                                                                                Sim
                                                                            </Badge>
                                                                            : <Badge className="bg-danger-lighten text-danger">
                                                                                Nao
                                                                            </Badge>}
                                                                    </td>
                                                                    <td>
                                                                        {checklistData[checklistItem.id]?.type === 'boolean' ? (
                                                                            parseInt(checklistData[checklistItem.id]?.value, 10) ? (
                                                                                <Badge className="bg-success-lighten text-success">
                                                                                    Sim
                                                                                </Badge>
                                                                            ) : (
                                                                                <Badge className="bg-danger-lighten text-danger">
                                                                                    Nao
                                                                                </Badge>
                                                                            )
                                                                        ) : (

                                                                            checklistData[checklistItem.id]?.type === 'signature' ?

                                                                                <img className="d-block w-100" src={checklistData[checklistItem.id]?.value && checklistData[checklistItem.id]?.value.length > 0 ? JSON.parse(checklistData[checklistItem.id]?.value)?.signatureImage : ''} />

                                                                            :
                                                                            checklistData[checklistItem.id]?.value
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {checklistData[checklistItem.id]?.observations ? (
                                                                                <OverlayTrigger
                                                                                    placement="top"
                                                                                    delay={{ show: 10, hide: 300 }}
                                                                                    overlay={
                                                                                        <Tooltip id="button-tooltip">
                                                                                            {checklistData[checklistItem.id]?.observations}
                                                                                        </Tooltip>}
                                                                                >
                                                                                    <p>{checkMobile(checklistData[checklistItem.id]?.observations)}</p>
                                                                                </OverlayTrigger>
                                                                                //    checklistData[checklistItem.id]?.observations
                                                                            )
                                                                            :null}

                                                                    </td>
                                                                </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Row>
                                ))
                            */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Preview;
