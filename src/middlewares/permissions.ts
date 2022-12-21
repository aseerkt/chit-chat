import { MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';
import { MemberRole } from '../entities/Member';
import { MyContext } from '../types/global.types';
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
        throw new Error('Not Authenticated');
      }
      const payload: any = getPayload(token);
      context.res.locals.userId = payload.userId;
    } catch (err) {
      console.log(err.message);
      if (strict) {
        throw new Error('Not Authenticated');
      }
    }
    return next();
  };

export const hasRoomAccess: MiddlewareFn<MyContext> = async function (
  { context, args, root },
  next
) {
  try {
    const members = await context.memberLoader.load(args.roomId || root.roomId);

    const currentMember = members.find(
      (m) => m.userId === context.res.locals.userId
    );
    if (!currentMember || currentMember.role === MemberRole.INVITED) {
      throw new Error('Access Denied');
    }
    return next();
  } catch (err) {
    throw err;
  }
};
