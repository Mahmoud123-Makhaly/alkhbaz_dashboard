import { accessToken } from './accessToken';
export default function authHeader() {
  return { Authorization: accessToken };
}
