import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';
import { Room } from '../entities/Room';
import { MyContext } from '../types/globalTypes';
import { getPayload } from '../utils/jwtHelper';

type ProtectMiddleware = (params: {
  strict: boolean;
}) => MiddlewareFn<MyContext>;

export const protect: ProtectMiddleware =
  ({ strict }) =>
  ({ context }, next) => {
    try {
      const token = context.req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        throw new AuthenticationError('Not Authenticated');
      }
      const payload: any = getPayload(token);
      context.res.locals.userId = payload.userId;
      return next();
    } catch (err) {
      console.log(err);
      if (strict) {
        throw new AuthenticationError('Not Authenticated');
      }
      return next();
    }
  };

export const hasRoomAccess: MiddlewareFn<MyContext> = async function (
  { context, args, root },
  next
) {
  try {
    const room = await Room.findOne({
      where: { id: args.roomId || root.roomId },
      relations: ['members'],
    });
    if (!room) {
      throw new Error('Room not found');
    }
    const memberIds = room.members.map((m) => m.userId);
    if (!memberIds.includes(context.res.locals.userId!)) {
      throw new Error('Access Denied');
    }
    return next();
  } catch (err) {
    throw err;
  }
};
