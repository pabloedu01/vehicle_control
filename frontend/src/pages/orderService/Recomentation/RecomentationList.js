import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import swal from "sweetalert";
import { Button, Card, Col, DropdownButton, InputGroup, OverlayTrigger, Row, Dropdown, Tooltip, Form } from "react-bootstrap";
import Actions from "../../../components/table/actions";
import Table from '../../../components/Table';
import PageTitle from "../../../components/PageTitle";
import TABLE_OPTIONS from "../../../constants/tableOptions";

export default function RecomentationList() {
  const history = useNavigate();
    const [list, setList] = useState([]);
    const [searchType, setSearchType] = useState(null);
    const [search, setSearch] = useState(null);

    const [tableFields, setTableFields] = useState([]);
    const [tableOptions, setTableOptions] = useState({});

    const columns = [
        {
            Header: 'ID',
            accessor: 'id',
            sort: true,
            display: false,
        },
        {
            Header: 'Nome',
            accessor: 'name',
            sort: false,
        },
        {
            Header: 'Veículo',
            accessor: 'vehicle',
            sort: false,
        },
        {
            Header: 'Revisão',
            accessor: 'revision',
            sort: true,
        },
        {
            Header: 'Modelo do veículo',
            accessor: 'vehicle_model',
            sort: false,
        },
        {
            Header: 'Tipo de OS',
            accessor: 'os_type',
            sort: false,
        },
        {
            Header: 'Data de criação',
            accessor: 'created_at',
            sort: false,
        },
        {
            Header: 'Ações',
            accessor: 'actions',
            sort: false,
        },
    ];

  
    
    const getList = () => {
        let filter;

        if(search && searchType){
            filter = {};
            filter[searchType] = search;
        }

        // api.get('/service-schedule', Object.assign({company_id:2}, filter ? filter : {})).then((response) => {
            setSearchType(null);setSearch(null);
      setList(
        // response.data.data.map((item) => {
                [{
                    id: '1',
                    name: 'nome Test',
                    vehicle: 'test veículo',
                    revision: 'test Revisao',
                    vehicle_model: 'Teste Veículo modelo',
                    os_type: 'Teste Veículo modelo',
                    created_at: moment().utc(true).format('DD/MM/YYYY HH:mm'),
                    actions: <div>
                    {/* <OverlayTrigger placement="left" overlay={<Tooltip>Editar</Tooltip>}>
                        <span className="cursor-pointer" onClick={()=>onEdit(item.id)}><i className="mdi mdi-square-edit-outline mdi-24px"/></span>
                   </OverlayTrigger> */}
                   <OverlayTrigger placement="left" overlay={<Tooltip>Excluir</Tooltip>}>
                      <span className="cursor-pointer" onClick={() => deleteItem(1)}><i className="mdi mdi-trash-can-outline mdi-24px"/></span>
                  </OverlayTrigger>
                  </div>
                }]
            );
        // }, () => {
        //     setList([]);
        // })
    };

    const onEdit = (id) => {
        // history(`/panel/company/${props.company?.id}/service-schedules/${id}/edit`);
    };


    const deleteItem = (registerId, newList) => {
        swal({
            title: 'Você tem certeza!',
            text: 'Irá excluir este registro',
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: {
                    text: 'Excluir',
                    value: 'confirm'
                }
            },
            dangerMode: true,
        }).then((confirm) => {
            if(confirm){
                // api.delete('/service-schedule/' + registerId).then((response) => {
                //    getList();
                // }, () => {

                // });
            }
        });
    };
    const onChecklist = (registerId) => {
        // history(`/panel/company/${props.company?.id}/service-schedules/${registerId}/checklist`);
    };



    useEffect(() => {
        getList();
        
        setTableFields([
            {
                label: 'ID',
                name: 'id',
                options: {
                    filter: true,
                    sort: true,
                    display: false
                },
            },
            {
                label: 'Nome',
                name: 'name',
                options: {
                    filter: true,
                    sort: true,
                    display: false
                },
            },
            {
                label: 'Veículos',
                name: 'vehicle',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Revisão',
                name: 'revision',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Modelo do veículo',
                name: 'vehicle_model',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Tipo de OS',
                name: 'os_type',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Data de criação',
                name: 'created_at',
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                label: 'Ações',
                name: 'actions',
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <Actions
                            tableMeta={tableMeta}
                            handleEdit={onEdit}
                            handleDelete={() => console.log('delete')}
                        />
                    )
                },
            },
        ]);

        setTableOptions(Object.assign(TABLE_OPTIONS, {

        }));

        /*document.querySelectorAll('.MuiToolbar-root.MuiToolbar-gutters button.MuiButtonBase-root[aria-label=Search]').forEach(function(element){
            element.click();
        });*/
    }, []);
    const shoot = () => {
        alert("Great Shot!");
      }
      const [data, setData] = useState('');
      const childToParent = (childdata) => {
        setData(childdata);
        onEdit(childdata)
      }
      const detectClick = (e) => {
        if (e.target?.nodeName === "TD") {
            const code =   (e.target?.parentNode?.innerText).split('	')[0]
            onEdit(code);
        } else {
            return
        }
    }
    return (
        <>
            <PageTitle
          breadCrumbItems={[
                    { label: 'Cadastros', path: '/cadastros', active: true },
                    { label: 'Ordem de serviço', path: '/order-service', active: true },
                    { label: 'Recomendações', path: '/order-service/recomentation/list' },
                    { label: 'Lista', path: '/service-schedules/list', active: true },
                ]}
                title={'Recomendações'}
                company={'props?.company'}
            />

            <Row>
                <Col xl={12}>
                    <div className="text-end mt-xl-0 mt-2">
                        <Button variant="danger" className="mb-2 me-2" onClick={() => { history(`/panel/company/${2}/order-service/recomentation/create`) }}>
                            <i className="mdi mdi-basket me-1" /> Nova recomendação
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col xl={6}>
                                    <InputGroup className="mb-3">
                                        <Form.Control onChange={(e) => {setSearch(e.target.value);} } aria-label="Text input with dropdown button" />

                                            <DropdownButton
                                                variant="outline-secondary"
                                                title={searchType ?? 'Seleccione'}
                                                id="input-group-dropdown-2"
                                                align="end"
                                            >
                                                <Dropdown.Item onClick={() => {setSearchType('chassi')}} href="#">Chassi</Dropdown.Item>
                                                <Dropdown.Item onClick={() => {setSearchType('plate')}} href="#">Placa</Dropdown.Item>
                                                <Dropdown.Item onClick={() => {setSearchType('client_name')}} href="#">Cliente</Dropdown.Item>
                                            </DropdownButton>
                                        </InputGroup>
                                </Col>
                                <Col xl={2}>
                                    <div className="text-xl-start text-xs-end mt-xl-0 mt-2">
                                        <Button variant="primary" className="mb-2" onClick={() => { getList(); }}>
                                            <i className="mdi mdi-search-web" /> Buscar
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {/* <MUIDataTable data={list} columns={tableFields} options={tableOptions}/> */}
                                    <div 
                                        onClick={(e) => detectClick(e)}
                                        >
                                    <Table
                                            columns={columns}
                                            data={list}
                                            pageSize={5}
                                            sizePerPageList={TABLE_OPTIONS.sizePerPageList}
                                            isSortable={true}
                                            pagination={true}
                                            isSearchable={false}
                                            isSelectable={false}
                                            // isSearchable={true}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
      </>
    );
}