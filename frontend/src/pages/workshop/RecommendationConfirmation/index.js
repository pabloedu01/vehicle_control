import { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import PageTitle from '../../../components/PageTitle';
import { formatMoneyPt_BR } from '../../../utils/formatMoneyPt_BR'

import { APICore } from "../../../helpers/api/apiCore";

const dataFacker = [
  {
    product: '4ª Revisão',
    quantidade: 1,
    gold: true,
    silver: true,
    bronze: true,
    amount: 519.85
  },
  {
    product: 'Elemento Filtro de ar',
    quantidade: 1,
    gold: true,
    silver: true,
    bronze: true,
    amount: 75.85
  },
  {
    product: 'Fluido de freio',
    quantidade: 2,
    gold: true,
    silver: true,
    bronze: true,
    amount: 99.00
  },
  {
    product: 'Óleo lubrificante',
    quantidade: 42,
    gold: true,
    silver: true,
    bronze: false,
    amount: 302.40
  },
  {
    product: 'Elemento filtrante',
    quantidade: 1,
    gold: true,
    silver: true,
    bronze: false,
    amount: 97.82
  },
  {
    product: 'Filtro de combustível',
    quantidade: 1,
    gold: true,
    silver: false,
    bronze: false,
    amount: 55.50
  },
  {
    product: 'Junta de alumínio',
    quantidade: 1,
    gold: true,
    silver: false,
    bronze: false,
    amount: 11.50
  },
]

const api = new APICore();

export default function RecommendationConfirmation () {
  const [packageSelected, setPackageSelected] = useState(null)
  const [data, setData] = useState([]);
  // const [itemsList, setItemsList] = useState([])



  const history = useNavigate();

  const { companyId, modelVehicleId,maintenanceReviewId } = useParams()

  function createOrderPreview(recommendations = []) {
    const itemsList = {
      products: [],
      services: [],
    } 
    const packagesListNameOrder = recommendations.map(item => {
      let amountItems = 0
      item.products.forEach(product => {
        if (!itemsList.products.some(pro => pro.id === product.id)) {
          itemsList.products.push({id: product.id, name: product?.product.name, repeatInPackages: 1 ,  fullDetails: product})
        } else {
          const productFind = itemsList.products.find(p => p.id === product.id);
          productFind.repeatInPackages++
        }
        amountItems++
      });
      item.services.forEach(service => {
        if (!itemsList.services.some(serv => serv.id === service.id)) {
          itemsList.services.push({id: service.id, name: service?.service?.description ,repeatInPackages: 1, fullDetails: service})
        } else {
          const serviceFind = itemsList.services.find(s => s.id === service.id);
          serviceFind.repeatInPackages++
        }
        amountItems++
      });
      return {
        name: item.name,
        amountItems 
      }
    })

    return {
      packagesListNameOrder: packagesListNameOrder.sort(function (a, b) {
        if (a.amountItems < b.amountItems) {
          return 1;
        }
        if (a.amountItems > b.amountItems) {
          return -1;
        }
        return 0;
      }),
      itemsList : {
        products: itemsList.products.sort(function (a, b) {
          if (a.repeatInPackages < b.repeatInPackages) {
            return 1;
          }
          if (a.repeatInPackages > b.repeatInPackages) {
            return -1;
          }
          return 0;
        }),
        services: itemsList.services.sort(function (a, b) {
          if (a.repeatInPackages < b.repeatInPackages) {
            return 1;
          }
          if (a.repeatInPackages > b.repeatInPackages) {
            return -1;
          }
          return 0;
        }),
      }
    }
  }


  function handlePackages(pack) {
    setPackageSelected(prevState => 
      prevState === pack ? null : pack
    )
  }

  useEffect(() => {
        api.get(`/recommendation?company_id=${companyId}&model_id=${modelVehicleId}&maintenance_review_id=${maintenanceReviewId}`).then(response => { 
          setData(response.data.data)
          const itemForPreviewsInOrder = createOrderPreview(response.data.data)
          console.log(itemForPreviewsInOrder) 
          console.log(response.data.data) 
        })
  },[companyId, modelVehicleId, maintenanceReviewId])

  return (
    <>
      <PageTitle
        breadCrumbItems={[
            { label: 'Oficina', path: '/workshop/' },
            {
                label: 'Lista de pacotes',
                path: '/workshop/estimate/create',
                active: true,
            },
        ]}
        title={'Orçamentos'}
      />
        
      <Row>
      <Col>
          <Card>
              <Card.Body>
                  <h4 className="header-title mb-2">Lista de pacotes</h4>
                  {/* <p className="text-muted font-14">
                      Add <code>hover</code> attribute to enable a hover state on table rows
                  </p> */}

                  <Table responsive="md" size="sm" hover className="mb-0" >
                      <thead >
                          <tr>
                              <th>Produto</th>
                              <th>Quantidade</th>
                              <th 
                                className='cursor-pointer'
                                onClick={() => handlePackages('gold')}
                              >Ouro</th>
                              <th
                                className='cursor-pointer'
                                onClick={() => handlePackages('silver')}
                              >
                              Prata
                              </th>
                              <th
                                className='cursor-pointer'
                                onClick={() => handlePackages('bronze')}
                              >
                              Bronze
                              </th>
                              <th>Valor</th>
                          </tr>
                      </thead>
                      <tbody >
                        {
                          dataFacker.length > 0 && dataFacker.map((item, index) => (
                            <tr key={item.product + index} className="">
                              <td>{item.product}</td>
                              <td>
                                {item.quantidade}
                              </td>
                              <td>
                                {item.gold && <i className={`mdi mdi-check-bold ${ packageSelected === 'gold' && 'bg-success'} p-2`} />}
                              </td>
                              <td >
                                  {item.silver && <i className={`mdi mdi-check-bold ${ packageSelected === 'silver' && 'bg-success'} p-2`} />}                        
                                </td>
                              <td>{item.bronze && <i className={`mdi mdi-check-bold ${ packageSelected === 'bronze' && 'bg-success'} p-2`} />}</td>
                              <td>{formatMoneyPt_BR(item.amount)}</td>
                            </tr>
                          ))
                        }
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <div className={(packageSelected === 'gold' || packageSelected === null) ? 'visible' : 'invisible' }>
                              {formatMoneyPt_BR(1160.90)}
                            </div>
                          </td>
                          <td>
                            <div className={(packageSelected === 'silver' || packageSelected === null) ? 'visible' : 'invisible' }>
                              {formatMoneyPt_BR(519.85)}
                            </div>
                          </td>
                          <td>
                            <div className={(packageSelected === 'bronze' || packageSelected === null) ? 'visible' : 'invisible' }>
                              {formatMoneyPt_BR(335.15)}
                            </div>
                          </td>
                          
                          <td></td>
                        </tr>
                      </tbody>
                  </Table>
                  <Row>
                      <Col className='d-flex align-items-end justify-content-end mt-2'>
                        <Button 
                            variant="Primary"                             
                            className="btn btn-primary align-items-end"
                            onClick={() => { history(`/panel/company/2/workshop/estimate/confirmation`) }}>
                            prosseguir
                        </Button>
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
      </Col>
  </Row>
    </>
  )
}