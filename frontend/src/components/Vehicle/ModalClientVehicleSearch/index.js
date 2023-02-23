import {useEffect, useState} from 'react';
import SimpleBar from 'simplebar-react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from "react-hook-form";

const api = new APICore();

const defaultValues = {
  clientVehicleSearchQuery: ''
}

export function ModalClientVehicleSearch({showModalSearchClientVehicle, setShowModalSearchClientVehicle, company_id, handleChangeClientVehicleData}) {

  const [clientVehiclesResultSearch, setClientVehiclesResultSearch] = useState([]);
  const [clientVehicleSelected, setClientVehicleSelected] = useState(null);

  const { handleSubmit, register } = useForm({ defaultValues });

  function  onHideShowModalClientVehicle() {
    setShowModalSearchClientVehicle(false)
  }

  function addSelectedClientVehicle () {
    handleChangeClientVehicleData(clientVehicleSelected)
    onHideShowModalClientVehicle()
    setClientVehicleSelected(null)
  }

  function activateUser(item) {
    setClientVehicleSelected(item);
    console.log(item)
  };



  async function onSubmit(data) {
    const result = await  api.get('/client-vehicle', {
      company_id: company_id,
      search: data.clientVehicleSearchQuery
    })
    console.log(result)
    setClientVehiclesResultSearch(result.data.data)
    console.log(data)
  }

  
  return (
    <>
         <Modal show={showModalSearchClientVehicle} onHide={onHideShowModalClientVehicle}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Veículos</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Faça pesquisa do veículo</h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="app-search d-flex align-items-center justify-content-center gap-2">
                    <div className="form-group position-relative w-100">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Digite a placa"
                            // onChange={(e) => setSelectedChangeClientVehicleSelected(e.target.value)}
                            {...register('clientVehicleSearchQuery')}
                        />
                        <span className="mdi mdi-magnify search-icon"></span>
                    </div>
                    <Button
                      variant="primary"
                      type='submit'
                      // onClick={addSelectedClientVehicle}
                      // disabled={!clientVehicleSelected}
                    >
                        Buscar
                    </Button>
                </div>
      
                <SimpleBar className="px-3 mt-2" style={{ maxHeight: '290px', width: '100%' }}>
                    {clientVehiclesResultSearch.length > 0 && clientVehiclesResultSearch.map((vehicle, index) => {
                        return (
                            <Link
                                to="#"
                                key={index}
                                className="text-body"
                                onClick={(e) => {
                                    activateUser(vehicle);
                              
                                }}
                            >
                                <div
                                    className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                        'bg-light': vehicle.id === clientVehicleSelected?.id,
                                    })}
                                >
                              
      
                                    <div className="w-100 overflow-hidden p-1">
                                        <h5 className="mt-0 mb-0 font-14">
                                            {`${vehicle.vehicle.model.name || ''} - ${vehicle.vehicle.model_year || ''}`|| ''}
                                        </h5>
                                        <p className="mt-1 mb-0 text-muted font-14">
                                            <span className="w-75">{`Placa: ${vehicle.plate || ''} - Chassis: ${vehicle.chasis || ''}`|| ''}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </SimpleBar>
              
            
                
                </form>



               
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={addSelectedClientVehicle}
                disabled={!clientVehicleSelected}
              >
                  salvar
              </Button>
            </Modal.Footer>
        </Modal>
    
    </>
  )
}