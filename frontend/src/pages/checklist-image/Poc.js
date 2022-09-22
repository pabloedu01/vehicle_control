// @flow
import React, {useEffect, useState} from 'react';
import PageTitle from "../../components/PageTitle";
import {Button, Card, Col, Row} from "react-bootstrap";
import {APICore} from "../../helpers/api/apiCore";
import {useNavigate} from "react-router-dom";
import { Stage, Layer, Text } from 'react-konva';

const api = new APICore();

const List = () => {
    const history = useNavigate();
    const [list, setList] = useState([]);



    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Lista de verificação', path: '/panel/checklist-items/list' },
                    { label: 'Itens', path: '/panel/checklist-items/list', active: true },
                ]}
                title={'Lista de verificação'}
                insideCompany={false}
            />

            <Row>
                
            </Row>
        </>
    );
};

export default List;
