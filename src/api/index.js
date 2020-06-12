import axios from 'axios';

const API_ENDPOINT = 'http://192.168.0.32:3000';

// scheme:[//[user[:password]@]host[:port]][/path][?query][#fragment]
const TEACHER_LOGIN_RESOURCE = '/users/';

export const fillgiHttpClient = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json,text/plain,*/*',
  },
});

export function authTeacherLogin(email, password) {
  return fillgiHttpClient
    .post(TEACHER_LOGIN_RESOURCE + 'login', {email, password})
    .catch((err) => console.error(err));
}
