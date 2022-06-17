// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {APICore} from "../helpers/api/apiCore";
import swal from "sweetalert";
import {processingFiles} from "../utils/file";
import {loadingService} from "../services/loading";

const api = new APICore();

type FileUploaderProps = {
    onFileUpload?: (files: any) => void,
    showPreview?: boolean,
    validateFile?: any,
    onLoadEnd?: any,
    selectedFiles?: Array<any>;
};

const FileUploader = (props: FileUploaderProps): React$Element<any> => {
    /**
     * Handled the accepted files and shows the preview
     */
    const handleFileUpload = (files) => {
        (new Promise((resolve, reject) => {
            processingFiles(files,resolve,reject, true, props?.validateFile, props?.onLoadEnd);
        })).then((files) => {
            loadingService.show();

            Promise.all(files.map((file) => new Promise((resolve, reject) => {
                /*todo: enviar a un endpoint distinto cuando se trate de otros archivos o mejorar el endpoint del backend*/
                api.uploadFile('/file-upload/image', {image: file}).then((response) => {
                    if(response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('id')){
                        resolve(response.data.data);
                    } else {
                        reject();
                    }
                }, (error) => {
                    reject();
                });
            }))).then((processedFiles) => {
                if (props.onFileUpload) props.onFileUpload((props?.selectedFiles || []).concat(processedFiles));
            }).catch((error) => {
                swal({
                    title: 'Error',
                    text: 'Ocorreu um erro ao carregar as imagens.',
                    icon: 'error',
                    buttons: {
                        confirm: {
                            text: 'Ok',
                            value: 'confirm'
                        }
                    },
                    dangerMode: true,
                });
            }).finally(() => {
                loadingService.hide();
            });
        }).catch((error) => {
            swal({
                title: 'Error',
                text: error.toString(),
                icon: 'error',
                buttons: {
                    confirm: {
                        text: 'Ok',
                        value: 'confirm'
                    }
                },
                dangerMode: true,
            });
        });
    };

    const filesFormat = () => {
        const files = props?.selectedFiles || [];

        return files.map((file) => {
            let data;

            if(typeof file === 'string'){
                data = {
                    name: file.substring(file.lastIndexOf('/') + 1),
                    preview: file,
                    url: file
                };
            } else {
                data = {
                    id: file.id,
                    name: file.original_name,
                    preview: file.url,
                    url: file.url
                };
            }

            return data;
        });
    };

    /*
     * Removes the selected file
     */
    const removeFile = async (index) => {
        swal({
            title: '¿tem certeza?',
            text: 'Você tem certeza que deseja Excluir este arquivo?',
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: {
                    text: 'Excluir',
                    value: 'confirm'
                }
            },
            dangerMode: true,
        }).then((confirm) => {
            if(confirm){
                if (props.onFileUpload){
                    const newFiles = props?.selectedFiles || [];
                    newFiles.splice(index, 1);

                    props.onFileUpload(newFiles);
                }
            }
        });
    };
  
    return (
        <>
            <Dropzone {...props} onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    <div className="dropzone">
                        <div className="dz-message needsclick" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <i className="h3 text-muted dripicons-cloud-upload"></i>
                            <h5>Solte os arquivos aqui ou clique para fazer o upload.</h5>
                        </div>
                    </div>
                )}
            </Dropzone>

            {props.showPreview && props.selectedFiles.length > 0 && (
                <div className="dropzone-previews mt-3" id="uploadPreviewTemplate">
                    {filesFormat().map((f, i) => {
                        return (
                            <Card key={i} className="mb-2 shadow-none border">
                                <div className="p-1">
                                    <Row className="align-items-center">
                                        <Col className="col-auto d-flex">
                                            <div className="avatar-sm d-flex align-items-center">
                                                {/*todo: el preview que se muestra va a depender del tipo de archivo que sea*/}
                                                <img className="d-block w-100" src={f.preview} />
                                            </div>
                                        </Col>
                                        <Col className="ps-0">
                                            {f.name}
                                        </Col>
                                        <Col className="col-auto">
                                            <OverlayTrigger placement="left" overlay={<Tooltip>Download</Tooltip>}>
                                                <a
                                                    target="_blank"
                                                    href={f.url}
                                                    id="btn-download"
                                                    className="btn btn-link text-muted btn-lg p-0 me-1">
                                                    <i className="uil uil-cloud-download"/>
                                                </a>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="left" overlay={<Tooltip>Delete</Tooltip>}>
                                                <Link
                                                    to="#"
                                                    onClick={() => removeFile(i)}
                                                    id="btn-Delete"
                                                    className="btn btn-link text-danger btn-lg p-0">
                                                    <i className="uil uil-multiply"/>
                                                </Link>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
};

FileUploader.defaultProps = {
    showPreview: true,
    selectedFiles: []
};

export default FileUploader;
