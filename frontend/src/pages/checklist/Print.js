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

const Print = (props: { company?: any }): React$Element<React$FragmentType> => {
    const history = useNavigate();
    const { id, type, checklistId, token } = useParams();
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
        if (id) {
            let ajaxCall;

            switch (type) {
                case 'service-schedules':
                    ajaxCall = api.get('/vehicle-service/' + checklistId);
                    break;
            }

            ajaxCall.then(
                (response) => {
                    switch (type) {
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
        getData();
    }, [id, type, checklistId]);

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Checklist', path: `/${type}/${id}/checklist` },
                    { label: 'Imprimir', path: `/${type}/${id}/checklist/${checklistId}/print`, active: true },
                ]}
                title={'Checklist'}
                company={props?.company}
            />

            <Row className="print-checklist">
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
                                                            <div className="icon">icon</div>
                                                        </div>
                                                        <div className="row text-center pt-1 fw-700 small">
                                                            <div className="col round-2 b-1 mx-5">Sim</div>
                                                            <div className="col round-2 b-1 mx-5">Não</div>
                                                        </div>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['1']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['1']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['2']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['2']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['3']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['3']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['4']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['4']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['5']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['5']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['6']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['6']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['7']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['7']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="blue-slots">
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['8']?.value ?? ''}</span></div>
                                                        </div>
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['9']?.value ?? ''}</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="row three-checkboxes">
                                                        <div className={classNames({checked: checklistData['10']?.value.toString().toLowerCase() === 'boa' })}/> Boa
                                                        <div className={classNames({checked: checklistData['10']?.value.toString().toLowerCase() === 'regular' })}/> Regular
                                                        <div className={classNames({checked: checklistData['10']?.value.toString().toLowerCase() === 'ruim' })}/> Ruim
                                                    </div>
                                                    <div className="form-slot"/>
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
                                                        <div className={classNames({checked: checklistData['99']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['99']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['100']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['100']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['101']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['101']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['102']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['102']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['103']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['103']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['104']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['104']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="row two-checkboxes">
                                                        <div className={classNames({checked: checklistData['105']?.value.toString() === '1' })}/>
                                                        <div className={classNames({checked: checklistData['105']?.value.toString() === '0' })}/>
                                                    </div>
                                                    <div className="blue-slots">
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['106']?.value ?? ''}</span></div>
                                                        </div>
                                                        <div>
                                                            <div className="form-slot"><span className="text-black">{checklistData['107']?.value ?? ''}</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="row three-checkboxes">
                                                        <div className={classNames({checked: checklistData['108']?.value.toString().toLowerCase() === 'boa' })}/> Boa
                                                        <div className={classNames({checked: checklistData['108']?.value.toString().toLowerCase() === 'regular' })}/> Regular
                                                        <div className={classNames({checked: checklistData['108']?.value.toString().toLowerCase() === 'ruim' })}/> Ruim
                                                    </div>
                                                    <div className="form-slot"/>
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
                                                                <td>{checklistData['91']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    ______(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Traseiro Esquerdo</td>
                                                                <td>{checklistData['93']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    ______(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Dianteiro Direito</td>
                                                                <td>{checklistData['92']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    ______(mm) <TripleSquareCheck />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Dianteiro Direito</td>
                                                                <td>{checklistData['94']?.value ?? ''}</td>
                                                                <td className="text-end">
                                                                    ______(mm) <TripleSquareCheck />
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
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Kit Multimídia / Sistema de áudio</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Far6is de Neblina</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Friso Lateral</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Bandeja de porta-malas</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Sensor de estacionamento</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Macaneta cromada</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Soleira</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Aplique cromado</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Calha de chuva</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Roda 16"</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Alto-falante dianteiro</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Porca antifurto da roda</td>
                                                                <td/>
                                                                <td/>
                                                                <td/>
                                                            </tr>
                                                            <tr>
                                                                <td>Radio 2 DIN com Bluetooh</td>
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
                                                            Pintura/Carroçaria: <hr className="bottom-line" />
                                                        </div>
                                                        <div>
                                                            Para-brisa: <hr className="bottom-line" />
                                                        </div>
                                                        <div>
                                                            Assinatura Estofamento: <hr className="bottom-line" />
                                                        </div>
                                                        <div>
                                                            Cliente deseja trocar o veículo?
                                                            <hr className="bottom-line" />
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
                                                    Veículo oriundo de guincho/plataforma: ( &nbsp; ) Sim &nbsp; (
                                                    &nbsp; ) Nao
                                                </p>
                                                Pertences pessoais:
                                                <br /> ( &nbsp; ) Cliente retira &nbsp; ( &nbsp; ) Recolher e
                                                guardar &nbsp; ( &nbsp; ) No veículo
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-slot">
                                                <label>Observações:</label>
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
                                                    Data: ____ / ____ /________ &nbsp; Hora: ____ : ____
                                                </p>
                                                <span className="signature px-4 small">
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
                                                    Data: ____ / ____ /________ &nbsp; Hora: ____ : ____
                                                </p>
                                                <span className="signature px-4 small">
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
                                                <div className="icon">icon</div>
                                            </div>
                                            <table className="table checks">
                                                <tbody>
                                                <tr>
                                                    <td width={5}>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Relógio e computador de bordo</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck third={{ checked: true }} />
                                                    </td>
                                                    <td>Luzes do painel e de cortesia</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Lavadores e limpadores</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Ventilador / Desembaçadores</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Retrovisor e para-sóis</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Buzina</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck third={{ checked: true }} />
                                                    </td>
                                                    <td>Volante e coluna de direção</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Aquecedor elétrico dos bancos (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Ar-condicionado</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Rádio / Multimídia</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Bancos e cintos de segurança</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Vidros e trava elétrica</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Freios de estacionamento</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Pedal de freio</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck third={{ checked: true }} />
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
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Iluminação dianteira e traseira</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Tampa do tanque de combustível</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
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
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Vazamentos de óleo, água, combustível e/ou outros fluídos</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Correias de acionamento</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Folga das válvulas (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>velas de ignição (conforme ano/modelo do veículo)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>condições da bateria</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Tensão da bateria. Encontrado [     v]</td>
                                                </tr>


                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Cânister de carvão ativado (se aplicável)</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Filtro de ar</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Filtro de combustível (motor diesel ou flex)</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck first={{ checked: true }} />
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
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Óleo do motor</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Fluido do lavador de para-brisa</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Fluido  do sistema de arrefecimento do motor</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Fluido de freio e embreagem</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Fluido de transmissão automática (se equipado com vareta de inspeção)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Óleo da transmissão manual</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Fluido da direção hidráulica (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Óleo da caixa de tranferência (se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck first={{ checked: true }} />
                                                    </td>
                                                    <td>Caixa de direção e barra de direção</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck second={{ checked: true }} />
                                                    </td>
                                                    <td>Tubulação do sistema de freio</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Vazamentos de óleo, água, combustível e/ou outros fluidos</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Escapamento</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Coifas dos eixos de tração</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Suspensão dianteira e traseira</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Filtro de óleo</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Cânister de carvão ativado (RAV4 - se aplicável)</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Limpeza das superfícies dos cubos de roda, disco e tambor de freio e rodas</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Lubrificação da árvore de transmissão</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Juntas esféricas da suspensão e guarda-pó</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Parafusso da árvore de transmissão</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
                                                    </td>
                                                    <td>Medidor de combustível - substituição a cada 72 meses (motor flex)</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>DIANT. DIREITA:</td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>DIANT. DIREITO:</td>
                                                    <td>mm</td>
                                                    <td>
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
                                                        <TripleSquareCheck />
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
