import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Member } from '../entities/Member';

async function batchMembers(roomIds: readonly number[]) {
  const members: Member[] = await Member.find({
    where: { roomId: In(roomIds as number[]) },
  });

  console.log(members);

  const membersToIds: Record<number, Member[]> = {};

  members.forEach((m) => {
    membersToIds[m.roomId] = (membersToIds[m.roomId] || []).concat(m);
  });

  return roomIds.map((roomId) => membersToIds[roomId]);
}

export default new DataLoader(batchMembers);
