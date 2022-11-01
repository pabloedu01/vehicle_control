// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row, Form} from "react-bootstrap";
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
import { getAllOptions } from "../../utils/selectOptionsForm";
import HyperDatepicker from "../../components/Datepicker"

import { useMediaQuery } from '../../hooks/useMediaQuery'

 
const api = new APICore();




const FormEdit = (props: { company?: any, clientVehicle?: any, client?: any, handleReturnToClientList?: any, handleReturnToClientVehicleList?: any, pushButton?: any }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [phoneList, setPhoneList] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [technicalConsultantSelectedSearch, setTechnicalConsultantSelectedSearch] = useState({
        label: '',
        value: '',
        userDetails: {
            firstname: '',
            lastname: '',
        }
    })
    // const [technicalConsultants, setTechnicalConsultants] = useState([]);
    // const [clientInfo, setClientInfo] = useState();
    // const [clientVehicleInfo, setClientVehicleInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment().format("yyyy-MM-DDThh:mm"));
    const onDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    console.log(data)

       const getData = () => {
        // const defaultData = {
        //     client_vehicle_id: null,
        //     code: null,
        //     promised_date: moment().format('YYYY-MM-DDTHH:mm'),
        //     client_id: null,
        //     technical_consultant_id: null,
        // };
           
        const defaultData = {
            clientName: '',
            clientCpf: '',
            clientPhone:  '',
            clientEmail: '',
            clientAddress: '',

            vehicleBrand:'',
            vehicleMode: '',
            vehicleVehicle: '',
            vehicleChassi: '',
            vehicleBoard: '',

            scheludesVisited: moment().format("yyyy-MM-DDThh:mm"),
            scheludesCreated: moment().format("yyyy-MM-DDThh:mm"),
        };

        new Promise((resolve) => {
            if(id){
                api.get('/service-schedule/' + id).then((response) => {
                    const {client_vehicle: clientVehicle, client_vehicle_id, code, promised_date, client_id, technical_consultant_id, client, technical_consultant: technicalConsultant, vehicle_service: vehicleService} = response.data.data;
                    //console.log(response.data.data)
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

    

    // const getTechnicalConsultants = () => {
    //     api.get('/technical-consultant/active-technical-consultants', {company_id: props.company?.id}).then((response) => {
    //         setTechnicalConsultants(getAllOptions(response.data.data, data?.technicalConsultant));
    //     }, (error) => {
    //         setTechnicalConsultants([]);
    //     });
    // };


    
      /*
     * Hook Media Query
     */

    // const isPageFull = useMediaQuery('(min-width: 768px)')
    // console.log('isPageMobile', isPageFull)
    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            clientName: yup.string().nullable().required('Por favor, digite seu nome'),
            clientCpf: yup.string().nullable().required('Por favor, digite seu cpf')
        })
    );

    /*
     * form methods
     */

    const generateDefaultValuesPhone = () => {
        const newObject = {}
        if (phoneList.length > 0) {
            phoneList.forEach((item, index) => {
                newObject[`clientPhone${index + 1}`] = ''  
            }) 
        }
        return newObject
    }

    const generateDefaultValuesEmail = () => {
        const newObject = {}
        if (data?.client.email.length > 0) {
            data.client.phone.forEach((item, index) => {
                newObject[`clientEmail${index + 1}`] = ''  
            }) 
        }
        return newObject
    }


    const defaultValuesPhoneCreated = generateDefaultValuesPhone()
    const defaultValuesEmailCreated = generateDefaultValuesEmail()
  

    const defaultValues = {
            ...defaultValuesPhoneCreated,
            ...defaultValuesEmailCreated,
            clientName: '' ,
            clientCpf: '',
            clientAddress:  '',
    

            vehicleBrand:'',
            vehicleMode: '',
            vehicleVehicle: '',
            vehicleChassi: '',
            vehicleBoard: '',

            scheludesVisited: moment().format("yyyy-MM-DDThh:mm"),
            scheludesCreated: moment().format("yyyy-MM-DDThh:mm"),
    }


    const methods = useForm({
        resolver: schemaResolver,
        defaultValues
        // defaultValues: {
        //     ...defaultValuesPhoneCreated,
        //     ...defaultValuesEmailCreated,
        //     clientName: '' ,
        //     clientCpf: '',
        //     clientAddress:  '',
    

        //     vehicleBrand:'',
        //     vehicleMode: '',
        //     vehicleVehicle: '',
        //     vehicleChassi: '',
        //     vehicleBoard: '',

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
    
   
    console.log( watch('clientPhone3'))
    
      /*
     * useEffect 
     */

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('clientName', data?.client.name ?? null);
        methods.setValue('clientCpf', data?.client.document ?? null);
        if (data?.client.phone.length > 0) {
            setPhoneList(prevState => {
                console.log('state phone', data?.client.phone)
                return [...data?.client.phone] 
            })
            data.client.phone.forEach((item, index) => {
                const phoneFormatted = item.split('+55')[1]
                methods.setValue(`clientPhone${index + 1}`,  phoneFormatted ?? null);  
            }) 
        }
  
        if (data?.client.email.length > 0) {
            setEmailList(prevState => {
                return [...data?.client.email] 
            })
            data.client.email.forEach((item, index) => {
                methods.setValue(`clientEmail${index + 1}`,  item ?? null);  
            }) 
        }
        methods.setValue('clientAddress', data?.client.address ?? null);
        
        
        methods.setValue('vehicleBrand', data?.clientVehicle.name ?? null);
        methods.setValue('client_id', data?.client_id ?? null);
        
        // methods.setValue('clientCpf', moment(data?.promised_date).format('YYYY-MM-DDTHH:mm') ?? moment().format('YYYY-MM-DDTHH:mm'));
    }, [data]);

    // useEffect(() => {
    //     if (data?.client.phone) {
    //         setEmailList(data?.client.phone)
    //     }
    //     if (data?.client.email) {
    //         setEmailList(data?.client.email)
    //     }
    // }, [data?.client.phone, data?.client.email,phoneList,emailList ]);
   
    const onSubmit = (formData) => {      
        console.log("enviou")
        console.log(formData)
        console.log(formData.clientCpf.length)
    }

    function getRandomNumber(min = 1, max = 100000) {
        return Math.random() * (max - min) + min;
    }

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
                    <form onSubmit={handleSubmit(onSubmit)} id="form-client-vehicle" >
                    <Card>
                        <Card.Body className="pt-4 px-4 pb-4">
                            <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Cliente</h4>
                            <Row className="mt-3">
                                <Col sm={2} md={2}  className="d-flex align-items-center">
                                    <span>Nome:</span>
                                </Col>
                                <Col sm={10} md={10}>
                                    <FormInput
                                        type="text"
                                        name="clientName"
                                        key="clientName"
                                        {...otherProps}
                                        placeholder="Dígite seu nome"
                                     />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={2} md={2} className="d-flex align-items-center">
                                    <span>CPF:</span>
                                </Col>
                                    <Col sm={10} md={10}>
                                        <Controller
                                            name="clientCpf"
                                            control={control}
                                            {...otherProps}
                                            render={({ field }) => 
                                            <MaskedInput
                                            mask={[
                                                /[1-9]/,
                                                /\d/,
                                                /\d/,
                                                '\.',
                                                /\d/,
                                                /\d/,
                                                /\d/,
                                                '\.',
                                                /\d/,
                                                /\d/,
                                                /\d/,
                                                '-',
                                                /\d/,
                                                /\d/,
                                            
                                            ]}
                                            placeholder="999.999.999-99"
                                            className="form-control"
                                            key="clientCpf"
                                            { ...field }
                                                />
                                            }
                                        />
                                      
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={2} md={2} className="d-flex align-items-center">
                                    <span>Telefone:</span>
                                </Col>
                                <Col sm={10} md={10} >
                                    {phoneList.length > 0 && phoneList.map((item, index) => {
                                        return (
                                            <Row key={item + index + getRandomNumber()}>
                                                <Col lg={10} md={10} sm={10} xs={9} className={`${index > 0 ? 'mt-2': ''}`} key={item + index + getRandomNumber()}>
                                                    <Controller
                                                        name={`clientPhone${index + 1}`}
                                                        control={control}
                                                        {...otherProps}
                                                        render={({ field }) => 
                                                        <MaskedInput
                                                        mask={[
                                                                '(',
                                                                /[1-9]/,
                                                                /\d/,
                                                                ')',
                                                                ' ',
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                '-',
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                /\d/,
                                                                ]}
                                                                {...field}
                                                                placeholder="(__) _____-____"
                                                                className="form-control"
                                                                key="clientPhone"
                                                            />
                                                        }
                                                    />
                                                </Col>
                                                {index === 0 ?
                                                    (<Col lg={2} md={2} sm={2} xs={3}>
                                                    <Button className="btn-icon btn btn-light w-100"
                                                        onClick={() => {
                                                            setPhoneList(prevState => [...prevState, ''])
                                                        }}
                                                    key={index + getRandomNumber()}
                                                    >
                                                            <i className="mdi mdi-phone-plus-outline"></i>
                                                        </Button>
                                                    </Col>) : 
                                                   (<Col lg={2} md={2} sm={2} xs={3}>
                                                        <Button className="btn-icon btn btn-light w-100"
                                                            onClick={() => {
                                                                setPhoneList(prevState => [...prevState, ''])
                                                            }}
                                                        key={index + getRandomNumber()}
                                                        >
                                                            <i className="mdi mdi-trash-can-outline"></i>
                                                        </Button>
                                                    </Col>)
                                                }
                                                </Row>
                                            )
                                                    
                                            })}
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={2} md={2} className="d-flex align-items-center">
                                    <span>Email:</span>
                                </Col>
                                <Col sm={10} md={10} >
                                    <Row >
                                        <Col lg={10} md={10} sm={10} xs={9}>
                                            <FormInput
                                                type="text"
                                                name="clientEmail1"
                                                key="clientEmail"
                                                {...otherProps}
                                                placeholder="Dígite seu email"
                                            />
                                        </Col>
                                        <Col lg={2} md={2} sm={2} xs={3}>
                                            <Button  className="btn-icon btn btn-light w-100" >
                                                <i className="mdi mdi-email-plus-outline"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={2} md={2} className="d-flex align-items-center">
                                    <span>Endereço:</span>
                                </Col>
                                <Col sm={10} md={10} >
                                    <Row >
                                        <Col lg={10} md={10} sm={10} xs={9}>
                                            <FormInput
                                                type="text"
                                                name="clientAddress"
                                                key="clientAddress"
                                                {...otherProps}
                                                placeholder="Dígite seu endereço"
                                            />
                                        </Col>
                                        <Col lg={2} md={2} sm={2} xs={3}>
                                            <Button  className="btn-icon btn btn-light w-100" >
                                                <i className="mdi mdi-home-plus-outline"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>                       
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body className="pt-4 px-4 pb-4">
                            <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Veículo</h4>
                            <Row className="mt-3">
                                <Col lg={2} className="d-flex align-items-center">
                                    <span>Marca:</span>
                                </Col>
                                <Col lg={10}>
                                    <FormInput
                                        type="text"
                                        name="vehicleBrand"
                                        key="vehicleBrand"
                                        {...otherProps}
                                        placeholder="Dígite a marca"
                                     />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col lg={2} className="d-flex align-items-center">
                                    <span>Modelo:</span>
                                </Col>
                                <Col lg={10}>
                                    <FormInput
                                        type="text"
                                        name="vehicleModel"
                                        key="vehicleModel"
                                        {...otherProps}
                                        placeholder="Dígite o modelo"
                                     />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col lg={2} className="d-flex align-items-center">
                                    <span>Veículo :</span>
                                </Col>
                                <Col lg={10}>
                                    <FormInput
                                        type="text"
                                        name="vehicleVehicle"
                                        key="vehicleVehicle"
                                        {...otherProps}
                                        placeholder="Dígite o veículo"
                                     />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col lg={2} className="d-flex align-items-center">
                                    <span>Chassi:</span>
                                </Col>
                                <Col lg={10}>
                                    <FormInput
                                        type="text"
                                        name="vehicleChassi"
                                        key="vehicleChassi"
                                        {...otherProps}
                                        placeholder="Dígite o chassi"
                                     />
                                </Col>
                            </Row>
                            <Row className="mt-3" >
                                <Col lg={2} className="d-flex align-items-center">
                                    <span>Placa:</span>
                                </Col>
                                <Col lg={10}>
                                    <FormInput
                                        type="text"
                                        name="vehicleBoard"
                                        key="vehicleBoard"
                                        {...otherProps}
                                        placeholder="Dígite a placa"
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </form>
                </Col>
                <Col xxl={5}>
                    <Row className='mb-3'>
                        <Col xs={12}>
                            <Button form='form-client-vehicle' variant="primary" type="submit" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                                Salvar
                            </Button>
                        </Col>
                    </Row>
                    <Card>
                        <Card.Body>
                        <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Consultor Técnico</h4>
                            <Row className="mt-3">
                                <Col sm={12} md={12} xs={12}>
                                    <SearchModified
                                        handleTechnicalConsultantSelected={setTechnicalConsultantSelectedSearch}
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12}>
                                    <p>Nome:{technicalConsultantSelectedSearch.label}</p>
                                    <p>Código consultor:{technicalConsultantSelectedSearch.userDetails.cod}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                        <form onSubmit={handleSubmit(onSubmit)} id="form-client-vehicle" >
                        <h4 className="header-title mb-4" style={{color: '#727CF5'}}>agendamento</h4>
                            <Row className="mt-3">
                                <Row>
                                    <Col sm={12} md={12}>
                                        <p>Número do atendimento:{' 99'}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={3} md={3} className="d-flex align-items-center">
                                        <span>Data da visita:</span>
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
                                            //     setDateVisitSelected(e.target.value)
                                            //     console.log('moment -', moment().format("yyyy-MM-DDThh:mm"))
                                            //     console.log('input -',e.target.value)
                                            // }}
                                        />
                                    </Col> 
                                </Row>
                                <Row className='mt-2'>
                                    <Col sm={3} md={3} lg={3} xs={12} className="d-flex align-items-center">
                                        <span>Data da criação:</span>
                                    </Col> 
                                    <Col sm={5} md={5} lg={6} xs={12}>
                                            
                                    </Col>  
                                </Row>
                                </Row>
                            </form>
                        </Card.Body>
                    </Card>
                    <Row className="mt-3">
                        <Col sm={8} md={8} xs={7}>
                            <Button  variant="primary" type="button" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                                Listar checklists
                            </Button>
                        </Col>
                        <Col sm={4} md={4} xs={5}>
                            <Button  variant="primary" type="button" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                            <i className='mdi mdi-clipboard-list-outline p-0' ></i> Novo
                            </Button>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col sm={8} md={8} xs={7}>
                            <Button  variant="primary" type="button" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                                Listar orçamentos
                            </Button>
                        </Col>
                        <Col sm={4} md={4} xs={5}>
                            <Button  variant="primary" type="button" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                            <i className='mdi mdi-clipboard-list-outline p-0' ></i> Novo
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            
        </>
    );
};

export default FormEdit;