import { MultiSelectWithSearch } from '../../../components/MultiSelectWithSearch'
import { Row, Col, Card, Button } from 'react-bootstrap';
import PageTitle from "../../../components/PageTitle";
import { FormInput } from '../../../components';
import { useForm } from 'react-hook-form';


export default function OsTypeCreate() {
    const methods = useForm({
      defaultValues: {
        name: '',
        vehicle: '',
        mantenanceReview: '',
        vehicleModel: '',
        claimService: '',
        osType: ''
      },
     });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'Cadastros', path: '/cadastros', active: true },
          { label: 'Ordem de serviço', path: '/order-service', active: true },
          { label: 'Tipos de OS', path: '/order-service/os-type' },
          { label: 'Cadastro de tipos de OS', path: '/order-service/os-type/create', active: true },
        ]}
        title={'Cadastro de tipos de OS'}
      />
      <Row>
        <Col>
          <Row>
            <Col>
                <Card>
                <Card.Body className='pb-4'>
                  <Row>
                    <Col>
                      <FormInput
                            label="Nome"
                            type="text"
                            name="name"
                            containerClass={'mb-3'}
                            register={register}
                            key="text"
                            errors={errors}
                            control={control}
                        />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormInput
                          name="code"
                          label="Código"
                          type="text"
                          containerClass={'mb-3'}
                          register={register}
                          key="text"
                          errors={errors}
                          control={control}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className='d-flex align-items-center justify-content-end'>
                      <Button className='px-4' variant='primary'>Salvar</Button>
                    </Col>
                  </Row>
                </Card.Body>
                </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </>
  )
}