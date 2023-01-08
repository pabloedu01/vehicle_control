import { Row, Col, Card, Table, Pagination, Button, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PageTitle from '../../../components/PageTitle';
import FormInput from '../../../components/FormInput';
import { useEffect, useState } from 'react';
// import { APICore } from 'helpers/api/apiCore';
import { FilterDropdown } from './FilterDropdown'
import { OrganizeDropdown } from './organizeDropdown'

// const api = new APICore();

const filterValues = [
    {
        title: 'Filtro 1',
        value: 'filter1',
        selected: false,
    },
    {
        title: 'Filtro 2',
        value: 'filter2',
        selected: false,
    },
    {
        title: 'Filtro 3',
        value: 'filter3',
        selected: false,
    },
    {
        title: 'Filtro 4',
        value: 'filter4',
        selected: false,
    },
    {
        title: 'Filtro 5',
        value: 'filter5',
        selected: false,
    }
]
const organizeValues = [
    {
        title: 'Número',
        value: 'numero',
        selected: false,
    },
    {
        title: 'Cliente',
        value: 'cliente',
        selected: false,
    },
    {
        title: 'Veículo',
        value: 'veiculo',
        selected: false,
    },
    {
        title: 'Chassi',
        value: 'chassi',
        selected: false,
    },

    {
        title: 'Responsável',
        value: 'responsavel',
        selected: false,
    },

    {
        title: 'Tipo Orçamento',
        value: 'tipo_orcamento',
        selected: false,
    },
    {
        title: 'Data',
        value: 'data',
        selected: false,
    },

]


const fakeData = [{
    id: 1,
    nome: 'Pablo'
}]

export default function EstimateList() {
    const [data, setData] = useState(fakeData) 
    const [openTagsSelected, setOpenTagsSelected] = useState(false) 
    const [filterTagsSelected, setFilterTagsSelected] = useState(filterValues) 
    const [organizeSelected, setOrganizeSelected] = useState(organizeValues) 
    
    const methods = useForm({
        defaultValues: {
            password: '12345',
            statictext: 'email@example.com',
            color: '#727cf5',
        },
    });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;
    
    useEffect(() => {
        // api.get('/grupo',null).then(res => setData(res.data))
    }, [])
    
    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Oficina', path: '/workshop/' },
                    {
                        label: 'Lista de orçamentos',
                        path: '/workshop/estimate/list',
                        active: true,
                    },
                ]}
                title={'Orçamentos'}
            />
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col sm={12} className="d-flex gap-1 pr-0">
                                    <FormInput
                                        type="text"
                                        name="search"
                                        placeholder="Procurar..."
                                        register={register}
                                        key="placeholder"
                                        errors={errors}
                                        control={control}
                                        style={{ minWidth: "150px"}}
                                    />
                                    <Button 
                                        variant="Primary"
                                        
                                        className="btn btn-primary d-flex d-flex align-content-center justify-content-center">
                                        <i className='mdi mdi-magnify search-icon'></i>
                                    </Button>
                                    <FilterDropdown filterValues={filterTagsSelected} handleFilterSelected={setFilterTagsSelected} />
                                    <OrganizeDropdown organizeValues={organizeSelected} setOrganizeSelected={setOrganizeSelected} />
                                </Col>
                            </Row>
                            <Row >
                                <div className='mt-1 mb-2' style={{ minHeight: '30px'}} >
                                    {filterTagsSelected.length > 0 && filterTagsSelected.map(item => {
                                        return item.selected === true  ? (
                                            <Badge bg="" key={item.title + Math.random()} className="me-1 badge-dark-lighten badge">
                                                {item.title}
                                            </Badge>
                                        ) : null
                                    })}
                                </div>
                            </Row>
                            <h4 className="header-title mb-2">Lista de orçamentos</h4>
                            {/* <p className="text-muted font-14">
                                Add <code>hover</code> attribute to enable a hover state on table rows
                            </p> */}

                            <Table responsive="md" size="sm" hover className="mb-0" >
                                <thead >
                                    <tr>
                                        <th>Numero</th>
                                        <th>Cliente</th>
                                        <th>Veículo</th>
                                        <th>Chassi</th>
                                        <th>Responsável</th>
                                        <th>Tipo Orçamento</th>
                                        <th>Data</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {data?.map((record, index) => {
                                        return (
                                            <tr key={index.toString()} onClick={() => console.log('click')}>
                                                <th >{record.id}</th>
                                                <td>{record.nome}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                            <Row>
                                <Col className='d-flex align-content-center justify-content-center'>
                                    <Pagination>
            
                                        <Pagination.Prev>
                                            anterior
                                        </Pagination.Prev>
                                        <Pagination.Item onClick={() => console.log('click')}>{1}</Pagination.Item>
                                        <Pagination.Ellipsis />

                                        <Pagination.Item active onClick={() => console.log('click')}>{2}</Pagination.Item>
                                        <Pagination.Ellipsis />
                                        <Pagination.Item onClick={() => console.log('click')}>{3}</Pagination.Item>
                                        
                                        <Pagination.Next>
                                            proxima
                                        </Pagination.Next>
                                    </Pagination>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
