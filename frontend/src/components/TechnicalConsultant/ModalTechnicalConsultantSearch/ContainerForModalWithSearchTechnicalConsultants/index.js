import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';


export function ContainerForModalWithSearchTechnicalConsultants({ technicalConsultantsData, handleSelectedTechnicalConsultant }) {

    const [TechnicalConsultants, setTechnicalConsultants] = useState([]);
    const [selected, setSelected] = useState(null);

    function search (text) {
        setTechnicalConsultants(text ? [...technicalConsultantsData].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : [...technicalConsultantsData]);
    };

    function activateUser(user) {
        setSelected(user);
        console.log(user)
        handleSelectedTechnicalConsultant(user)
    };

    useEffect(() => {
        if(technicalConsultantsData) {
            setTechnicalConsultants([...technicalConsultantsData])
        } 
    },[technicalConsultantsData])
  

    return (
        <>
          <div className="app-search p-3">
              <div className="form-group position-relative">
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Digite o nome do TechnicalConsultante..."
                      onChange={(e) => search(e.target.value)}
                  />
                  <span className="mdi mdi-magnify search-icon"></span>
              </div>
          </div>

          <SimpleBar className="px-3" style={{ maxHeight: '350px', width: '100%' }}>
              {TechnicalConsultants.length > 0 && TechnicalConsultants.map((TechnicalConsultant, index) => {
                  return (
                      <Link
                          to="#"
                          key={index}
                          className="text-body"
                          onClick={(e) => {
                              activateUser(TechnicalConsultant);
                          }}
                      >
                          <div
                              className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                  'bg-light': TechnicalConsultant.id === selected?.id,
                              })}
                          >
                        

                              <div className="w-100 overflow-hidden p-1">
                                  <h5 className="mt-0 mb-0 font-14">
                                      {TechnicalConsultant.name}
                                  </h5>
                                  <p className="mt-1 mb-0 text-muted font-14">
                                      <span className="w-75">Código: {TechnicalConsultant.id}</span>
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

