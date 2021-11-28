// [{u1,u2}, ....] => [[m12,m12, ...], ...]

import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

async function batchUsers(ids: readonly number[]) {
  const users = await getRepository(User)
    .createQueryBuilder('u')
    .where('u.id IN (:...ids)', { ids })
    .getMany();

  const usersToIds: Record<number, User> = {};

  users.map((u) => {
    usersToIds[u.id] = u;
  });

  return ids.map((id) => usersToIds[id]);
}

export default new DataLoader(batchUsers);
