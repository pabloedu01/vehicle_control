// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Card, Col, Row, Badge} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate, useParams} from "react-router-dom";

const api = new APICore();

const Preview = (props: {company?: any}): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const {id, type, checklistId} = useParams();
    const [data, setData] = useState(null);
    const [vehicleService, setVehicleService] = useState(null);
    const [checklistVersion, setChecklistVersion] = useState(null);
    const [stages, setStages] = useState([]);
    const [checklistData, setChecklistData] = useState({});

    const getData = () => {
        if(id){
            let ajaxCall;

            switch(type){
                case 'service-schedules':
                    ajaxCall = api.get('/vehicle-service/' + checklistId);
                    break;
            }

            ajaxCall.then((response) => {
                switch(type){
                    case 'service-schedules':
                        let data;
                        const checklistData = {};

                        const {brand,client,vehicle, technical_consultant: technicalConsultant, ...vehicleService} = response.data.data;
                        data = {brand, client, technicalConsultant, vehicle};

                        vehicleService.items.forEach((checklistItem) => {
                            checklistData[checklistItem.id] = {
                                id: checklistItem.id,
                                value: checklistItem.pivot.value,
                                evidence: checklistItem.pivot.evidence,
                                observations: checklistItem.pivot.observations,
                                type: checklistItem.validation.type
                            };
                        });

                        setVehicleService(vehicleService);
                        setChecklistVersion(vehicleService.checklist_version);
                        setStages(vehicleService.stages);
                        setChecklistData(checklistData);
                        setData(data);
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

    /*si se cambia alguno de los parametros de id tipo o el vehicle service, se reinicializa todo*/
    useEffect(() => {
        getData();
    }, [id, type, checklistId]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Checklist', path: `/${type}/${id}/checklist` },
                    { label: 'Visualización', path: `/${type}/${id}/checklist/${checklistId}`, active: true },
                ]}
                title={'Checklist'}
                company={props.company}
            />

            <Row>
                <Col xs={12}>
                    {stages.map((stage) => (
                        <>
                            <h2 className="text-center mb-3">{stage.name}</h2>
                            <Row>
                                {stage.items.map((checklistItem) => (
                                  <>
                                      <Col className="mb-3" sm={2}>
                                          <Card>
                                              <Card.Body>
                                                  <h5>{checklistItem.name}</h5>
                                                  <Badge pill className="badge bg-primary">
                                                      {checklistData[checklistItem.id]?.type === 'boolean' ? (checklistData[checklistItem.id]?.value ? 'Si' : 'No') : checklistData[checklistItem.id]?.value}
                                                  </Badge>
                                              </Card.Body>
                                          </Card>
                                      </Col>
                                  </>
                                ))
                                }
                            </Row>
                        </>
                    ))
                    }
                </Col>
            </Row>
        </>
    );
};

export default Preview;
