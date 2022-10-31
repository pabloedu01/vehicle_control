// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Row} from "react-bootstrap";
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
import { getAllOptions } from "../../utils/selectOptionsForm";
import HyperDatepicker from "../../components/Datepicker"

import { useMediaQuery } from '../../hooks/useMediaQuery'

 
const api = new APICore();

const allDataForm = {
    client: {
        name: '',
        cpf: '',
        telefone: [''],
        email: [''],
        address: ['']
    },
    vehicle: {
        brand: '',
        mode: '',
        vehicle: '',
        chassi: '',
        board: ''
    },
    technicalConsultant: {
        name: '',
        cod: ''
    },
    schedules: {
        numberAttendance: 0,
        dateVisit: '',
        dateCreated: ''
    }
}


const FormEdit = (props: { company?: any, clientVehicle?: any, client?: any, handleReturnToClientList?: any, handleReturnToClientVehicleList?: any, pushButton?: any }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    // const [technicalConsultants, setTechnicalConsultants] = useState([]);
    // const [clientInfo, setClientInfo] = useState();
    // const [clientVehicleInfo, setClientVehicleInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const onDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

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
    const methods = useForm({
        resolver: schemaResolver,
        defaultValues: {
            clientName: '',
            clientCpf: '',
            clientPhone: ''
        }
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
    console.log(watch('clientPhone'))

    const onSubmit = (formData) => {      
        console.log("enviou")
        console.log(formData)
        console.log(formData.clientCpf.length)
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
            <form onSubmit={handleSubmit(onSubmit)}>
               
            <Row>
                <Col xxl={7}>
                    
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
                                        // options={technicalConsultants}
                                        {...otherProps}
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
                                            key="number"
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
                                    <Row >
                                        <Col lg={10} md={10} sm={10} xs={9}>
                                        <Controller
                                            name="clientPhone"
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
                                                    '-',
                                                    /\d/,
                                                    /\d/,
                                                    /\d/,
                                                    /\d/,
                                                    ]}
                                                    {...field}
                                                    placeholder="(__) ____-____"
                                                    className="form-control"
                                                />
                                            }
                                        />
                                            
                                        </Col>
                                        <Col lg={2} md={2} sm={2} xs={3}>
                                            <Button  className="btn-icon btn btn-light w-100" >
                                                <i className="mdi mdi-phone-plus-outline"></i>
                                            </Button>
                                        </Col>
                                    </Row>
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
                                                type="Text"
                                                name="name"
                                                placeholder="Digite seu email"
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
                                                type="Text"
                                                name="name"
                                                placeholder="Digite seu endereço"
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
                                        type="Text"
                                        name="name"
                                        placeholder="Digite a marca"  
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
                                        name="cpf"
                                        placeholder="Digite o modelo"
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
                                        name="cpf"
                                        placeholder="Digite o veículo"
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
                                        name="cpf"
                                        placeholder="Digite o chassi"
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
                                        name="cpf"
                                        placeholder="Digite placa"
                                    />
                                </Col>
                            </Row>
                        


                        
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={5}>
                    <Row className='mb-3'>
                        <Col xs={12}>
                            <Button  variant="primary" type="submit" style={{width: '100%', minWidth: '62px', fontSize: '20px'}} >
                                Salvar
                            </Button>
                        </Col>
                    </Row>
                    <Card>
                        <Card.Body>
                        <h4 className="header-title mb-4" style={{color: '#727CF5'}}>Consultor Técnico</h4>
                            <Row className="mt-3">
                                <Col sm={10} md={10} xs={9}>
                                    <FormInput
                                        type="Text"
                                        name="name"
                                        placeholder="Digite seu Nome"  
                                    />
                                </Col>
                                <Col sm={2} md={2} xs={3}>
                                    <Button variant="primary" type="button"  >
                                                <i className="mdi mdi-magnify search-icon"></i>
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col sm={12} md={12}>
                                    <p>Nome:{' Pablo Eduardo Lima Celestino'}</p>
                                    <p>Código consultor:{'  PELC'}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
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
                                    <Col sm={5} md={5}>
                                            <HyperDatepicker
                                                hideAddon={true}
                                                // showTimeSelect
                                                locale="pt-BR"
                                                timeFormat="HH:mm"
                                                tI={30}
                                                dateFormat="dd/MM/yyyy"
                                                timeCaption="time"
                                                value={selectedDate}
                                                onChange={(date) => {
                                                    onDateChange(date);
                                                }}
                                        
                                            />
                                    </Col> 
                                    <Col sm={1} md={1} className="d-flex align-items-center">
                                        <span> Hora:</span>
                                    </Col> 
                                    <Col sm={3} md={3}>
                                        <MaskedInput
                                            mask={[/\d/, /\d/, ':', /\d/, /\d/,]}
                                            placeholder="__:__"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col sm={3} md={3} className="d-flex align-items-center">
                                        <span>Data da criação:</span>
                                    </Col> 
                                    <Col sm={5} md={5}>
                                            <HyperDatepicker
                                                hideAddon={true}
                                                // showTimeSelect
                                                locale="pt-BR"
                                                timeFormat="HH:mm"
                                                tI={30}
                                                dateFormat="dd/MM/yyyy"
                                                timeCaption="time"
                                                value={selectedDate}
                                                onChange={(date) => {
                                                    onDateChange(date);
                                                }}
                                        
                                            />
                                    </Col> 
                                    <Col sm={1} md={1} className="d-flex align-items-center">
                                        <span> Hora:</span>
                                    </Col> 
                                    <Col sm={3} md={3}>
                                        <MaskedInput
                                            mask={[/\d/, /\d/, ':', /\d/, /\d/,]}
                                            placeholder="__:__"
                                            className="form-control"
                                        />
                                    </Col>
                                </Row>
                            </Row>
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
            </form>
        </>
    );
};

export default FormEdit;
