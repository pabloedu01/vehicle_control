import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import FileUploader from "./FileUploader";

const FileUpload = (props: {show: boolean, handleClose: any, files: Array, handleFileUpload: any, validateFile?: any, onLoadEnd?: any}) => {
  const handleClose = () => {
    props.handleClose();
  };

  return <Modal show={props.show} onHide={handleClose} centered={true} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Upload de arquivos</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FileUploader
          onLoadEnd={props?.onLoadEnd}
          validateFile={props?.validateFile}
          showPreview={true}
          selectedFiles={props?.files || []}
          onFileUpload={(files) => {
            props.handleFileUpload(files);
          }}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={handleClose}>
        Terminar
      </Button>
    </Modal.Footer>
  </Modal>
};

export default FileUpload;
