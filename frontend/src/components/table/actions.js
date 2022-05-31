import React, { useEffect, useState } from 'react';
import {Dropdown} from "react-bootstrap";
import classNames from "classnames";

const Actions = (props: {tableMeta: any, actions?: Array<string>, handleEdit?: any, handleDelete?: any}) => {
  const rowData = props.tableMeta.tableData[props.tableMeta.rowIndex];

  const handleEdit = () => {
    props.handleEdit(rowData.id);
  };

  const handleDelete = () => {
    props.handleDelete(rowData.id, [...props.tableMeta.tableData.filter((item) => item.id !== rowData.id)]);
  };

  return <Dropdown>
    <Dropdown.Toggle variant="link" className="arrow-none card-drop">
      <i className={classNames('mdi mdi-dots-horizontal')} />
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {(!props.hasOwnProperty('actions') || props.actions.indexOf('edit') >= 0) ?
      (
          <Dropdown.Item>
            <div onClick={handleEdit}>
              <i className={classNames('mdi mdi-square-edit-outline', 'me-1')}/>
              Editar
            </div>
          </Dropdown.Item>
      ) : null
      }

      {(!props.hasOwnProperty('actions') || props.actions.indexOf('delete') >= 0) ?
      (
          <>
            <Dropdown.Divider as="div" />
            <Dropdown.Item className={classNames('text-danger')}>
              <div onClick={handleDelete}>
                <i className={classNames('mdi mdi-trash-can-outline', 'me-1')}/>
                Excluir
              </div>
            </Dropdown.Item>
          </>
      ) : null
      }

    </Dropdown.Menu>
  </Dropdown>
};

export default Actions;
