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
import {getAllOptions} from "../../utils/selectOptionsForm";
import {processingFiles, validateFileImage} from "../../utils/file";
import imageDefault from '../../assets/images/features-1.svg';

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [brands, setBrands] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            brand_id: yup.number().required('Por favor, digite Marca'),
            name: yup.string().nullable().required('Por favor, digite Nome Completo'),
            active: yup.boolean(),
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

        delete formData['fileImage'];

        if(id){
            ajaxCall = api.update('/vehicle-model/' + id,formData);
        } else {
            ajaxCall = api.post('/vehicle-model',Object.assign(formData,{company_id: props.company?.id}));
        }

        ajaxCall.then(() => {
            history(`/panel/company/${props.company?.id}/vehicle-models/list`);
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

    const getData = () => {
        const defaultData = {
            brand_id: null,
            name: null,
            image: null,
            active: true
        };

        if(id){
            api.get('/vehicle-model/' + id).then((response) => {
                const {name,active,brand_id, brand, image} = response.data.data;

                setImagePreview(image);

                setData({
                    name,active,brand_id,brand, image
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const onLoadImage = (e) => {
        setImagePreview(e.target.result);
    };

    const onImageChange = (e) => {
        (new Promise((resolve, reject) => {
            processingFiles([e.target.files[0]],resolve,reject, false, validateFileImage, onLoadImage);
        })).then((file) => {
            api.uploadFile('/file-upload/image', {image: file}).then((response) => {
                if(response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('id')){
                    methods.setValue('image', response.data.data.id);
                    methods.clearErrors('fileImage');
                }
            }, (error) => {
                methods.setError('fileImage', {type: 'custom', message: error.response.data.errors.image.join('<br>')});
                methods.setValue('image', data?.image ?? null);
                methods.setValue('fileImage', null);
                setImagePreview(data?.image ?? null);
            });
        }).catch((error) => {
            methods.setError('fileImage', {type: 'custom', message: error});
            methods.setValue('image', data?.image ?? null);
            methods.setValue('fileImage', null);
            setImagePreview(data?.image ?? null);
        });
    };

    const getBrands = () => {
        api.get('/vehicle-brand/active-brands',{company_id: props.company?.id}).then((response) => {
            setBrands(getAllOptions(response.data.data, data?.brand));
        },(error) => {
            setBrands([]);
        });
    };

    useEffect(() => {
        if(data){
            getBrands();
        }
    }, [data]);

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('name', data?.name ?? null);
        methods.setValue('active', data?.active ?? true);
        methods.setValue('image', data?.image ?? null);
        methods.setValue('brand_id', data?.brand_id ?? null);
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Modelos', path: '/vehicle-models/list' },
                    { label: 'Cadastro', path: `/vehicle-models/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                title={'Formulário de Modelo'}
                company={props.company}
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit, (e) => {console.log(e);})} noValidate>
                                <Row>
                                    <Col md={6}>
                                        <FormInput
                                            label="Marca"
                                            type="select"
                                            name="brand_id"
                                            containerClass={'mb-3'}
                                            options={brands}
                                            {...otherProps}
                                        />
                                        <FormInput
                                            label="Nome"
                                            type="text"
                                            name="name"
                                            placeholder="Digite Nome"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <FormInput
                                            label="Ative"
                                            type="checkbox"
                                            name="active"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <Row>
                                            <Col md={6}>
                                                <FormInput
                                                    label="Imagen"
                                                    type="file"
                                                    name="fileImage"
                                                    containerClass={'mb-3'}
                                                    onChange={onImageChange}
                                                    {...otherProps}
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <img src={imagePreview ?? imageDefault} alt="Preview" width={150}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

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
