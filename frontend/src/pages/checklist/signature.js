// @flow
import React, { useEffect, useState, useRef } from 'react';
import {Button, Col, Modal, Row, Card} from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import moment from "moment";
import {dataURLtoFile} from "../../utils/file";
import swal from "sweetalert";
import {APICore} from "../../helpers/api/apiCore";

const api = new APICore();

const Signature = (props: { item: any, onChange: any, value: any, onManageAjaxError?: any }): React$Element<React$FragmentType> => {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState({});

    const [cleanSignature, setCleanSignature] = useState(false);
    const [drawSignatures, setDrawSignatures] = useState(false);
    const [signatureStarted, setSignatureStarted] = useState(false);
    const [signatureChanged, setSignatureChanged] = useState(false);
    const [signatureDate, setSignatureDate] = useState(null);
    const [signature, setSignature] = useState(null);

    const signatureWidth = () => {
        let width = document.getElementById('signature')?.offsetWidth || 1000;

        if(width > 800){
            width = (width/2)*0.7;
        } else {
            width = (width)*0.9;
        }

        return width;
    };

    const onEndSignature = () => {
        setSignatureStarted(true);
        setSignatureDate(moment().utc().format('YYYY-MM-DDTHH:mm:00+00:00'));
        setSignatureChanged(true);
    };

    const onSave = () => {
        const files = [];

        if(signatureStarted){
            if(signature && !signature.isEmpty()){
                files.push(dataURLtoFile(signature.toDataURL('image/png'), 'signature.png'));
            }
        }

        Promise.all(files.map((file) => new Promise((resolve, reject) => {
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
            if(signatureChanged)
            {
                let localSignatureImage = null;

                processedFiles.forEach((file) => {
                    if(file.original_name === 'signature.png'){
                        localSignatureImage = file;
                    }
                });

                props?.onChange(JSON.stringify({
                    signatureImage: localSignatureImage,
                    signatureDate,
                    base64: !signature.isEmpty() ? signature.toDataURL('image/png') : null
                }));
            }



            setShowModal(false);
        }).catch((error) => {
            swal({
                title: 'Error',
                text: 'Ocorreu um erro ao carregar as assinaturas.',
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

    useEffect(() => {
        if(showModal){
            if(data && signature){
                if(data?.base64){
                    setTimeout(() => {
                        signature.clear();
                        signature.fromDataURL(data?.base64, {width: signatureWidth(),height: 200,ratio: 1});
                        signature.off();

                        setSignatureDate(data?.signatureDate ?? null);
                    },100);
                } else {
                    setCleanSignature(!cleanSignature);
                }
            }
        }
    }, [signature, drawSignatures]);

    useEffect(() => {
        if(showModal){
            setSignatureStarted(false);
            setCleanSignature(false);
            setDrawSignatures(false);
            setSignatureChanged(false);
        }
    }, [showModal]);

    /*forzar la limpieza de la firma*/
    useEffect(() => {
        setTimeout(() => {
            if(signature){
                signature.clear();
                signature.on();
            }
        },100);
    }, [cleanSignature]);

    useEffect(() => {
        const data = props?.value && props?.value.length > 0 ? JSON.parse(props?.value) : null;
        setData(data);
    }, [props?.value]);

    return (
        <>
            <Modal show={showModal} onHide={ () => { setShowModal(false); } } size="md" scrollable={true} centered={true}>
                <Modal.Header >
                    Assinatura
                </Modal.Header>
                <Modal.Body style={{ minHeight: '300px' }} id="signature">
                    <SignatureCanvas penColor='green'
                                     ref={(ref) => {
                                         setSignature(ref);
                                     }}
                                     onEnd={onEndSignature}
                                     canvasProps={{
                                         width: signatureWidth(),
                                         height: 200,
                                         className: 'signatureCanvas'
                                     }}/>
                    <br/>
                    {signatureDate ? moment(signatureDate).format('DD/MM/YYYY H:mma') : ''}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type="button" onClick={() => {
                        setSignatureStarted(false);
                        setSignatureDate(null);
                        setSignatureChanged(data?.signatureImage ? true : false);
                        signature.on();
                        signature.clear();
                    }}>Limpar</Button>
                    <Button variant="primary" onClick={() => {
                        setShowModal(false);
                    }}>
                        Sair
                    </Button>
                    <Button variant="primary" onClick={onSave}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Button type="button" onClick={() => {setShowModal(true);}} variant="primary">
                Assinatura
            </Button>
        </>
    );
};

export default Signature;
