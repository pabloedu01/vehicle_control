import React  from 'react';
import {Dropdown} from "react-bootstrap";
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

      {(props.hasOwnProperty('actions') && props.actions.indexOf('duplicate') >= 0) ?
          (
              <Dropdown.Item>
                <div onClick={handleDuplicate}>
                  <i className={classNames('mdi mdi-content-copy', 'me-1')}/>
                  Duplicado
                </div>
              </Dropdown.Item>
          ) : null
      }

      {(props.extraButtons ?? []).map((button) =>
            <Dropdown.Item key={button.key}>
              <div onClick={() => {button.action(rowData.id)}}>
                <i className={classNames(button.icon, 'me-1')}/>
                {button.label}
              </div>
            </Dropdown.Item>
      )}

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
