import DataLoader from 'dataloader';
import { getConnection } from 'typeorm';
import { User } from '../entities/User';

interface MemberWithRoomId extends User {
  roomId: number;
}

async function batchMembers(roomIds: readonly number[]) {
  const members: MemberWithRoomId[] = await getConnection().query(
    `
    SELECT
      u.*, m."roomId"
    FROM users u
    LEFT JOIN members m ON m."userId" = u.id
    WHERE m."roomId" = ANY($1)

  `,
    [roomIds]
  );

  const membersToIds: Record<number, MemberWithRoomId[]> = {};

  members.forEach((m) => {
    membersToIds[m.roomId] = (membersToIds[m.roomId] || []).concat(m);
  });

  return roomIds.map((roomId) => membersToIds[roomId]);
}

export default function createMemberLoader() {
  return new DataLoader(batchMembers);
}
