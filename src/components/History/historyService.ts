import { getInstanceWithJWT } from '../httpService';

export function getPollHistory(jwt: string, page: number) {
  if (!jwt) {
    throw 'error';
  }
  const i = getInstanceWithJWT(jwt);
  return i.post('/poll/history', {
    page: page,
  })
    .then((response: any) => {
      if (!response) {
        throw 'error';
      }
      return response.data;
  });
}
