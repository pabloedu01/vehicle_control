import { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import PageTitle from '../../../components/PageTitle';
import { formatMoneyPt_BR } from '../../../utils/formatMoneyPt_BR'

import { APICore } from "../../../helpers/api/apiCore";

import styles from "./RecommendationConfirmation.module.css"

const api = new APICore();

export default function RecommendationConfirmation () {
  const [packageSelected, setPackageSelected] = useState(null)
  const [data, setData] = useState([]);
  const [itemsRecommendations, setItemsRecommendations] = useState([])

  let { state } = useLocation();

  console.log(state)

  const { companyId, modelVehicleId,maintenanceReviewId } = useParams()

  function calculateAmountPackages(packageServices = [], packageProducts=[], name) {
    console.log(packageServices)
   
    const servicesAmount = packageServices.reduce((acc, curr) => {
      return acc + parseFloat(curr.priceAmount)
    },0 )
    const productsAmount = packageProducts.reduce((acc, curr) => {
      return acc + parseFloat(curr.priceAmount)
    },0)
    return servicesAmount + productsAmount
  }


  function createOrderPreview(recommendations = []) {
    const itemsList = {
      products: [],
      services: [],
    } 
    const packagesListNameOrder = recommendations.map(item => {
      let amountItems = 0
      let total = 0
      

 
      item.services.forEach(service => {
        if (!itemsList.services.some(serv => serv.id === service.service.id)) {
          
          itemsList.services.push({
            id: service.service.id, 
            name: service?.service?.description , 
            price: service?.service?.standard_value,
            repeatInPackages: 1,
            priceAmount:  +service?.service?.standard_value * +service?.service?.standard_quantity,
            serviceInRecommendations: {recommendationId: item.id,[item.name]:service}
          })
        } else {
          const serviceFind = itemsList.services.find(s => s.id === service.service.id);
          serviceFind.repeatInPackages++
          serviceFind.serviceInRecommendations[item.name] = service
          serviceFind.serviceInRecommendations.recommendationId =  item.id
        }
        total += (+service?.service?.standard_value * +service?.quantity)
        amountItems++
      });

      item.products.forEach(product => {
        if (!itemsList.products.some(pro => pro.id === product.product.id)) {
          itemsList.products.push({
            id: product.product.id, 
            name: product?.product.name, 
            price: product?.product.sale_value,
            priceAmount: +product?.product?.sale_value * +product?.quantity, 
            repeatInPackages: 1 ,  
            productInRecommendations: {recommendationId: item.id,[item.name]:product}
        })
        } else {
          const productFind = itemsList.products.find(p => p.id === product.product.id);
          productFind.repeatInPackages++
          productFind.productInRecommendations[item.name] = product
          productFind.productInRecommendations.recommendationId =  item.id
        }
        total += (+product?.product?.sale_value * +product?.quantity)
        amountItems++
      });
      return {
        id: item.id,
        name: item.name,
        total,
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
          setItemsRecommendations(itemForPreviewsInOrder) 
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

                  <Table hover responsive className="mb-0" >
                      <thead>
                          <tr> 
                          <th>Produto</th>                        
                          {itemsRecommendations.packagesListNameOrder && itemsRecommendations.packagesListNameOrder.map((header, index) => (
                            <th 
                                key={index}
                                className='cursor-pointer'
                                onClick={() => handlePackages(header.id)}
                              >{header.name}
                            </th>
                            
                          )) } 
                              <th>Valor</th>
                          </tr>
                      </thead>
                      <tbody >
                        {
                          itemsRecommendations.itemsList?.services.length > 0 && itemsRecommendations.itemsList?.services.map((item, index) => (
                            <tr key={item.id + item.name + index} className="">
                              <td>{item.name}</td>
                              {itemsRecommendations.packagesListNameOrder.length > 0 && itemsRecommendations.packagesListNameOrder.map((recommendation, index) => (
                                <td key={recommendation.name + recommendation.id +'_'+index} className={`${ packageSelected === recommendation.id && 'table-success'}`} style={{backgroundColor: 'red'}}>
                                    <span className=''>{item.serviceInRecommendations[recommendation.name]?.quantity ?? '-'}</span>
                                </td>
                              ))}
                              <td>{formatMoneyPt_BR(item.price)}</td>
                            </tr>
                          ))
                        }
                        
                        {
                          itemsRecommendations.itemsList?.services.length > 0 && itemsRecommendations.itemsList?.products.map((item, index) => (
                            <tr key={item.id + item.name + index} className="">
                              <td>{item.name}</td>
                            
                              {itemsRecommendations.packagesListNameOrder.length > 0 && itemsRecommendations.packagesListNameOrder.map((recommendation, index) => (
                                <td key={recommendation.name + recommendation.id +'_'+index} className={`${ packageSelected === recommendation.id && 'table-success'}`}>
                                  <span>{item.productInRecommendations[recommendation.name]?.quantity ?? '-'}</span>
                                </td>
                              ))}
                              <td>{formatMoneyPt_BR(item.price)}</td>
                            </tr>
                          ))
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                          <td></td>
                          {itemsRecommendations.packagesListNameOrder && itemsRecommendations.packagesListNameOrder.map((packageItem, index) => (
                            <td key={packageItem.id +'_'+ index}>
                              <div className={(packageSelected === packageItem.id || packageSelected === null) ? 'visible' : 'invisible' }>
                                {formatMoneyPt_BR(packageItem.total)}
                              </div>
                            </td>
                            
                          )) } 
                          <td></td>
                        </tr>
                        </tfoot>
                      
                  </Table>
                  <Row>
                      <Col className='d-flex align-items-end justify-content-end mt-2'>
                      {
                        packageSelected ? (
                          <Link className="btn btn-primary align-items-end" to={`/panel/company/${companyId}/workshop/quotation/create/${state.serviceScheduleId}`} state={{state: {recommendationId: packageSelected}}} > 
                            prosseguir
                          </Link>
                        ) : (
                          <Button 
                            variant="Primary"                             
                            className="btn btn-primary align-items-end"
                            disabled
                          >
                          prosseguir
                        </Button>
                        ) 
                        
                      }
                  
                      </Col>
                  </Row>
              </Card.Body>
          </Card>
      </Col>
  </Row>
    </>
  )
}