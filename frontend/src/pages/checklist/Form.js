// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {FormInput} from "../../components";
import moment from 'moment';
import swal from "sweetalert";

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id, type} = useParams();
    const [data, setData] = useState();
    const [checklistVersion, setChecklistVersion] = useState(null);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({

        })
    );

    /*
     * form methods
     */
    const methods = useForm({ resolver: schemaResolver, defaultValues: {} });

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    const otherProps = {
      register,errors,control
    };

    const onSubmit = (formData) => {
        let ajaxCall;

        formData.promised_date = moment(formData.promised_date).utc().format('YYYY-MM-DDTHH:mm:00+00:00');

        if(id){
            ajaxCall = api.update('/service-schedule/' + id,Object.assign(formData, {claims_service: []}));
        } else {
            ajaxCall = api.post('/service-schedule',Object.assign(formData,{company_id: props.company?.id, claims_service: []}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/service-schedules/list`);
        }, (error) => {
            if(error.response.status === 400 && error.response.data.hasOwnProperty('errors')){
                for(let fieldName in error.response.data.errors){
                    if(error.response.data.errors.hasOwnProperty(fieldName)){
                        methods.setError(fieldName, {type: 'custom', message: error.response.data.errors[fieldName].join('<br>')});
                    }
                }
            }
        });
    };

    const getChecklistVersion = (brand_id, version_id?) => {
        api.get('/vehicle-brand/' + brand_id + '/checklist' + (version_id ? '/' + version_id : '')).then((response) => {
            setChecklistVersion(response.data.data);
        },(error) => {
            setChecklistVersion(null);

            swal({
                title: 'No existe',
                text: 'No existe un checklist asociado a la marca del vehiculo',
                icon: 'warning',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
                dangerMode: true,
            }).then((confirm) => {

            });
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
                        const {vehicle: {model: {brand_id}}, vehicle: {model: {brand}}, client, vehicle_service : vehicleService} = response.data.data;

                        if(vehicleService === null){
                            getChecklistVersion(brand_id);
                        } else {
                            getChecklistVersion(brand_id, vehicleService.version_id);
                        }

                        setData({brand,client, vehicleService: vehicleService});
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

    useEffect(() => {

    }, []);

    useEffect(() => {
        getData();
    }, [id, type]);

    return (
        <>
            <PageTitle
                breadCrumbItems={

                    type === 'service-schedules' ?
                        [
                            { label: 'Horários de Serviço', path: '/service-schedules/list' },
                            { label: 'Editar', path: `/service-schedules/${id}/edit` },
                            { label: 'Checklist', active: true },
                        ]:
                    [{ label: 'Checklist', active: true },]
                }
                title={'Checklist ' + (checklistVersion?.name ?? '') + ' ' + data?.brand.name}
                company={props.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit, (e) => {console.log(e);})} noValidate>
                                {(checklistVersion?.items || []).map((item) => (
                                    <Row className="mb-1" key={item.id}>
                                        <span className="mb-3">
                                            {item.name}
                                        </span>
                                        <hr/>
                                    </Row>
                                ))}

                                <div className="mb-3 mb-0">
                                    <Button variant="primary" type="submit">
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

export default Form;
