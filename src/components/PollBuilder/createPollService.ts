import { PollOption } from './createPollStore';
import { getInstanceWithJWT } from '../httpService';

export function createPoll(jwt: string, pollId: string, title: string, options: Array<PollOption>) {
  const i = getInstanceWithJWT(jwt);

  return i.post('/poll/create', {
    poll_id: pollId,
    title: title,
    options: options,
  }).then((response: any) => {
    if (!response) {
      return 'error';
    }
    return response.data;
  });
}
