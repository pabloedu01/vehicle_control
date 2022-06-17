// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Card, Col, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import config from "../../config";
import {APICore} from "../../helpers/api/apiCore";

const api = new APICore();

const Builder = (props: {company?: any, user?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id} = useParams();
    const [data, setData] = useState(null);

    const getData = () => {
        if(id){
            api.get('/checklist-version/' + id).then((response) => {
                setData(response.data.data);
            },(error) => {
                setData(null);
            });
        } else {
            setData(null);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Versão do Lista de verificação', path: '/panel/checklist-versions/list' },
                    { label: 'Versão', path: `/panel/checklist-versions/${id}/edit` },
                    { label: 'Reporte', path: '/report-bro', active: true },
                ]}
                title={'Versão ' + data?.name}
                insideCompany={false}
                company={props.company}
            />

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            {data ? <iframe style={{width: '100%', height: '100vh'}} src={`${config.API_URL.substr(0,config.API_URL.length - 4)}/build-report?id=${id}&token=${props?.user?.token ?? ''}`}/> : null}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Builder;
