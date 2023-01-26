import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import {formatMoneyPt_BR } from "../../../../utils/formatMoneyPt_BR"

export function ContainerForProductsSearch({ productsData, setSelectedChangeProductsData }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    function search (text) {
        setProducts(text ? [...productsData].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : [...productsData]);
    };

    function activateUser(item) {
        setSelectedProduct(item);
        setSelectedChangeProductsData(item)
    };

    useEffect(() => {
        if(productsData) {
            setProducts([...productsData])
        }
    },[productsData])


    return (
        <>
          <div className="app-search p-3">
              <div className="form-group position-relative">
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Digite o nome do cliente..."
                      onChange={(e) => search(e.target.value)}
                  />
                  <span className="mdi mdi-magnify search-icon"></span>
              </div>
          </div>

          <SimpleBar className="px-3" style={{ maxHeight: '350px', width: '100%' }}>
              {products.length > 0 && products.map((prod, index) => {
                  return (
                      <Link
                          to="#"
                          key={index}
                          className="text-body"
                          onClick={(e) => {
                              activateUser(prod);
                        
                          }}
                      >
                          <div
                              className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                  'bg-light': prod.id === selectedProduct?.id,
                              })}
                          >
                        

                              <div className="w-100 overflow-hidden p-1">
                                  <h5 className="mt-0 mb-0 font-14">
                                      {prod.name}
                                  </h5>
                                  <p className="mt-1 mb-0 text-muted font-14">
                                      <span className="w-75">valor:{ formatMoneyPt_BR(prod.sale_value ?? 0)}</span>
                                  </p>
                              </div>
                          </div>
                      </Link>
                  );
              })}
          </SimpleBar>
        </>
    );
};

