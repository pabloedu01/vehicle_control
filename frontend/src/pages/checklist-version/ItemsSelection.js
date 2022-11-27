// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate} from "react-router-dom";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import '../../assets/scss/custom/ChecklistVersionItemsSelection.scss'

const api = new APICore();

const ItemsTable = (props: { list: any[], name: string, provided: any, index?: any, isLast?: boolean, onMove?: any }) => {

    const onMove = (newDirection) => {
        if(props.index !== undefined && props?.onMove){
            props.onMove(props.index + 1, newDirection);
        }
    };

    return <Row className="list-box mb-3">
        <Col xs={12}>
            <h2 className="text-center">
                {props.name}
                {props.index !== undefined && props?.onMove ?
                    <div className="float-right">
                        {props.index !== 0 ?
                            <span className="cursor-pointer" onClick={() => {onMove('up');}}><i className="mdi mdi-arrow-up-circle text-success"/></span>
                            :
                            null
                        }
                        {props?.isLast !== true ?
                            <span className="cursor-pointer" onClick={() => {onMove('down');}}><i className="mdi mdi-arrow-down-circle text-primary"/></span>
                            :
                            null
                        }
                    </div> :
                    null
                }
            </h2>
        </Col>
        <Col xs={12} className="table-container">
            <Row className="table-header">
                <Col xs={5}>
                    Item
                </Col>
                <Col xs={5}>
                    Type
                </Col>
                <Col xs={2}>

                </Col>
            </Row>

            {(props.list).map((checklistItem, index) => (
                <Draggable key={checklistItem.id} draggableId={checklistItem.id + ''} index={index}>
                    {(provided, snapshot) => (
                        <Row
                            className="table-row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <Col xs={5}>
                                {checklistItem.name} {checklistItem.code ? '(' + checklistItem.code + ')' : ''}
                            </Col>
                            <Col xs={5}>
                                {checklistItem.type}
                            </Col>
                            <Col xs={2}>

                            </Col>
                        </Row>
                    )}
                </Draggable>
            ))}

            {props.provided.placeholder}
        </Col>
    </Row>
};

const ItemsSelection = (props: {company?: any, id?: any, onChange?: any}): React$Element<React$FragmentType> => {
    const [list, setList] = useState({
        'available': {id: 0, list: [], name: 'Available'},
    });
    const [showModal, setShowModal] = useState(false);
    const [formStage, setFormStage] = useState(null);

    const getDataList = () => {
        if(props?.id){
            api.get('/checklist-version/' + props.id + '/stages').then((response) => {
                const localList = {'available': {...list.available, list: response.data.data.available.map((checklistItem) => {
                            return {
                                id: checklistItem.id,
                                code: checklistItem.code,
                                name: checklistItem.name,
                                type: checklistItem?.validation?.type ?? ''
                            };
                        })}};

                response.data.data.stages.forEach((stage) => {
                    localList['stage-' + stage.id] = {...stage, list: stage.list.map((checklistItem) => {
                            return {
                                id: checklistItem.id,
                                code: checklistItem.code,
                                name: checklistItem.name,
                                type: checklistItem?.validation?.type ?? ''
                            };
                        })}
                });

                setList(localList);
            },(error) => {
                setList({'available': {...list.available, list: []}});
            });
        } else {
           api.get('/checklist-item/active-checklist-items').then((response) => {
               setList({'available': {...list.available, list: response.data.data.map((checklistItem) => {
                           return {
                               id: checklistItem.id,
                               code: checklistItem.code,
                               name: checklistItem.name,
                               type: checklistItem?.validation?.type ?? ''
                           };
                       })}});
           },(error) => {
               setList({'available': {...list.available, list: []}});
           });
        }
    };

    const getList = (key) => list[key].list;

    const reorder = (list, startIndex, endIndex) => {
        const newList = Array.from(list);
        const [removed] = newList.splice(startIndex, 1);
        newList.splice(endIndex, 0, removed);

        return newList;
    };

    const move = (originList, destinationList, origin, destination) => {
        const originListClone = Array.from(originList);
        const destinationListClone = Array.from(destinationList);
        const [removed] = originListClone.splice(origin.index, 1);
        destinationListClone.splice(destination.index, 0, removed);

        return {
            [origin.droppableId]: {...list[origin.droppableId], list: originListClone},
            [destination.droppableId]: {...list[destination.droppableId], list: destinationListClone}
        };
    };

    const moveStage = (currentIndex, newDirection) => {
        const newList = {};
        const newOrder = reorder(Object.keys(list), currentIndex, newDirection === 'down' ? (currentIndex + 1) : (currentIndex - 1));

        newOrder.forEach((key) => {
            newList[key] = list[key];
        });

        setList(newList);
    };

    const onDragEnd = (data) => {
        const { source: origin, destination } = data;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (origin.droppableId === destination.droppableId) {
            setList({...list,[origin.droppableId]: {...list[origin.droppableId], list: reorder(getList(origin.droppableId), origin.index, destination.index)}});
        } else {
            setList({...list, ...move(getList(origin.droppableId), getList(destination.droppableId), origin, destination)});
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const createStage = () => {
        setFormStage(null);
        setShowModal(true);
    };

    const editStage = (stage) => {
        setFormStage(stage);
        setShowModal(true);
    };

    const saveStage = () => {
        setShowModal(false);

        const data = formStage;

        if(!formStage?.id){
            data.id = (new Date()).getTime();
            data.list = [];
            data.isNew = true;
        }

        setList({...list, ['stage-' + data.id]: data});
        setFormStage(null);
    };

    useEffect(() => {
        getDataList();
    }, [props?.id]);

    useEffect(() => {
        if(props?.onChange){
            props?.onChange(Object.keys(list).filter((key) => key !== 'available').map((key) => list[key]));
        }
    }, [list]);

    return (
        <>
            <Modal show={showModal} onHide={toggleModal} centered={true} size="md" >
                <Modal.Header onHide={toggleModal} closeButton>
                    <h4 className="modal-title">{formStage?.id ? 'Editar Stage' : 'Agregar Stage'}</h4>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Digite nome"
                        name="stageName"
                        id="stageName"
                        value={formStage?.name ?? ''}
                        onChange={(e) => { setFormStage(formStage ? {...formStage, name: e.target.value} : {name: e.target.value}) }}
                    >
                    </Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={toggleModal}>
                        Encerrar
                    </Button>{' '}
                    <Button variant="primary" onClick={saveStage}>
                        Cadastro
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Col xs={6}>
                        <Droppable droppableId="available">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}>
                                    <ItemsTable list={list.available.list} name={list.available.name} provided={provided}/>
                                </div>
                            )}
                        </Droppable>
                    </Col>

                    <Col xs={6}>
                        <span className="d-flex justify-content-center">
                            <OverlayTrigger placement="left" overlay={<Tooltip>Novo Stage</Tooltip>}>
                              <i className="mdi mdi-plus-circle text-primary mdi-48px cursor-pointer" onClick={createStage}/>
                            </OverlayTrigger>
                        </span>

                        {(Object.keys(list).filter((key) => key !== 'available').map((key) => list[key])).map((stage, index) => (
                            <Droppable key={stage.id} droppableId={'stage-' + stage.id}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef}>
                                        <ItemsTable
                                            list={stage.list}
                                            name={stage.name}
                                            provided={provided}
                                            index={index}
                                            isLast={index === (Object.keys(list).length - 2)}
                                            onMove={moveStage}
                                        />
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </Col>
                </DragDropContext>


            </Row>
        </>
    );
};

export default ItemsSelection;
