import { PollOption } from './createPollStore';
import { getInstanceWithJWT } from '../httpService';

export function createPoll(jwt: string, pollId: string, title: string, options: Array<PollOption>) {
  const i2 = getInstanceWithJWT(jwt);

  return i2.post('/poll/create', {
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
