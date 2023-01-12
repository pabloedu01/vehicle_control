import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';


const users = [
  {
      id: 1,
      name: 'Brandon Smith',
      avatar: '',
      lastMessage: 'How are you today?',
      totalUnread: 3,
      lastMessageOn: '4:30am',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'California, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Favourties',
  },
  {
      id: 2,
      name: 'Maria C',
      avatar: '',
      lastMessage: "Hey! a reminder for tomorrow's meeting?",
      lastMessageOn: '5:30am',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'New York, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Friends',
  },
  {
      id: 3,
      name: 'Dominic A',
      avatar: '',
      lastMessage: "Are we going to have this week's planning meeting?",
      totalUnread: 2,
      lastMessageOn: 'Thu',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'New Jersey, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Favourties',
  },
  {
      id: 4,
      name: 'Ronda D',
      avatar: '',
      lastMessage: 'Please check these design assets..',
      lastMessageOn: 'Wed',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'California, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Friends',
  },
  {
      id: 5,
      name: 'Michael H',
      avatar: '',
      lastMessage: 'Are you free for 15 mins? I would like to discuss something',
      totalUnread: 6,
      lastMessageOn: 'Tue',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'New York, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Friends',
  },
  {
      id: 6,
      name: 'Thomas R',
      avatar: '',
      lastMessage: "Let's have meeting today between me, you and Tony...",
      lastMessageOn: 'Tue',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'New Jersey, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Friends',
  },
  {
      id: 7,
      name: 'Thomas J',
      avatar: '',
      lastMessage: 'Howdy?',
      lastMessageOn: 'Tue',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'New York, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Favourties',
  },
  {
      id: 8,
      name: 'Rikcy J',
      avatar: '',
      lastMessage: 'Are you interested in learning?',
      totalUnread: 28,
      lastMessageOn: 'Mon',
      email: 'support@coderthemes.com',
      phone: '+1 456 9595 9594',
      location: 'New Jersey, USA',
      languages: 'English, German, Spanish',
      groups: 'Work, Friends',
  },
];


export function ContainerForModalWithSearchClients({ onUserSelect, clients, setSelectedChangeClientData }) {
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(users[1]);

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

