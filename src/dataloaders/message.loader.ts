// [{u1,u2}, ....] => [[m12,m12, ...], ...]

import DataLoader from 'dataloader';
import { AppDataSource } from '../data-source';
import { Message } from '../entities/Message';

async function batchMessages(roomIds: readonly number[]) {
  const messages = await AppDataSource.getRepository(Message)
    .createQueryBuilder('m')
    .where('m."roomId" IN (:...roomIds)', { roomIds })
    .getMany();

  const messagesToIds: Record<number, Message[]> = {};

  messages.forEach((m) => {
    messagesToIds[m.roomId] = (messagesToIds[m.roomId] || []).concat(m);
  });

  return roomIds.map((roomId) => messagesToIds[roomId] || []);
}

export default new DataLoader(batchMessages);
