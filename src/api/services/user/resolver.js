import { UserProvider } from "~api";

const UserResolver = {
  createUser: async ctx => {
    try {
      ctx.body = await UserProvider.createUser(
        ctx.request.body,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },
  updatePIN: async ctx => {
    try {
      ctx.body = await UserProvider.updatePIN(
        ctx.request.body,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },
  token: async ctx => {
    try {
      ctx.body = await UserProvider.token(ctx.request.body, ctx.state.context);
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  },
  me: async ctx => {
    try {
      ctx.body = await UserProvider.me(ctx.request.body, ctx.state.context);
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  },
  search: async ctx => {
    try {
      ctx.body = await UserProvider.search(
        ctx.request.params,
        ctx.state.context,
      );
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  },
  searchByID: async ctx => {
    try {
      ctx.body = await UserProvider.searchByID(
        ctx.request.params,
        ctx.state.context,
      );
    } catch (error) {
      ctx.body = error;
      ctx.status = 400;
    }
  },
};

export default UserResolver;
