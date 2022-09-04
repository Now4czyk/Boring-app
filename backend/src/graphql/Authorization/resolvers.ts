import { decodeToken } from '../../middleware/decodeToken';
import { Context } from '../../utils';

const queries = {
  verify: async (_: ParentNode, args: any, { req }: Context) => ({
    isAuthorized: !!(await decodeToken(req)),
  }),
};

export const resolvers = { queries };
