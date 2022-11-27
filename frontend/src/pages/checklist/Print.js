// @flow
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import { Card, Col, Row} from 'react-bootstrap';
import { APICore } from '../../helpers/api/apiCore';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import "../../assets/scss/custom/checklist/ChecklistPrint.scss";
import carrinho from "../../assets/images/carrinho.jpg";
import toyota from "../../assets/images/toyota.png";
import classNames from 'classnames';

const api = new APICore();

const SquareCheck = ({ type = "success", checked = false }) => (
    <div className={`square-check bg-${type}`}>
        <div className={checked ? "checked" : ''}/>
    </div>
);

const TripleSquareCheck = ({
                               first = { checked: false },
                               second = { checked: false },
                               third = { checked: false },
                           }) => (
    <div className="tripe-square-check">
        <SquareCheck checked={first.checked} />
        <SquareCheck type="warning" checked={second.checked} />
        <SquareCheck type="danger" checked={third.checked} />
    </div>
);

const Print = (props: { company?: any, id: number, type: string, checklistId: number }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    /*const { id, type, checklistId } = useParams();*/
    const [data, setData] = useState(null);
    const [vehicleService, setVehicleService] = useState(null);
    const [stages, setStages] = useState([]);
    const [evidences, setEvidences] = useState([]);
    const [checklistData, setChecklistData] = useState({});

    const steps = {
        '1': 'Frente',
        '2': 'Lateral esquerda',
        '3': 'Lateral direita',
        '4': 'Traseira',
        '5': 'Teto',
    };

    const getData = () => {
        console.log('/vehicle-service/' + props?.checklistId)
        if (props?.id) {
            let ajaxCall;

            switch (props?.type) {
                case 'service-schedules':
                    ajaxCall = api.get('/vehicle-service/' + props?.checklistId);
                    break;
            }

            ajaxCall.then(
                (response) => {
                    console.log(response);
                    switch (props?.type) {
                        case 'service-schedules':
                            let data;
                            const checklistData = {};
                            const {
                                brand,
                                client,
                                vehicle,
                                technical_consultant: technicalConsultant,
                                checklist_version: checklistVersion,
                                service_schedule: { client_vehicle: clientVehicle, ...serviceSchedule },
                                ...vehicleService
                            } = response.data.data;
                            data = {
                                brand,
                                client,
                                technicalConsultant,
                                vehicle,
                                serviceSchedule,
                                checklistVersion,
                                clientVehicle,
                            };

                            vehicleService.items.forEach((checklistItem) => {
                                if(checklistItem.code !== null){
                                    checklistData[checklistItem.code] = {
                                        id: checklistItem.id,
                                        value: checklistItem.pivot.value,
                                        evidence: checklistItem.pivot.evidence,
                                        observations: checklistItem.pivot.observations,
                                        type: checklistItem.validation.type,
                                    };
                                }
                            });

                            const stages = vehicleService.stages.filter((stage) => stage.pivot.processed);
                            stages.forEach((stage, index) => {
                                stages[index].evidences = [].concat(
                                    ...stage.items.map((checklistItem) =>
                                        (checklistData[checklistItem.code]?.evidence || []).map((evidence) => {
                                            return {
                                                evidence,
                                                name: checklistItem.name,
                                                observations: checklistData[checklistItem.code].observations,
                                            };
                                        })
                                    )
                                );
                            });

                            setVehicleService(vehicleService);
                            setStages(stages);
                            setChecklistData(checklistData);
                            setData(data);
                            break;
                        default:
                            setData(response.data.data);
                            break;
                    }
                },
                (error) => {
                    setData(null);
                }
            );
        } else {
            setData(null);
        }
    };

    /*si se cambia alguno de los parametros de id tipo o el vehicle service, se reinicializa todo*/
    useEffect(() => {
        if(props?.checklistId){
            getData();
        }
    }, [props?.checklistId]);

    return (
        <>
            <Row className="print-checklist" id="print-checklist">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <div className="page">
                                <header>
                                    <div className="row">
                                        <div className="col-40 d-flex align-items-center">
                                            <img src={toyota} alt="Toyota Logotype" />
                                        </div>
                                        <div>
                                            <h3>
                                                Folha de inspeção
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row red-tag">
                                        <div className="col text-white">
                                            <b>Endereço</b> • {vehicleService?.company?.address} • CEP:  • {vehicleService?.company?.phone}<br />
                                            <b>CEP</b> • {vehicleService?.company?.postal_code}<br />
                                            <b>Telefone</b> • {vehicleService?.company?.phone}
                                        </div>
                                        <div className="col-35"><img src={vehicleService?.company?.image} alt="Company Logo" className="img-responsive print-company-logo" /></div>
                                    </div>
                                </header>
                                <div className="container-fluid">
                                    <div className="row my-2 text-center fw-500">
                                        <div className="col">
                                            <div className="bg-success p-2 round-2">OK/SUBSTITUÍDO</div>
                                        </div>
                                        <div className="col px-2">
                                            <div className="bg-warning p-2 round-2">
                                                REQUER TROCA/REPARO FUTURO{" "}
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="bg-danger p-2 round-2">
                                                REQUER TROCA/REPARO IMEDIATO
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-1">
                                        <div className="col-5">
                                            <div className="form-slot me-2 d-flex">
                                                <label>Cliente:</label>
                                                <span className="align-self-center">{data?.client?.name}</span>
                                            </div>
                                            <div className="row mt-1 les-tres">
                                                <div className="col">
                                                    <div className="form-slot placa d-flex">
                                                        <label>Placa:</label>
                                                        <span className="align-self-center">{data?.clientVehicle?.plate}</span>
                                                    </div>
                                                    <div className="blue-slots">
                                                        <div>Cliente acompanha inspeção?</div>
                                                        <div>Fixação tapete genuíno</div>
                                                        <div>Macaco</div>
                                                        <div>Triângulo</div>
                                                        <div>Chave de roda</div>
                                                        <div>Estepe</div>
                                                        <div>
                                                            Documento e<br />
                                                            Livrete de garantia
                                                        </div>
                                                        <div>Combustível</div>
                                                        <div>Quilometragem</div>
                                                        <div className="bg-secondary text-black text-center fw-700 py-1">
                                                            Condição
                                                            <br />
                                                            de limpeza
                                                        </div>
                                                        <div className="bg-secondary text-black text-center fw-700 py-1">
                                                            Assinatura
                                                            <br />
                                                            Consultor
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col px-2">
                                                    <div>
                                                        <div className="icon-header">
                                                            <span className="text-center">Recepção</span>
                                                            <div className="icon"><i className="mdi mdi-car-side" style={{
                                                                style: {
                                                                    transform: "scaleX(-1)"
                                                                }
                                                            }}></i></div>
                                                        </div>
                                                        <div className="row text-center pt-1 fw-700 small">
                                                            <div className="col round-2 b-1 mx-5">Sim</div>
                                                            <div className="col round-2 b-1 mx-5">Não</div>
                                                        </div>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-cli-acomp-insp']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-cli-acomp-insp']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-fixa-tap-gen']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-fixa-tap-gen']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-macaco']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-macaco']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-triangulo']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-triangulo']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-chave-roda']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-chave-roda']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-estepe']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-estepe']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-docum-livrete']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['r-docum-livrete']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="blue-slots">
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['r-combustivel']?.value ?? ''}</span></div>
                                                        </div>
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['r-quilometragem']?.value ?? ''}</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="row three-checkboxes">
                                                        <div className={classNames({checked: checklistData['r-condi-limpieza']?.value.toString().toLowerCase() === 'boa' })}/> Boa
                                                        <div className={classNames({checked: checklistData['r-condi-limpieza']?.value.toString().toLowerCase() === 'regular' })}/> Regular
                                                        <div className={classNames({checked: checklistData['r-condi-limpieza']?.value.toString().toLowerCase() === 'ruim' })}/> Ruim
                                                    </div>
                                                    <div className="form-slot">
                                                        {checklistData['r-ass-consultor']?.value && checklistData['r-ass-consultor']?.value.length > 0 ? <img style={{height: '100%', width: 'auto !important'}} src={JSON.parse(checklistData['r-ass-consultor']?.value)?.signatureImage} /> : ''}
                                                    </div>
                                                </div>
                                                <div className="col px-2">
                                                    <div>
                                                        <div className="icon-header">
                                                            <span className="text-center">Entrega</span>
                                                            <div className="icon">icon</div>
                                                        </div>
                                                        <div className="row text-center pt-1 fw-700 small">
                                                            <div className="col round-2 b-1 mx-5">Sim</div>
                                                            <div className="col round-2 b-1 mx-5">Não</div>
                                                        </div>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-cli-acomp-insp']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-cli-acomp-insp']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-fixa-tap-gen']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-fixa-tap-gen']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-macaco']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-macaco']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-triangulo']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-triangulo']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-chave-roda']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-chave-roda']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-estepe']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-estepe']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-docum-livrete']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['e-docum-livrete']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="blue-slots">
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['e-combustivel']?.value ?? ''}</span></div>
                                                        </div>
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['e-quilometragem']?.value ?? ''}</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="row three-checkboxes">
                                                        <div className={classNames({checked: checklistData['e-condi-limpieza']?.value.toString().toLowerCase() === 'boa' })}/> Boa
                                                        <div className={classNames({checked: checklistData['e-condi-limpieza']?.value.toString().toLowerCase() === 'regular' })}/> Regular
                                                        <div className={classNames({checked: checklistData['e-condi-limpieza']?.value.toString().toLowerCase() === 'ruim' })}/> Ruim
                                                    </div>
                                                    <div className="form-slot">
                                                        {checklistData['e-ass-consultor']?.value && checklistData['e-ass-consultor']?.value.length > 0 ? <img style={{height: '100%', width: 'auto !important'}} src={JSON.parse(checklistData['e-ass-consultor']?.value)?.signatureImage} /> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-7">
                                            <div className="border-wrapper p-1">
                                                <div className="row">
                                                    <div className="col-7 pe-1">
                                                        <figure className="carrinho mb-10">
                                                            <img src={carrinho} alt="" />
                                                        </figure>
                                                        <table className="table-head border-1 my-2 cell-h-sm">
                                                            <thead>
                                                            <tr>
                                                                <th>A=Amassado</th>
                                                                <th>R=Riscado</th>
                                                                <th>X=Quebrado</th>
                                                                <th>F=Faltante</th>
                                                            </tr>
                                                            </thead>
                                                        </table>
                                                        <table className="bordered table-head cell-h-sm">
                                                            <thead>
                                                            <tr>
                                                                <th>Pneu</th>
                                                                <th width="30%">Marca</th>
                                                                <th>Sulco encontrado</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>Dianteiro Esquerdo</td>
                                                                <td>{checklistData['r-marca-pneu-de']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{checklistData['r-sulco-de']?.value ?? ''}&nbsp;&nbsp;</span>(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Traseiro Esquerdo</td>
                                                                <td>{checklistData['r-marca-pneu-te']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{checklistData['r-sulco-te']?.value ?? ''}&nbsp;&nbsp;</span>(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Dianteiro Direito</td>
                                                                <td>{checklistData['r-marca-pneu-dd']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{checklistData['r-sulco-dd']?.value ?? ''}&nbsp;&nbsp;</span>(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Traseiro Direito</td>
                                                                <td>{checklistData['r-marca-pneu-td']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{checklistData['r-sulco-td']?.value ?? ''}&nbsp;&nbsp;</span>(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="col-5">
                                                        <table className="bordered table-head cell-h-sm">
                                                            <thead>
                                                            <tr>
                                                                <th>ltens Adicionais</th>
                                                                <th>Sim</th>
                                                                <th>Não</th>
                                                                <th>Avaria</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>Tapete genuíno Toyota</td>
                                                                <td>{checklistData['a-tem-tap-ge-toyota']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-tem-tap-ge-toyota']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Kit Multimídia / Sistema de áudio</td>
                                                                <td>{checklistData['a-tem-kit-multimidia']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-tem-kit-multimidia']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Far6is de Neblina</td>
                                                                <td>{checklistData['a-farois-neblina']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-farois-neblina']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Friso Lateral</td>
                                                                <td>{checklistData['a-friso-lateral']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-friso-lateral']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Bandeja de porta-malas</td>
                                                                <td>{checklistData['a-band-porta-malas']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-band-porta-malas']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Sensor de estacionamento</td>
                                                                <td>{checklistData['a-sensor-estac']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-sensor-estac']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Macaneta cromada</td>
                                                                <td>{checklistData['a-macaneta-croma']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-macaneta-croma']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Soleira</td>
                                                                <td>{checklistData['a-soleira']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-soleira']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Aplique cromado</td>
                                                                <td>{checklistData['a-aplique-cromado']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-aplique-cromado']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Calha de chuva</td>
                                                                <td>{checklistData['a-calha-chuva']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-calha-chuva']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Roda 16"</td>
                                                                <td>{checklistData['a-roda-16']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-roda-16']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Alto-falante dianteiro</td>
                                                                <td>{checklistData['a-alto-falante']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-alto-falante']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Porca antifurto da roda</td>
                                                                <td>{checklistData['a-porca-anti-furto']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-porca-anti-furto']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Radio 2 DIN com Bluetooh</td>
                                                                <td>{checklistData['a-radio-2din-blu']?.value.toString() === '1' ? 'X' : ''}</td>
                                                                <td>{checklistData['a-radio-2din-blu']?.value.toString() === '0' ? 'X' : ''}</td>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col p-1 lh-150">
                                                        <div>
                                                            Pintura/Carroçaria: {checklistData['r-pin-carroc']?.value ?? ''}<hr className="bottom-line" />
                                                        </div>
                                                        <div>
                                                            Para-brisa: {checklistData['r-para-brisa']?.value ?? ''}<hr className="bottom-line" />
                                                        </div>
                                                        <div>
                                                            Assinatura Estofamento: {checklistData['r-assinatura-estofamento']?.value ?? ''}<hr className="bottom-line" />
                                                        </div>
                                                        <div>
                                                            Cliente deseja trocar o veículo? {checklistData['r-cli-troca-veic']?.value ?? ''}<hr className="bottom-line" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* seção */}
                                    <div className="row equal-form-slots h-12mm">
                                        <div className="col-6">
                                            <div className="form-slot me-1">
                                                <p className="mb-1">
                                                    Veículo oriundo de guincho/plataforma: (&nbsp;{checklistData['r-veic-ori-guincho']?.value.toString() === '1' ? 'X' : ' '}&nbsp;) Sim &nbsp; (&nbsp;{checklistData['r-veic-ori-guincho']?.value.toString() === '0' ? 'X' : ' '}&nbsp;) Nao
                                                </p>
                                                Pertences pessoais:
                                                <br /> (&nbsp;{checklistData['e-pertences-pessoais']?.value.toString() === 'Cliente retira' ? 'X' : ' '}&nbsp;) Cliente retira &nbsp; (&nbsp;{checklistData['e-pertences-pessoais']?.value.toString() === 'Recolher e guardar' ? 'X' : ' '}&nbsp;) Recolher e
                                                guardar &nbsp; (&nbsp;{checklistData['e-pertences-pessoais']?.value.toString() === 'No veículo' ? 'X' : ' '}&nbsp;) No veículo
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-slot">
                                                <label>Observações:</label>&nbsp;

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row smallest-gutters">
                                        <div className="col-6 text-center">
                                            <div className="form-slot p-2 me-1">
                                                <div className="text-justify ls-05">
                                                    Declaro ter deixado o veículo nas condições informadas nesta
                                                    folha de inspeção.
                                                </div>

                                                <p className="my-5">
                                                    {checklistData['r-ass-client']?.value && checklistData['r-ass-client']?.value.length > 0
                                                        ?
                                                        (<>Data: <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['r-ass-client']?.value)?.signatureDate)).getDate()).substr(-2,2) }&nbsp;&nbsp;</span> / <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['r-ass-client']?.value)?.signatureDate)).getMonth()).substr(-2,2) }&nbsp;&nbsp;</span> /<span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;&nbsp;{ (new Date(JSON.parse(checklistData['r-ass-client']?.value)?.signatureDate)).getFullYear() }&nbsp;&nbsp;&nbsp;</span> &nbsp; Hora: <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['r-ass-client']?.value)?.signatureDate)).getHours()).substr(-2,2) }&nbsp;&nbsp;</span> : <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['r-ass-client']?.value)?.signatureDate)).getMinutes()).substr(-2,2) }&nbsp;&nbsp;</span></>)
                                                        :
                                                        (<>Data: ____ / ____ /________ &nbsp; Hora: ____ : ____</>)
                                                    }
                                                </p>





<div style={{height: '25px'}}>
                                                {checklistData['r-ass-client']?.value && checklistData['r-ass-client']?.value.length > 0 ? <img style={{height: '100%', width: 'auto !important'}} src={JSON.parse(checklistData['r-ass-client']?.value)?.signatureImage} /> : ''}
</div>

                                                <span className="signature small">
                <hr />
                Assinatura do Cliente ou por ele autorizada
              </span>
                                            </div>
                                        </div>
                                        <div className="col-6 text-center">
                                            <div className="form-slot p-2" style={{ height: "100%" }}>
                                                <div className="text-justify ls-05">
                                                    Declaro ter retirado o veículo nas condições informadas nesta
                                                    folha de inspeção.
                                                </div>
                                                <p className="my-5">
                                                    {checklistData['e-ass-client']?.value && checklistData['e-ass-client']?.value.length > 0
                                                        ?
                                                        (<>Data: <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['e-ass-client']?.value)?.signatureDate)).getDate()).substr(-2,2) }&nbsp;&nbsp;</span> / <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['e-ass-client']?.value)?.signatureDate)).getMonth()).substr(-2,2) }&nbsp;&nbsp;</span> /<span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;&nbsp;{ (new Date(JSON.parse(checklistData['e-ass-client']?.value)?.signatureDate)).getFullYear() }&nbsp;&nbsp;&nbsp;</span> &nbsp; Hora: <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['e-ass-client']?.value)?.signatureDate)).getHours()).substr(-2,2) }&nbsp;&nbsp;</span> : <span style={{textDecoration: 'underline'}}>&nbsp;&nbsp;{ ('00' + (new Date(JSON.parse(checklistData['e-ass-client']?.value)?.signatureDate)).getMinutes()).substr(-2,2) }&nbsp;&nbsp;</span></>)
                                                        :
                                                        (<>Data: ____ / ____ /________ &nbsp; Hora: ____ : ____</>)
                                                    }
                                                </p>





