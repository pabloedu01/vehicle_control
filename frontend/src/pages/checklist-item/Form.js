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
import {processingFiles, validateFileImage} from "../../utils/file";
import imageDefault from "../../assets/images/features-1.svg";

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState();
    const [visibleOptions, setVisibleOptions] = useState(false);
    const [visibleImages, setVisibleImages] = useState(false);
    const [imagePreview, setImagePreview] = useState({});

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().nullable().required('Por favor, digite Nome'),
            description: yup.string().nullable(),
            code: yup.string().nullable(),
            active: yup.boolean(),
            type: yup.string().nullable().required('Por favor, digite O Tipo'),
            rule: yup.string().nullable().required('Por favor, digite Regra'),
            preview_data_value: yup.string().nullable(),
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

        formData = {
            name: formData.name,
            description: formData.description,
            code: formData.code,
            active: formData.active,
            validation: {
                type: formData.type,
                rule: formData.rule,
                options: formData.type === 'list' ? formData.options.split(',') : [],
                images: formData.type === 'visualInspection' ? formData.images : null
            },
            preview_data: {
                value: formData.preview_data_value
            },
        };

        if(id){
            ajaxCall = api.update('/checklist-item/' + id,formData);
        } else {
            ajaxCall = api.post('/checklist-item',formData);
        }

        ajaxCall.then(() => {
            history(`/panel/checklist-items/list`);
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
            name: null,
            description: null,
            code: null,
            active: true,
            type: null,
            rule: null,
            preview_data_value: null,
            options: null
        };

        if(id){
            api.get('/checklist-item/' + id).then((response) => {
                const {name, description, code, active, validation: {type}, validation: {rule}, validation: {options}, validation: {images}, preview_data: {value: preview_data_value}} = response.data.data;

                onTypeChange(type);

                setImagePreview(images ?? {});

                setData({
                    name, description, code, active, type, rule, preview_data_value, options, images
                });
            },(error) => {
                setData(defaultData);
            });
        } else {
            setData(defaultData);
        }
    };

    const onTypeChange = (value) => {
        setVisibleOptions(value === 'list');
        methods.setValue('options', null);

        setVisibleImages(value === 'visualInspection');
        methods.setValue('images', {});
    };

    const onImageChange = (e, position) => {
        (new Promise((resolve, reject) => {
            processingFiles([e.target.files[0]],resolve,reject, false, validateFileImage, (e) => {
                setImagePreview({...imagePreview, [position]: e.target.result});
            });
        })).then((file) => {
            api.uploadFile('/file-upload/image', {image: file}).then((response) => {
                if(response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('id')){
                    methods.setValue('images', {...methods.getValues('images'), [position]: response.data.data.id});
                    methods.clearErrors('fileImage' + position);
                }
            }, (error) => {
                methods.setError('fileImage' + position, {type: 'custom', message: error.response.status+'<br>'+error.response.data.message });
                methods.setValue('images', {...methods.getValues('images'), [position]: data?.images[position] ?? null});
                methods.setValue('fileImage' + position, null);
                setImagePreview({...data?.images, [position]: data?.images[position] ?? null});
            });
        }).catch((error) => {
            methods.setError('fileImage' + position, {type: 'custom', message: error});
            methods.setValue('images', {...methods.getValues('images'), [position]: data?.images[position] ?? null});
            methods.setValue('fileImage' + position, null);
            setImagePreview({...data?.images, [position]: data?.images[position] ?? null});
        });
    };

    useEffect(() => {
        getData();
    }, [id]);

    useEffect(() => {
        methods.setValue('name', data?.name ?? null);
        methods.setValue('description', data?.description ?? null);
        methods.setValue('code', data?.code ?? null);
        methods.setValue('active', data?.active ?? true);
        methods.setValue('type', data?.type ?? null);
        methods.setValue('rule', data?.rule ?? null);
        methods.setValue('preview_data_value', data?.preview_data_value ?? null);
        methods.setValue('options', data?.options?.toString() ?? null);
        methods.setValue('images', data?.images ?? {});
    }, [data]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Itens do checklist', path: '/panel/checklist-items/list' },
                    { label: 'Cadastro do Iten', path: `/panel/checklist-items/${id ? id + '/edit' : 'create'}`, active: true },
                ]}
                insideCompany={false}
                title={'Iten de lista de verificação'}
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
                                            label="Código"
                                            type="text"
                                            name="code"
                                            placeholder="Digite Código"
                                            containerClass={'mb-3'}
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
                                        <FormInput
                                            label="Descrição"
                                            type="text"
                                            name="description"
                                            placeholder="Digite Descrição"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Valor Predefinição"
                                            type="text"
                                            name="preview_data_value"
                                            placeholder="Digite Valor Predefinição"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
                                    </Col>

                                    <Col md={6}>



                                        <FormInput
                                            label="O Tipo"
                                            type="select"
                                            name="type"
                                            options={[
                                                {
                                                    value: 'boolean',
                                                    label: 'Boolean'
                                                }, {
                                                    value: 'string',
                                                    label: 'String'
                                                }, {
                                                    value: 'list',
                                                    label: 'List'
                                                }, {
                                                    value: 'integer',
                                                    label: 'Integer'
                                                }, {
                                                    value: 'visualInspection',
                                                    label: 'Inspeção visual'
                                                }, {
                                                    value: 'horizontalBar',
                                                    label: 'Horizontal Bar'
                                                }
                                            ]}
                                            placeholder="Digite O Tipo"
                                            containerClass={'mb-3'}
                                            handleChange={onTypeChange}
                                            {...otherProps}
                                        />

                                        {visibleOptions ? <FormInput
                                            label="Opções"
                                            type="text"
                                            name="options"
                                            placeholder="Digite Options"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />:null}

                                        {visibleImages ? ['Frente','Lateral esquerda','Lateral direita', 'Traseira', 'Teto'].map((position, index) => (
                                            <Row key={(index + 1)}>
                                                <Col md={8}>
                                                    <FormInput
                                                        label={"Imagen " + position}
                                                        type="file"
                                                        name={"fileImage" + (index + 1) }
                                                        containerClass={'mb-3'}
                                                        onChange={(e) => {onImageChange(e, (index + 1))}}
                                                        {...otherProps}
                                                    />
                                                </Col>
                                                <Col className="d-flex justify-content-end" md={4}>
                                                    <img src={imagePreview[(index + 1)] ?? imageDefault} alt="Preview" width={150}/>
                                                </Col>
                                            </Row>
                                        )):null}

                                        <FormInput
                                            label="Regra"
                                            type="text"
                                            name="rule"
                                            placeholder="Digite Regra"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />

                                        <FormInput
                                            label="Ative"
                                            type="checkbox"
                                            name="active"
                                            containerClass={'mb-3'}
                                            {...otherProps}
                                        />
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
