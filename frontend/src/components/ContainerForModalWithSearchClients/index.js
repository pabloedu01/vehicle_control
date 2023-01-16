import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';


export function ContainerForModalWithSearchClients({ onUserSelect, clientsData, setSelectedChangeClientData }) {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    function search (text) {
        setClients(text ? [...clientsData].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : [...clientsData]);
    };

    function activateUser(user) {
        setSelectedClient(user);
        setSelectedChangeClientData(user)
    };

    useEffect(() => {
        setClients([...clientsData])
    },[clientsData])
    console.log(clients)

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
              {clients.length > 0 && clients.map((client, index) => {
                  return (
                      <Link
                          to="#"
                          key={index}
                          className="text-body"
                          onClick={(e) => {
                              activateUser(client);
                              console.log(client)
                          }}
                      >
                          <div
                              className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                  'bg-light': client.id === selectedClient?.id,
                              })}
                          >
                        

                              <div className="w-100 overflow-hidden p-1">
                                  <h5 className="mt-0 mb-0 font-14">
                                      {client.name}
                                  </h5>
                                  <p className="mt-1 mb-0 text-muted font-14">
                                      <span className="w-75">Cpf: {client.document}</span>
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

