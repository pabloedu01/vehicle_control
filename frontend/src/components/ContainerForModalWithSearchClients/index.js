import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';


export function ContainerForModalWithSearchClients({ onUserSelect, clients, setSelectedChangeClientData }) {
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    function search (text) {
        setUser(text ? [...clients].filter((u) => u.name.toLowerCase().indexOf(text.toLowerCase()) >= 0) : [...clients]);
    };

    function activateUser(user) {
      setSelectedUser(user);
      setSelectedChangeClientData(user)
    };

    useEffect(() => {
        setUser([...clients])
    },[clients])

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
              {user.map((user, index) => {
                  return (
                      <Link
                          to="#"
                          key={index}
                          className="text-body"
                          onClick={(e) => {
                              activateUser(user);
                              console.log(user)
                          }}
                      >
                          <div
                              className={classnames('d-flex', 'align-items-start', 'mt-1', 'p-2', {
                                  'bg-light': user.id === selectedUser.id,
                              })}
                          >
                        

                              <div className="w-100 overflow-hidden p-1">
                                  <h5 className="mt-0 mb-0 font-14">
                                      {user.name}
                                  </h5>
                                  <p className="mt-1 mb-0 text-muted font-14">
                                      <span className="w-75">Cpf: {user.document}</span>
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

