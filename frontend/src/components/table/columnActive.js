import React from 'react';
import {Badge} from "react-bootstrap";
import classNames from "classnames";

const Active = (props: {value: boolean, tableMeta: any}) => {
  return (
      props.value === true ?
          <Badge bg="" className={classNames('me-1', 'bg-success', 'rounded-pill')} key={props.tableMeta.rowIndex}>Ativo</Badge> :
          <Badge bg="" className={classNames('me-1', 'bg-danger', 'rounded-pill')} key={props.tableMeta.rowIndex}>Não Ativo</Badge>
  )
};

export default Active;