<div style={{height: '25px'}}>
                                                {checklistData['e-ass-client']?.value && checklistData['e-ass-client']?.value.length > 0 ? <img style={{height: '100%', width: 'auto !important'}} src={JSON.parse(checklistData['e-ass-client']?.value)?.signatureImage} /> : ''}
</div>
                                                <span className="signature small">
                <hr />
                Assinatura do Cliente ou por ele autorizada
              </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* seção */}
                                    <div className="icon-header p-1 text-white mt-1">
                                        <div className="row" style={{width: '100%', justifyContent: 'space-between'}}>
                                            <div className="col-auto">TIPO DE SERVIÇO</div>
                                            <div className="col-auto square-check"><div/>&nbsp;&nbsp;Revisão</div>
                                            <div className="col-auto square-check"><div/>&nbsp;&nbsp;Diagnóstivo</div>
                                            <div className="col-auto square-check"><div/>&nbsp;&nbsp;Reparo</div>
                                            <div className="col-auto square-check"><div/>&nbsp;&nbsp;Outros <div className="form-slot input"/></div>
                                        </div>
                                    </div>
                                    <div className="row align-items-baseline ls-05">
                                        <div className="col-4 pe-1">
                                            <div className="icon-header my-1">
                                                <span>PARTE INTERNA</span>
                                                <div className="icon"><i className="mdi mdi-car-side"></i></div>
                                            </div>
                                            <table className="table checks">
                                                <tbody>
                                                <tr>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-relogio']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-relogio']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-relogio']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Relógio e computador de bordo</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-luzes-paine']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-luzes-paine']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-luzes-paine']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Luzes do painel e de cortesia</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-lava-limpa']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-lava-limpa']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-lava-limpa']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Lavadores e limpadores</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-venti-desemb']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-venti-desemb']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-venti-desemb']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Ventilador / Desembaçadores</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-retrovisor']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-retrovisor']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-retrovisor']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Retrovisor e para-sóis</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-buzina']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-buzina']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-buzina']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Buzina</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-volante']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-volante']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-volante']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Volante e coluna de direção</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-aquecedor']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-aquecedor']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-aquecedor']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Aquecedor elétrico dos bancos (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-ar-condicionado']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-ar-condicionado']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-ar-condicionado']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Ar-condicionado</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-radio']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-radio']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-radio']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Rádio / Multimídia</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-bancos-cintos']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-bancos-cintos']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-bancos-cintos']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Bancos e cintos de segurança</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-vidros']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-vidros']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-vidros']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Vidros e trava elétrica</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-freios']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-freios']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-freios']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Freios de estacionamento</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-pedal']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-pedal']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-pedal']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Pedal de freio</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pi-filtro-ar']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pi-filtro-ar']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pi-filtro-ar']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Filtro de ar-condicionado</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className="icon-header my-2">
                                                <span>PARTE EXTERNA</span>
                                                <div className="icon">icon</div>
                                            </div>
                                            <table className="table checks">
                                                <tbody>
                                                <tr>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pex-ilumina-dt']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pex-ilumina-dt']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pex-ilumina-dt']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Iluminação dianteira e traseira</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pex-tampa-tanq']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pex-tampa-tanq']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pex-tampa-tanq']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Tampa do tanque de combustível</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-pex-fumaca']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-pex-fumaca']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-pex-fumaca']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Fumaça do motor (motor diesel)</td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            <div className="icon-header mb-1 mt-1">
                                                <span>COM O CAPÔ ABERTO</span>
                                                <div className="icon">icon</div>
                                            </div>
                                            <table className="table checks">
                                                <tbody>
                                                <tr>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-vaza-oleo-agua']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-vaza-oleo-agua']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-vaza-oleo-agua']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Vazamentos de óleo, água, combustível e/ou outros fluídos</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-correias']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-correias']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-correias']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Correias de acionamento</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-folga-val']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-folga-val']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-folga-val']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Folga das válvulas (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-velas']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-velas']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-velas']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>velas de ignição (conforme ano/modelo do veículo)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-cond-bateria']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-cond-bateria']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-cond-bateria']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>condições da bateria</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-tensao-bateria']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-tensao-bateria']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-tensao-bateria']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Tensão da bateria. Encontrado [     v]</td>
                                                </tr>


                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-canister']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-canister']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-canister']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Cânister de carvão ativado (se aplicável)</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-filtro-ar']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-filtro-ar']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-filtro-ar']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Filtro de ar</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-filtro-comb']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-filtro-comb']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-filtro-comb']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Filtro de combustível (motor diesel ou flex)</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-cca-2filtro-comb']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-cca-2filtro-comb']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-cca-2filtro-comb']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Filtro de combustível (2º filtro)(se aplicável)</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-4 px-2">

                                            <div className="icon-header my-1">
                                                <span>FLUÍDOS</span>
                                                <div className="icon">icon</div>
                                            </div>
                                            <table className="table checks">
                                                <tbody>
                                                <tr>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-oleomotor']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-oleomotor']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-oleomotor']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Óleo do motor</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-fluido-lavador']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-fluido-lavador']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-fluido-lavador']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Fluido do lavador de para-brisa</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-flu-arref']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-flu-arref']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-flu-arref']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Fluido  do sistema de arrefecimento do motor</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-flu-freio-emb']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-flu-freio-emb']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-flu-freio-emb']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Fluido de freio e embreagem</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-flu-transm']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-flu-transm']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-flu-transm']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Fluido de transmissão automática (se equipado com vareta de inspeção)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-oleo-transm-manu']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-oleo-transm-manu']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-oleo-transm-manu']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Óleo da transmissão manual</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-flu-dir-hid']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-flu-dir-hid']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-flu-dir-hid']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Fluido da direção hidráulica (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-oleo-cx-trans']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-oleo-cx-trans']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-oleo-cx-trans']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Óleo da caixa de tranferência (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-flu-oleo-dif-dt']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-flu-oleo-dif-dt']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-flu-oleo-dif-dt']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Óleo do diferencial dianteiro e traseiro (se aplicável)</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className="icon-header my-1">
                                                <span>EMBAIXO DO VEÍCULO</span>
                                                <div className="icon">icon</div>
                                            </div>
                                            <table className="table checks">
                                                <tbody>
                                                <tr>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-cx-dir']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-cx-dir']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-cx-dir']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Caixa de direção e barra de direção</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-tubula-sis-freio']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-tubula-sis-freio']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-tubula-sis-freio']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Tubulação do sistema de freio</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-vaza-oleo-agua']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-vaza-oleo-agua']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-vaza-oleo-agua']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Vazamentos de óleo, água, combustível e/ou outros fluidos</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-escapamento']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-escapamento']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-escapamento']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Escapamento</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-coifas']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-coifas']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-coifas']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Coifas dos eixos de tração</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-suspen-dt']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-suspen-dt']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-suspen-dt']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Suspensão dianteira e traseira</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-filtro-oleo']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-filtro-oleo']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-filtro-oleo']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Filtro de óleo</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-caniste-rav-4']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-caniste-rav-4']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-caniste-rav-4']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Cânister de carvão ativado (RAV4 - se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-limpeza-super']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-limpeza-super']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-limpeza-super']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Limpeza das superfícies dos cubos de roda, disco e tambor de freio e rodas</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-lubri-arv-transmiss']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-lubri-arv-transmiss']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-lubri-arv-transmiss']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Lubrificação da árvore de transmissão</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-juntas']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-juntas']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-juntas']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Juntas esféricas da suspensão e guarda-pó</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-parafusos']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-parafusos']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-parafusos']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Parafusso da árvore de transmissão</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-medidor']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-falta']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-falta']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Medidor de combustível - substituição a cada 72 meses (motor flex)</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-ev-filtro-succao']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-ev-filtro-succao']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-ev-filtro-succao']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                    <td>Filtro de succção da bomba de combustível - limpeza a cada 36 meses (motor flex)</td>
                                                </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-4 ps-1">
                                            <div className="icon-header my-1">
                                                <span>CALIBRAGEM DOS PNEUS •</span>
                                                <div className="icon">icon</div>
                                            </div>

                                            <table className="table checks">
                                                <thead>
                                                <tr>
                                                    <th/>
                                                    <th className="text-center">CALIBRADO</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td width={105}>DIANTEIRO ESQUERDO:</td>
                                                    <td className="text-end py-2">psi</td>
                                                </tr>
                                                <tr>
                                                    <td width={105}>DIANTEIRO DIREITO:</td>
                                                    <td className="text-end py-2">psi</td>
                                                </tr>
                                                <tr>
                                                    <td width={105}>TRASEIRO ESQUERDO:</td>
                                                    <td className="text-end py-2">psi</td>
                                                </tr>
                                                <tr>
                                                    <td width={105}>TRASEIRO DIREITO:</td>
                                                    <td className="text-end py-2">psi</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className="icon-header mb-1">
                                                <span>FREIOS •</span>
                                                <div className="icon">icon</div>
                                            </div>
                                            <table className="table checks last-checks">
                                                <thead>
                                                <tr>
                                                    <th/>
                                                    <th className="text-end">ENCONTRADO</th>
                                                    <th/>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td className="text-center" width={40} rowSpan={5}>
                                                        icon
                                                        <br />
                                                        PASTILHAS
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>DIANT. ESQUERDA:</td>
                                                    <td width={5}>mm</td>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-past-de']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-past-de']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-past-de']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>DIANT. DIREITA:</td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-past-dd']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-past-dd']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-past-dd']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. ESQUERDA:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-past-te']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-past-te']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-past-te']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. DIREITA:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-past-td']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-past-td']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-past-td']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table className="table checks last-checks">
                                                <thead>
                                                <tr>
                                                    <th/>
                                                    <th className="text-end">ENCONTRADO</th>
                                                    <th/>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td className="text-center" width={40} rowSpan={5}>
                                                        icon
                                                        <br />
                                                        DISCOS
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>DIANT. ESQUERDO:</td>
                                                    <td width={5}>mm</td>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-disc-de']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-disc-de']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-disc-de']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>DIANT. DIREITO:</td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-disc-dd']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-disc-dd']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-disc-dd']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. ESQUERDO:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-disc-te']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-disc-te']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-disc-te']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. DIREITO:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-disc-td']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-disc-td']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-disc-td']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table className="table checks last-checks">
                                                <thead>
                                                <tr>
                                                    <th/>
                                                    <th className="text-end">ENCONTRADO</th>
                                                    <th/>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td className="text-center" width={40} rowSpan={3}>
                                                        icon
                                                        <br />
                                                        LONAS
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. ESQUERDO:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td width={5}>mm</td>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-lona-te']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-lona-te']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-lona-te']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. DIREITO:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-lona-td']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-lona-td']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-lona-td']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table className="table checks last-checks">
                                                <tbody>
                                                <tr>
                                                    <td className="text-center" width={40} rowSpan={3}>
                                                        icon
                                                        <br />
                                                        TAMBORES
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. ESQUERDO:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td width={5}>mm</td>
                                                    <td width={5}>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-tambor-te']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-tambor-te']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-tambor-te']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        TRAS. DIREITO:
                                                        <br />
                                                        <span className="smallest">(se aplicável)</span>
                                                    </td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: checklistData['toy-fr-tambor-td']?.value.toString().toLowerCase() === 'ok' }} second={{ checked: checklistData['toy-fr-tambor-td']?.value.toString().toLowerCase() === 'requer troca / reparo futuro' }} third={{ checked: checklistData['toy-fr-tambor-td']?.value.toString().toLowerCase() === 'requer troca / reparo imediato' }}/>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Print;
