export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('data');/*todo: por motivos de desarrollo rápido, haré la sesión persistente, para evitar loguearme al recargar, pero será removido*/
  window.location.href = '/login';
  return true;
};

export const login = (token, data) => {
  localStorage.setItem('token', token);
  localStorage.setItem('data', JSON.stringify(data));/*todo: por motivos de desarrollo rápido, haré la sesión persistente, para evitar loguearme al recargar, pero será removido*/
  return true;
};

export const getAuth = () => {
  return {
    token: localStorage.getItem('token'),
    data: JSON.parse(localStorage.getItem('data'))
  };
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const data = JSON.parse(localStorage.getItem('data'));/*todo: por motivos de desarrollo rápido, haré la sesión persistente, para evitar loguearme al recargar, pero será removido*/

  return typeof token !== 'undefined' && token !== null && typeof data !== 'undefined' && data !== null;
};
