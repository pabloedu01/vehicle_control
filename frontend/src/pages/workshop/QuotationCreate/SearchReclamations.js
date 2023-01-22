import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import { Button} from 'react-bootstrap';


export function InputSearchReclamations({ onUserSelect, clientsData =[], setSelectedChangeClientData }) {
    const [clients, setClients] = useState([
      {
          id: 1,
          text: 'Design One page theme',
          done: false,
      },
      {
          id: 2,
          text: 'Build a js based app',
          done: true,
      },
      {
          id: 3,
          text: 'Creating component page',
          done: true,
      },
      {
          id: 4,
          text: 'Testing??',
          done: true,
      },
      {
          id: 5,
          text: 'Hehe!! This looks cool!',
          done: false,
      },
      {
          id: 6,
          text: 'Create new version 3.0',
          done: false,
      },
      {
          id: 7,
          text: 'Build an angular app',
          done: true,
      },
  ]);
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
          <div className="app-search mt-2 d-flex w-100">
              <div className="form-group position-relative">
                  <input
                      type="text"
                      className="form-control"
                      placeholder="Digite o nome do cliente..."
                      onChange={(e) => search(e.target.value)}
                  />
                  <span className="mdi mdi-magnify search-icon"></span>
              </div>
              <Button type="button" variant="primary">
                  <i className="mdi mdi-rocket me-1"></i> <span>Launch</span>
              </Button>
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
                                      {client.text}
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

