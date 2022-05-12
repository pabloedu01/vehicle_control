// @flow
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Card, Button, Modal, Carousel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import useApi from '../services/api';

type FileUploaderProps = {
    onFileUpload?: (files: any) => void,
    showPreview?: boolean,
    anexosimage?: any,
};

const FileUploader = (props: FileUploaderProps): React$Element<any> => {
    console.log(props);
    const api = useApi();
    const query = new URLSearchParams(useLocation().search);
    const id = query.get('id');

    const [selectedFiles, setSelectedFiles] = useState([]);

    /**
     * Handled the accepted files and shows the preview
     */
    const handleAcceptedFiles = (files) => {
        var allFiles = files;

        if (props.showPreview) {
            files.map((file) =>
                Object.assign(file, {
                    preview: file['type'].split('/')[0] === 'image' ? URL.createObjectURL(file) : null,
                    formattedSize: formatBytes(file.size),
                })
            );

            allFiles = [...selectedFiles];
            allFiles.push(...files);
            setSelectedFiles(allFiles);
        }

        if (props.onFileUpload) props.onFileUpload(files);
    };

    /**
     * Formats the size
     */
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    /*
     * Removes the selected file
     */
    const removeFile = async (file) => {
        if (window.confirm('Você tem certeza que deseja Excluir este arquivo?')) {
            const newFiles = [...selectedFiles];
            newFiles.splice(newFiles.indexOf(file), 1);
            setSelectedFiles(newFiles);
            console.log(selectedFiles[file].id_duc_image);

            const result = await api.deleteImage(selectedFiles[file].id_duc_image);
            if (result.error == '') {
                console.log('deletou');
            } else {
                alert(result.error);
            }
        }
    };

    // get array of url imagens and convert to image src with name size and type and put in handleacepted files
    useEffect(() => {
        if (props.anexos) {
            const files = props.anexos.map((anexo) => {
                let arrax = anexo.url_image.split('/');
                let namefile = arrax[arrax.length - 1];
                let type = namefile.split('.')[1];
                
                return {
                    // url: anexo.url_image,
                    id_duc_image: anexo.id_duc_image,
                    name: namefile,
                   
                    type: type,
                    url: anexo.url_image,
                    preview: anexo.url_image,
                };
            });
            console.log(files);
            var allFiles = '';
            allFiles = [...selectedFiles];
            allFiles.push(...files);
            setSelectedFiles(allFiles);
            // handleAcceptedFiles(files);
        }
    }, [props.anexos]);
    const [modal, setModal] = useState(false);

    /**
     * Show/hide the modal
     */
    const toggle = () => {
        setModal(!modal);
    };

  
    return (
        <>
            <Dropzone {...props} onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    <div className="dropzone">
                        <div className="dz-message needsclick" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <i className="h3 text-muted dripicons-cloud-upload"></i>
                            <h5>Drop files here or click to upload.</h5>
                            <span className="text-muted font-13">
                                (This is just a demo dropzone. Selected files are <strong>not</strong> actually
                                uploaded.)
                            </span>
                        </div>
                    </div>
                )}
            </Dropzone>

            {props.showPreview && selectedFiles.length > 0 && (
                <div className="dropzone-previews mt-3" id="uploadPreviewTemplate">
                    {(selectedFiles || []).map((f, i) => {
                        return (
                            <Card key={i} className="mb-2 shadow-none border">
                                <div className="p-1">
                                    <Row className="align-items-center">
                                        <Col className="col-auto">
                                            <div className="avatar-sm">
                                                <span className="avatar-title rounded">.{f.type}</span>
                                            </div>
                                        </Col>
                                        <Col className="ps-0">
                                                {f.name}
                                            <p className="mb-0">{f.size}</p>
                                        </Col>
                                        <Col className="col-auto">
                                            <OverlayTrigger placement="left" overlay={<Tooltip>Download</Tooltip>}>
                                                <a
                                                    target="_blank"
                                                    href={f.url}
                                                    id="btn-download"
                                                    className="btn btn-link text-muted btn-lg p-0 me-1">
                                                    <i className="uil uil-cloud-download"></i>
                                                </a>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="left" overlay={<Tooltip>Delete</Tooltip>}>
                                                <Link
                                                    to="#"
                                                    onClick={() => removeFile(i)}
                                                    id="btn-Delete"
                                                    className="btn btn-link text-danger btn-lg p-0">
                                                    <i className="uil uil-multiply"></i>
                                                </Link>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                            // <Card className="mt-1 mb-0 shadow-none border" key={i + '-file'}>
                            //     <div className="p-2">
                            //         <Row className="align-items-center">
                            //             {f.preview && (
                            //                 <a target="_blank" href={f.url} className="text-muted fw-bold">
                            //                     <Col className="col-auto">
                            //                         <img
                            //                             data-dz-thumbnail=""
                            //                             className="avatar-sm rounded bg-light"
                            //                             alt={f.name}
                            //                             src={f.preview}
                            //                         />
                            //                     </Col>
                            //                 </a>
                            //             )}
                            //             {!f.preview && (
                            //                 <Col className="col-auto">
                            //                     <div className="avatar-sm">
                            //                         <span className="avatar-title bg-primary rounded">
                            //                             {f.type.split('/')[0]}
                            //                         </span>
                            //                     </div>
                            //                 </Col>
                            //             )}
                            //             <Col className="ps-0">
                            //                 <a target="_blank" href={f.url} className="text-muted fw-bold">
                            //                     {f.name}
                            //                 </a>
                            //                 <p className="mb-0">
                            //                     <strong>{f.formattedSize}</strong>
                            //                 </p>
                            //             </Col>
                            //             <Col className="text-end">
                            //                 {/* <Link to="#" className="btn btn-link btn-lg text-muted shadow-none"> */}
                            //                 <i className="dripicons-cross" onClick={() => removeFile(i)}></i>
                            //                 {/* </Link> */}
                            //             </Col>
                            //         </Row>
                            //     </div>
                            // </Card>
                        );
                    })}
                </div>
            )}
            {/* <Modal show={modal} onHide={toggle} backdrop="static" keyboard={false} size={'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>Anexos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Carousel indicators={true}>
                                {(selectedFiles || []).map((f, i) => {
                                    return (
                                        <Carousel.Item>
                                            <img className="d-block w-100" src={f.preview} alt="First slide" />
                                        </Carousel.Item>
                                    );
                                })}
                            </Carousel>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggle}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal> */}
        </>
    );
};

FileUploader.defaultProps = {
    showPreview: true,
};

export default FileUploader;
