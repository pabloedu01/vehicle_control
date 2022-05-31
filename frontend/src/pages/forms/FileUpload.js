// @flow
import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

// components
import PageTitle from '../../components/PageTitle';
import FileUploader from '../../components/FileUploader';

const FileUpload = (): React$Element<React$FragmentType> => {


    const [files,setFiles] = React.useState([]);
    

    // on files upload success converto to base64 and array
    const onFilesUploadSuccess = (files: Array<File>) => {
        let arrayFiles = [];
        const filesArray = Array.from(files);
        const filesBase64 = filesArray.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log(reader.result);
                arrayFiles.push(reader.result);
            };
            console.log(reader)
            console.log(arrayFiles)
            return reader;
        });
    };

    useEffect(() => {
        onFilesUploadSuccess(files);

    }, [files]);
    
    
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Forms', path: '/forms/upload' },
                    { label: 'Form Upload', path: '/forms/upload', active: true },
                ]}
                title={'Form Upload'}
            />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mb-3">Dropzone File Upload</h4>

                            <p className="text-muted font-13 m-b-30">
                                DropzoneJS is an open source library that provides drag’n’drop file uploads with image
                                previews.
                            </p>

                            <FileUploader
                                onFileUpload={(files) => {
                                    setFiles(files)
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default FileUpload;
