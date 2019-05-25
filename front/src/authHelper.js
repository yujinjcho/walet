const key = 'X-Auth-Token';

const saveToken = token => localStorage.setItem('token', token);

const getToken = () => localStorage.getItem('token');

const removeToken = () => localStorage.removeItem('token');

const header = () => ({
  [key]: localStorage.getItem('token')
});

export default {
  saveToken,
  getToken,
  removeToken,
  header
}
