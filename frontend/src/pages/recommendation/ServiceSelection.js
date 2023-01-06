// @flow
import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate} from "react-router-dom";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import '../../assets/scss/custom/ChecklistVersionItemsSelection.scss'

const api = new APICore();

const ServicesSelection = (props: {company?: any, available: any[], selected: any[], onChange?: any}): React$Element<React$FragmentType> => {
    const [available, setAvailable] = useState([]);
    const [selected, setSelected] = useState([]);

    const handleChangeValue = (id,value) => {
        setSelected(selected.map((item) => {
                if(item.id === id){
                    item.value = value;
                }

                return item;
            }
        ));
    };

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
            [origin.droppableId]: originListClone,
            [destination.droppableId]: destinationListClone
        };
    };

    const onDragEnd = (data) => {
        const { source: origin, destination } = data;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (origin.droppableId === destination.droppableId) {
            if(origin.droppableId === 'available'){
                setAvailable(reorder(available, origin.index, destination.index));
            } else {
                setSelected(reorder(selected, origin.index, destination.index));
            }
        } else {
            const data = move(origin.droppableId === 'available' ? available : selected, destination.droppableId === 'available' ? available : selected, origin, destination);

            setAvailable(data.available.map((item) => {
                delete item.value;

                return item;
            }));
            setSelected(data.selected);
        }
    };

    useEffect(() => {
        const selectedIds = props?.selected.map((item) => item.id);

        setAvailable((props?.available ?? []).filter((item) => {
            return selectedIds.indexOf(item.id) < 0;
        }));
    }, [props?.available]);

    useEffect(() => {
        if((props?.selected ?? []).map((item) => item.id + (item?.value ?? '')).sort().join(',') !== (selected ?? []).map((item) => item.id + (item?.value ?? '')).sort().join(',')){
            setSelected(props?.selected);
        }
    }, [props?.selected]);

    useEffect(() => {
        if(props?.onChange){
            props?.onChange(Object.keys(selected).map((key) => selected[key]));
        }
    }, [selected]);

    return (
        <>
            <Row>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Col xs={6}>
                        <Droppable droppableId="available">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}>
                                    <Row className="list-box mb-3">
                                        <Col xs={12}>
                                            <h2 className="text-center">
                                                Available
                                            </h2>
                                        </Col>
                                        <Col xs={12} className="table-container">
                                            <Row className="table-header">
                                                <Col xs={12}>
                                                    Service
                                                </Col>
                                            </Row>

                                            {(available).map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Row
                                                            className="table-row"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                            <Col xs={12}>
                                                                {item.name}
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </Draggable>
                                            ))}

                                            {provided.placeholder}
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Droppable>
                    </Col>

                    <Col xs={6}>
                        <Droppable droppableId='selected'>
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}>
                                    <Row className="list-box mb-3">
                                        <Col xs={12}>
                                            <h2 className="text-center">
                                                Seleccionados
                                            </h2>
                                        </Col>
                                        <Col xs={12} className="table-container">
                                            <Row className="table-header">
                                                <Col xs={9}>
                                                    Service
                                                </Col>
                                                <Col xs={3}>
                                                    Cantidad
                                                </Col>
                                            </Row>

                                            {(selected).map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Row
                                                            className="table-row"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                            <Col xs={9}>
                                                                {item.name}
                                                            </Col>
                                                            <Col xs={3}>
                                                                <input type="text" style={{width: '100%'}} onChange={(e) => {
                                                                    handleChangeValue(item.id, e.target.value);
                                                                }} value={item?.value ?? ''}/>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </Draggable>
                                            ))}

                                            {provided.placeholder}
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Droppable>
                    </Col>
                </DragDropContext>


            </Row>
        </>
    );
};

export default ServicesSelection;
