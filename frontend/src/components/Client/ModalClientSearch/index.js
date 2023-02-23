import {useEffect, useState} from 'react';
import SimpleBar from 'simplebar-react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import {APICore} from "../../../helpers/api/apiCore";
import { useForm, Controller } from "react-hook-form";

const api = new APICore();

const defaultValues = {
  clientSearchQuery: ''
}

export function ModalClientSearch({showModalSearchClient, setShowModalSearchClient, company_id, handleChangeClientData}) {

  const [clientsResultSearch, setClientsResultSearch] = useState([]);
  const [clientSelected, setClientSelected] = useState(null);

  const { handleSubmit, register } = useForm({ defaultValues });

  function  onHideShowModalClient() {
    setShowModalSearchClient(false)
  }

  function addSelectedClientVehicle () {
    handleChangeClientData(clientSelected)
    onHideShowModalClient()
    setClientSelected(null)
  }

  function activateUser(item) {
    setClientSelected(item);
    console.log(item)
  };



  async function onSubmit(data) {
    const result = await  api.get('/client', {
      company_id: company_id,
      search: data.clientSearchQuery
    })
    console.log(result)
    setClientsResultSearch(result.data.data)
    console.log(data)
  }

  
  return (
    <>
         <Modal show={showModalSearchClient} onHide={onHideShowModalClient}>
            <Modal.Header closeButton>
                <h4 className="modal-title">Cliente</h4>
            </Modal.Header>
            <Modal.Body className='py-3'>
                <h5>Faça pesquisa do cliente</h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="app-search d-flex align-items-center justify-content-center gap-2">
                    <div className="form-group position-relative w-100">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Digite o nome"
                            {...register('clientSearchQuery')}
                        />
                        <span className="mdi mdi-magnify search-icon"></span>
                    </div>
                    <Button
                      variant="primary"
                      type='submit'
                    >
                        Buscar
                    </Button>
                </div>
      
                <SimpleBar className="px-3 mt-2" style={{ maxHeight: '290px', width: '100%' }}>
                    {clientsResultSearch.length > 0 && clientsResultSearch.map((client, index) => {
                        return (
                            <Link
                                to="#"
                                key={index}
                                className="text-body"
                                onClick={(e) => {
                                    activateUser(client);
                              
                                }}
                            >
                                <div
                                    className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                        'bg-light': client.id === clientSelected?.id,
                                    })}
                                >
                              
      
                                    <div className="w-100 overflow-hidden p-1">
                                        <h5 className="mt-0 mb-0 font-14">
                                            {`${client.name || ''}`}
                                        </h5>
                                        <p className="mt-1 mb-0 text-muted font-14">
                                            <span className="w-75">{`CPF: ${client.document || ''}`}</span>
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
                disabled={!clientSelected}
              >
                  salvar
              </Button>
            </Modal.Footer>
        </Modal>
    
    </>
  )
}