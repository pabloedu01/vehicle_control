import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';


export function ContainerForVehicleWithSearchVehicles({ vehiclesData, setSelectedVehicle }) {
    const [vehicles, setVehicles] = useState([]);
    const [selected, setSelected] = useState(null);

    function search (text) {
        setVehicles(text ? [...vehicles].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : [...vehicles]);
    };

    function activateUser(vehicle) {
        setSelected(vehicle);
      setSelectedVehicle(vehicle)
    };

    useEffect(() => {
        setVehicles([...vehiclesData])
    },[vehiclesData])

    return (
        <>
          <div className="app-search p-3">
              <div className="form-group position-relative">
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Digite o nome, chassi ou placa..."
                      onChange={(e) => search(e.target.value)}
                  />
                  <span className="mdi mdi-magnify search-icon"></span>
              </div>
          </div>

          <SimpleBar className="px-3" style={{ maxHeight: '350px', width: '100%' }}>
              {vehicles.length > 0 && vehicles.map((vehicle, index) => {
                  return (
                      <Link
                          to="#"
                          key={index}
                          className="text-body"
                          onClick={(e) => {
                              activateUser(vehicle);
                              console.log(vehicle)
                          }}
                      >
                          <div
                              className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                  'bg-light': vehicle.id === selected?.id,
                              })}
                          >
                        

                              <div className="w-100 overflow-hidden p-1">
                                  <h5 className="mt-0 mb-0 font-14">
                                      {vehicle.name}
                                  </h5>
                                  <p className="mt-1 mb-0 text-muted font-14">
                                      <span className="w-75">modelo: </span>
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

