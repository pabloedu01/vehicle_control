// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {FormInput} from "../../components";
import {processingFiles, validateFileExcel} from "../../utils/file";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const api = new APICore();

const Form = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            fileExcel: yup.mixed().required()
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
        const utcOffset = moment().utcOffset();

        api.uploadFile('/import',{file: formData.file,company_id: props.company?.id, utcOffset}).then(() => {
            methods.clearErrors('fileExcel');
            methods.setValue('fileExcel', null);
            methods.setValue('file', null);

            history(`/panel/company/${props.company?.id}/service-schedules/list`);
        }, (error) => {
            if(error.response.status === 400 && error.response.data.hasOwnProperty('errors')){
                for(let fieldName in error.response.data.errors){
                    if(error.response.data.errors.hasOwnProperty(fieldName)){
                        methods.setError('fileExcel', {type: 'custom', message: error.response.data.errors['file'].join('<br>')});
                    }
                }
            }
        });
    };

    const onFileChange = (e) => {
        (new Promise((resolve, reject) => {
            processingFiles([e.target.files[0]],resolve,reject, false, validateFileExcel);
        })).then((file) => {
            methods.setValue('file', file);
            methods.clearErrors('fileExcel');
        }).catch((error) => {
            methods.setError('fileExcel', {type: 'custom', message: error});
            methods.setValue('file', null);
            methods.setValue('fileExcel', null);
        });
    };

    useEffect(() => {
        methods.setValue('file', null);
    }, []);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Importación', path: '/import/upload' },
                    { label: 'Upload', active: true },
                ]}
                title={'Importación'}
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
                                            label="Archivo"
                                            type="file"
                                            name="fileExcel"
                                            containerClass={'mb-3'}
                                            onChange={onFileChange}
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
