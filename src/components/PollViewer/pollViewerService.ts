import { getInstanceWithJWT } from '../httpService';

export function fetchPollData(pollId: string, jwt: string) {
  const instance = getInstanceWithJWT(jwt);

  return instance.post('/poll/fetch', {
    poll_id: pollId,
  }).then((response: any) => {
    if (!response) {
      return 'error';
    }
    return response.data;
  });
}

export function voteOnPoll(pollId: string, optionId: string, jwt: string) {
  const instance = getInstanceWithJWT(jwt);

  return instance.post('/poll/vote', {
    poll_id: pollId,
    option_id: optionId,
  }).then((response: any) => {
    if (!response) {
      return 'error';
    }
    return response.data;
  });
}
