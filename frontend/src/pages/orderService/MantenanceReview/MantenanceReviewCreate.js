import { MultiSelectWithSearch } from '../../../components/MultiSelectWithSearch'
import { Row, Col, Card, Button } from 'react-bootstrap';
import PageTitle from "../../../components/PageTitle";
import { FormInput } from '../../../components';
import { useForm } from 'react-hook-form';

export default function MantenanceReviewCreate() {
    const methods = useForm({
      defaultValues: {
        name: '',
        vehicleModel: '',
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
                    { label: 'Revisões', path: '/order-service/mantenance-review/list' },
                    { label: 'Criar', path: '/service-schedules/mantenance-review/list', active: true },
        ]}
        title={'Cadastro de Revisões'}
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
                          name="vehicleModel"
                          label="Modelo do veículo"
                          type="select"
                          containerClass="mb-3"
                          className="form-select"
                          register={register}
                          key="select"
                          errors={errors}
                          control={control}
                          options={[
                            {
                                value: 'one',
                                label: 'one'
                            }, {
                                value: 'two',
                                label: 'two'
                            },
                          ]}
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