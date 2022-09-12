import React  from 'react';
import {Dropdown, OverlayTrigger, Tooltip} from "react-bootstrap";
import classNames from "classnames";

const Actions = (props: {tableMeta: any, actions?: Array<string>, handleEdit?: any, handleDelete?: any, handleDuplicate?: any, extraButtons?: Array<any>}) => {
  const rowData = props.tableMeta.tableData[props.tableMeta.rowIndex];

  const handleEdit = () => {
    props.handleEdit(rowData.id);
  };

  const handleDuplicate = () => {
    props.handleDuplicate(rowData.id);
  };

  const handleDelete = () => {
    props.handleDelete(rowData.id, [...props.tableMeta.tableData.filter((item) => item.id !== rowData.id)]);
  };

  return <>
        {(!props.hasOwnProperty('actions') || props.actions.indexOf('edit') >= 0) ?
            (
                <OverlayTrigger placement="left" overlay={<Tooltip>Editar</Tooltip>}>
                  <span className="cursor-pointer" onClick={handleEdit}><i className="mdi mdi-square-edit-outline mdi-24px"/></span>
                </OverlayTrigger>
            ) : null
        }

        {(props.hasOwnProperty('actions') && props.actions.indexOf('duplicate') >= 0) ?
            (
                <OverlayTrigger placement="left" overlay={<Tooltip>Duplicado</Tooltip>}>
                  <span className="cursor-pointer" onClick={handleDuplicate}><i className="mdi mdi-content-copy mdi-24px"/></span>
                </OverlayTrigger>
            ) : null
        }

        {(props.extraButtons ?? []).map((button) =>
          !button.hasOwnProperty('condition') || button.condition(rowData) ?
              (
                  <OverlayTrigger  key={button.key} placement="left" overlay={<Tooltip>{button.label}</Tooltip>}>
                    <span className="cursor-pointer" onClick={() => {button.action(rowData.id, rowData)}}><i className={classNames(button.icon, 'mdi-24px')}/></span>
                  </OverlayTrigger>
              )
              : null
        )}

        {(!props.hasOwnProperty('actions') || props.actions.indexOf('delete') >= 0) ?
            (
                <OverlayTrigger placement="left" overlay={<Tooltip>Excluir</Tooltip>}>
                  <span className="cursor-pointer" onClick={handleDelete}><i className="mdi mdi-trash-can-outline mdi-24px"/></span>
                </OverlayTrigger>
            ) : null
        }
      </>
};

export default Actions;
