import { MultiSelectWithSearch } from '../../components/MultiSelectWithSearch'
import { Row, Col, Card } from 'react-bootstrap';
import PageTitle from "../../components/PageTitle";
import { FormInput } from '../../components';
import { useForm } from 'react-hook-form';


const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
    added: false,
});

const dataServices = [
    createOption('One'),
    createOption('Two'),
    createOption('Three'),
    createOption('four'),
    createOption('Five'),
    createOption('Six'),
];
const dataMantenanceReview = [
    createOption('One'),
    createOption('Two'),
    createOption('Three'),
    createOption('four'),
    createOption('Five'),
    createOption('Six'),
];

export default function Recomentation() {
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
          { label: 'Recomendações', path: '/recomentation' },
          // { label: 'Form Elements', path: '/forms/basic', active: true },
        ]}
        title={'Recomendações'}
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
                    <Col xs={6}>
                      <FormInput
                          name="vehicle"
                          label="Veículo"
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
                    <Col xs={6}>
                      <FormInput
                        label="Manutenção"
                        name="mantenanceReview"
                        type="select"
                        containerClass="mb-3"
                        className="form-select"
                        register={register}
                        key="select"
                        errors={errors}
                        control={control}
                        placeholder='selecione uma opção'
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
                  
                </Card.Body>
                </Card>
            </Col>
          </Row>
          <Row>
            <Col>
                <Card>
                <Card.Body className='pb-4'>
                  <h4 className="header-title mb-3 d-flex icon-align-center justify-content-center">Tipos de OS</h4>
                  <Row>
                    <Col>
                      <FormInput
                          name="osType"
                          label="Tipo de OS"
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
                    <Col>
                      <FormInput
                          name="claimService"
                          label="Reivindicar serviço"
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
                </Card.Body>
                </Card>
            </Col>
          </Row>
          <Row>
            <Col>
                <Card>
                <Card.Body className='pb-4'>
                  <h4 className="header-title mb-3 d-flex icon-align-center justify-content-center">Selecione os serviços</h4>
                  <MultiSelectWithSearch dataPackage={dataServices} />
                </Card.Body>
                </Card>
            </Col>
          </Row>
          <Row>
            <Col>
                <Card>
                <Card.Body className='pb-4'>
                  <h4 className="header-title mb-3 d-flex icon-align-center justify-content-center">Selecione as Partes</h4>
                  <MultiSelectWithSearch dataPackage={dataMantenanceReview}/>
                </Card.Body>
                </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </>
  )
}