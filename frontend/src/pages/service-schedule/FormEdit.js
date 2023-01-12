// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row, Form, Modal} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {FormInput} from "../../components";
import moment from 'moment';
import MaskedInput from 'react-text-mask';
// import classNames from "classnames";
import PageTitle from "../../components/PageTitle";
import SearchModified from "../../components/SearchModify";
import {ContainerForModalWithSearchClients} from "../../components/ContainerForModalWithSearchClients";
import { getAllOptions } from "../../utils/selectOptionsForm";
import HyperDatepicker from "../../components/Datepicker"

import {formatDateTimezone} from "../../utils/formatDateTimezone"

import { useMediaQuery } from '../../hooks/useMediaQuery'

 
const api = new APICore();




const FormEdit = (props: { company?: any, clientVehicle?: any, client?: any, handleReturnToClientList?: any, handleReturnToClientVehicleList?: any, pushButton?: any }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [clientList, setClientList] = useState([]);
    const [selectedChangeClientData, setSelectedChangeClientData] = useState(null);
    const [vehicleList, setVehicleList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [showModalSearch, setShowModalSearch] = useState(false);
    const [technicalConsultantSearchList, setTechnicalConsultantSearchList] = useState([])
    const [checklistVersions, setChecklistVersions] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [querySearchModal,setQuerySearchModal ] = useState('')
    const [technicalConsultantSelectedSearch, setTechnicalConsultantSelectedSearch] = useState({
        label: '',
        value: '',
        userDetails: {
            firstname: '',
            lastname: '',
        }
    })
    const [technicalConsultants, setTechnicalConsultants] = useState([]);
       const getData = () => {

        const defaultData = {
            scheludesVisited: moment().format("yyyy-MM-DDThh:mm"),
        };

        new Promise((resolve) => {
            if(id){
                api.get('/service-schedule/' + id).then((response) => {
                    const {client_vehicle: clientVehicle, client_vehicle_id, code, promised_date, client_id, technical_consultant_id, client, technical_consultant: technicalConsultant, vehicle_service: vehicleService} = response.data.data;
                  //  console.log(response.data.data)
                    resolve({
                        client_vehicle_id,
                        code,
                        promised_date: promised_date,
                        client_id,
                        technical_consultant_id,
                        technicalConsultant,
                        client,
                        clientVehicle,
                        vehicleService
                    });

                
                }, (error) => {
                    resolve(defaultData);
                });
            }
            else{
                resolve(defaultData);
            }
        }).then((data) => {
            const storage = JSON.parse(localStorage.getItem('serviceSchedule'));
            if(storage){
                /*storage.promised_date = new Date(storage.promised_date);*/

                Object.assign(data, storage);
            }

            if(props?.client){
                Object.assign(data, {
                    client: props?.client,
                    client_id: props?.client?.id
                });
            }

            if(props?.clientVehicle){
                Object.assign(data, {
                    clientVehicle: props?.clientVehicle,
                    client_vehicle_id: props?.clientVehicle?.id
                });
            }

            setData(data);
        });
    };

    

    const getTechnicalConsultants = () => {
        api.get('/technical-consultant/active-technical-consultants?company_id='+props.company?.id).then((response) => {
            setTechnicalConsultants(getAllOptions(response.data.data, data?.technicalConsultant));
        }, (error) => {
            setTechnicalConsultants([]);
        });
    };

    function getClients() {
        api.get('/client?company_id='+props.company?.id).then((response) => {
            setClientList(response.data.data)
            console.log(response.data.data)
        })
        
    }
    
      /*
     * Hook Media Query
     */

    // const isPageFull = useMediaQuery('(min-width: 768px)')
    // console.log('isPageMobile', isPageFull)
    /*
     * form validation schema
     */
    // const schemaResolver = yupResolver(
    //     yup.object().shape({
    //         clientName: yup.string().nullable().required('Por favor, digite seu nome'),
    //         clientCpf: yup.string().nullable().required('Por favor, digite seu cpf')
    //     })
    // );

    /*
     * form methods
     */  

    const defaultValues = {
            scheludesVisited: moment().format("yyyy-MM-DDThh:mm"),
    }


    const methods = useForm({
        // resolver: schemaResolver,
        defaultValues
        //     scheludesVisited: moment().format("yyyy-MM-DDThh:mm"),
        //     scheludesCreated: moment().format("yyyy-MM-DDThh:mm"),
        // }
    });

    const {
        handleSubmit,
        register,
        control,
        watch,
        formState: {errors},
    } = methods;

    const otherProps = {
        register,
        errors,
        control
    };
    
    
      /*
     * useEffect 
     */

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('scheludesVisited', moment(data?.promised_date).format("yyyy-MM-DDThh:mm") ?? moment().format("yyyy-MM-DDThh:mm"));

        setTechnicalConsultantSelectedSearch({
            label: data?.technicalConsultant?.name ?? '',
            value: data?.technicalConsultant?.id ?? '',
            userDetails: {
                name: data?.technicalConsultant?.name ?? '',
                cod: data?.technicalConsultant?.id ?? ''
            }
        })
        // methods.setValue('clientCpf', moment(data?.promised_date).format('YYYY-MM-DDTHH:mm') ?? moment().format('YYYY-MM-DDTHH:mm'));
    }, [data]);
   
    useEffect(() => {
        getTechnicalConsultants()
    },[])

    useEffect(() => {
        if(showModalSearch) {
            getClients()
        }
        
    },[showModalSearch])
 
    const onSubmit = (formData) => {      
        console.log("enviou")
        console.log(formatDateTimezone(formData.scheludesVisited))
        const dataFormatted = {
            promised_date: formatDateTimezone(formData.scheludesVisited),
            technical_consultant_id: technicalConsultantSelectedSearch.value,
            client_id: data?.client.id,
            client_vehicle_id: data?.client_vehicle_id,
        }

        // console.log(dataFormatted)

        let ajaxCall;

        if(id){
            ajaxCall = api.update('/service-schedule/' + id, dataFormatted);
            console.log(ajaxCall)
        }
        else{
            return
            // ajaxCall = api.post('/service-schedule', Object.assign(dataFormatted, {
            //     company_id: props.company?.id,
            //     claims_service: []
            // }));
        }

    }

    function getChecklistVersions () {
        api.get('/checklist-version/active-checklist-versions').then((response) => {
            setChecklistVersions(getAllOptions(response.data.data));
        },(error) => {
            setChecklistVersions([])
        });
    };


    function onShowModal() {
        getChecklistVersions()
        setShowModal(true);
    }

    function onShowNewOrderModal() {
        // getServiceTypes();
        setShowNewOrderModal(true);
    }

    function onClickChecklist(e){
        e.preventDefault();

        history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
    }

    function onClickServiceType(id){
        //history(`/panel/company/${props.company?.id}/service-schedules/${id}/checklist`);
    }

 
    function onHideModal () {
        setShowModal(false)
    }

    function onHideNewOrderModal () {
        setShowNewOrderModal(false)
    }

    function onHideModalSearch () {
        setShowModalSearch(false)
    }

    function onCreate() {
        const type = 'service-schedules'
        setShowModal(false);
        history(`/panel/company/${props.company?.id}/${type}/${id}/checklist/create/${methods.getValues('checklist_version_id')}`);
    }

    function handleChangeClientData() {
      if(!selectedChangeClientData) {
        return
      }
      setData(prevState => ({
        ...prevState,
        client: selectedChangeClientData
      }))
    }
    console.log(selectedChangeClientData)
    // console.log(data)

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Agenda de Serviços', path: '/service-schedules/list' },
                    { label: 'Edição', path: '/service-schedules/id' + '/edit', active: true },
                ]}
                title={'Agenda de Serviços'}
                company={props?.company}
                />
            
            <Row>
                <Col xxl={7}>
                    <Card>
                        <Card.Body className="pt-4 px-4 pb-4">
                            <Row>
                                <Col className='d-flex align-items-center justify-content-between'>
                                    <h4 className="header-title" style={{color: '#727CF5'}}>Cliente</h4>
                                    <Button 
                                        className='btn-sm' 
                                        variant="primary" 
                                        onClick={() => setShowModalSearch(true)}
                                    >Editar</Button>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12}  className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Nome:{' '} </span><span className="fw-normal">{data?.client && data.client.name}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3 ">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">CPF:</span>
                                    <span className="fw-normal">{data?.client && data.client.document}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Telefone:</span>
                                    {data?.client && data.client.phone.map((item, index )=> <span key={item + index} className="fw-normal">{item}{' '}</span> )}
                                </Col>
                                </Row>
                                <Row className="mt-3">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Email:</span>
                                    {data?.client && data.client.email.map((item, index )=> <span key={item + index} className="fw-normal">{item}{' '}</span> )}
                                </Col>
                            </Row> 
                            <Row className="mt-3">
                            <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                <span className="me-2">Endereço:</span>
                                <span className="fw-normal">{data?.client && data.client.address}</span>
                            </Col>
                            </Row>                       
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body className="pt-4 px-4 pb-4">
                            <Col className='d-flex align-items-center justify-content-between'>
                                <h4 className="header-title" style={{color: '#727CF5'}}>VEÍCULO</h4>
                                <Button className='btn-sm' variant="primary">Editar</Button>
                            </Col>
                            <Row className="mt-3">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Marca:</span>
                                    <span className="fw-normal">{data?.clientVehicle && data?.clientVehicle.vehicle.model.brand.name}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                            <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                <span className="me-2">Modelo:</span>
                                <span className="fw-normal">{data?.clientVehicle && data?.clientVehicle.vehicle.model.name}</span>
                            </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Veículo:</span>
                                    <span className="fw-normal">{data?.clientVehicle && data?.clientVehicle.vehicle.name}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Cor:</span>
                                    <span className="fw-normal">{data?.clientVehicle && data?.clientVehicle.color}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                    <span className="me-2">Chassi:</span>
                                    <span className="fw-normal">{data?.clientVehicle && data?.clientVehicle.chasis}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3" >
                            <Col sm={12} md={12} className="d-flex align-items-center fw-bold">
                                <span className="me-2">Placa:</span>
                                <span className="fw-normal">{data?.clientVehicle && data?.clientVehicle.plate}</span>
                            </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                
                </Col>
                <Col xxl={5}>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <Row className='mb-3'>
                            <Col xs={12}>
                                <Button variant="primary" type="submit" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                                    Salvar
                                </Button>
                            </Col>
                        </Row>
                        <Card>
                        <Card.Body>
                                <h4 className="header-title mb-4" style={{color: '#727CF5'}}>agendamento</h4>
                                    <Row className="mt-3">
                                        <Row>
                                            <Col sm={12} md={12}>
                                                <p className="fw-bold">Número do atendimento: <span className="fw-normal">{ id}</span></p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={3} md={3} className="d-flex align-items-center">
                                                <span className="fw-bold">Data da visita:</span>
                                            </Col> 
                                            <Col sm={5} md={5} lg={6} xs={12}>
                                                <FormInput 
                                                    type="datetime-local"
                                                    id="scheludesVisited"
                                                    name="scheludesVisited"
                                                    // value={moment().format("yyyy-MM-DDThh:mm")}
                                                    // "2018-06-12T19:30"
                                                // value={selectedDate}
                                                    {...otherProps}
                                                    // onChange={e => {
                                                    //     // onDateChange(e.target.value)
                                                    //     console.log('moment -', moment().format("yyyy-MM-DDThh:mm"))
                                                    //     console.log('input -',e.target.value)
                                                    // }}
                                                />
                                            </Col> 
                                        </Row>
                                    </Row>
                                    
                                </Card.Body>
                            </Card>
                        <Card>
                            <Card.Body>
                            <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Consultor Técnico</h4>
                                <Row className="mt-3">
                                    <Col sm={12} md={12} xs={12}>
                                        <SearchModified
                                            handleTechnicalConsultantSelected={setTechnicalConsultantSelectedSearch}
                                            TechnicalConsultant={technicalConsultants}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col sm={12} md={12}>
                                        <p className="fw-bold">Nome: <span className="fw-normal">{ technicalConsultantSelectedSearch?.label && technicalConsultantSelectedSearch?.label}</span></p>
                                        <p className="fw-bold">Código consultor: <span className="fw-normal">{ technicalConsultantSelectedSearch?.value && technicalConsultantSelectedSearch?.value}</span></p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
               
                    </form>
                    <Row className="mt-3">
                        <Col sm={8} md={8} xs={7}>
                            <Button
                                variant="primary" type="button"
                                style={{ width: '100%', minWidth: '62px', fontSize: '20px' }}
                                onClick={onClickChecklist}
                            >
                                Listar checklists
                            </Button>
                        </Col>
                        <Col sm={4} md={4} xs={5}>
                            <Button  variant="primary" type="button" style={{width: '100%', minWidth: '62px', fontSize: '20px'}}  onClick={onShowModal}>
                            <i className='mdi mdi-clipboard-list-outline p-0' ></i> Novo
                            </Button>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col sm={8} md={8} xs={7}>
                            <Button
                                variant="primary"
                                type="button"
                                style={{ width: '100%', minWidth: '62px', fontSize: '20px' }}
                                onClick={() => {
                                        }}
                            >
                                Listar orçamentos
                            </Button>
                        </Col>
                        <Col sm={4} md={4} xs={5}>
                            <Button  variant="primary" onClick={onShowNewOrderModal} type="button" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                            <i className='mdi mdi-clipboard-list-outline p-0' ></i> Novo
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Modal show={showModal} onHide={onHideModal} size="lg" scrollable={true} centered={true}>
                <form onSubmit={handleSubmit(onCreate)} noValidate>
                    <Modal.Header onHide={onHideModal} closeButton>
                        <h4 className="modal-title">
                            Versão do checklist
                        </h4>
                    </Modal.Header>
                    <Modal.Body style={{minHeight: '300px'}}>
                        <FormInput
                            label="Versão do checklist"
                            type="select"
                            name="checklist_version_id"
                            containerClass={'mb-3'}
                            options={checklistVersions}
                            {...otherProps}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={onHideModal}>
                            Encerrar
                        </Button>{' '}
                        <Button variant="primary" type="submit">
                            Cadastro
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>


            <Modal show={showNewOrderModal} onHide={onHideNewOrderModal} size="lg" scrollable={true} centered={true}>
                <Modal.Header onHide={onHideNewOrderModal} closeButton>
                    <h4 className="modal-title">
                        Tipo de Servicio
                    </h4>
                </Modal.Header>
                <Modal.Body style={{minHeight: '300px'}}>
                    {serviceTypes.map((serviceType) => (
                        <Button variant="outline-secondary" onClick={() => {onClickServiceType(serviceType.id);}} key={serviceType.id} className="btn-block w-100 d-block mb-1">{serviceType.name}</Button>
                    ))
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={onHideNewOrderModal} >
                        Encerrar
                    </Button>{' '}
                </Modal.Footer>


            {/* modal search */}
            </Modal>
                <Modal show={showModalSearch} onHide={onHideModalSearch} size="md" centered={true}>
                <Modal.Header onHide={onHideModalSearch} closeButton>
                    <h4 className="modal-title">
                        Cliente
                    </h4>
                </Modal.Header>
                <Modal.Body style={{minHeight: '350px'}}>
                    <Row>
                        <Col>
                            <ContainerForModalWithSearchClients 
                                clients={clientList} 
                                setSelectedChangeClientData={setSelectedChangeClientData}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="light" 
                        onClick={ () => {
                            onHideModalSearch()
                            setSelectedChangeClientData(null)
                        }}
                        
                    >
                        Sair
                    </Button>{' '}
                    <Button 
                        variant="primary" 
                        onClick={() => {
                            handleChangeClientData()
                            onHideModalSearch()
                        }}
                        disabled={!selectedChangeClientData}
                    >
                        Alterar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FormEdit;
