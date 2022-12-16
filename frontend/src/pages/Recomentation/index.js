import { MultiSelectWithSearch } from '../../components/MultiSelectWithSearch'
import { Row, Col, Card } from 'react-bootstrap';
import PageTitle from "../../components/PageTitle";

export default function Recomentation() {

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'Recomendações', path: '/recomentation/basic' },
          // { label: 'Form Elements', path: '/forms/basic', active: true },
        ]}
        title={'Recomendações'}
      />

      <Row>
        <Col>
            <Card>
            <Card.Body>
              <MultiSelectWithSearch />
            </Card.Body>
            </Card>
        </Col>
      </Row>
    </>
  )
}