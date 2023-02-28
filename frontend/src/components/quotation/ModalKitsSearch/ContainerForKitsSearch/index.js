import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import {formatMoneyPt_BR } from "../../../../utils/formatMoneyPt_BR"

export function ContainerForKitsSearch({ kitsData, setSelectedChangeKitsData }) {
    const [kits, setKits] = useState([]);
    const [selectedKit, setSelectedKit] = useState(null);
    console.log(kitsData)
    function search (text) {
        setKits(text ? [...kitsData].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : [...kitsData]);
    };

    function activateUser(item) {
        setSelectedKit(item);
        setSelectedChangeKitsData(item)
    };

    useEffect(() => {
        if(kitsData) {
            setKits([...kitsData])
        }
    },[kitsData])


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
              {kits.length > 0 && kits.map((kit, index) => {
                  return (
                      <Link
                          to="#"
                          key={index}
                          className="text-body"
                          onClick={(e) => {
                              activateUser(kit);
                        
                          }}
                      >
                          <div
                              className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                  'bg-light': kit.kit_id === selectedKit?.kit_id,
                              })}
                          >
                        

                              <div className="w-100 overflow-hidden p-1">
                                  <h5 className="mt-0 mb-0 font-14">
                                      {kit.name}
                                  </h5>
                               {/*
                                <p className="mt-1 mb-0 text-muted font-14">
                                    <span className="w-75">valor:{ formatMoneyPt_BR(kit.sale_value ?? 0)}</span>
                                </p>
                                */}
                                  
                              </div>
                          </div>
                      </Link>
                  );
              })}
          </SimpleBar>
        </>
    );
};

