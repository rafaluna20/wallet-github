import { WalletProvider } from "~api";

const WalletResolver = {
  createWallet: async ctx => {
    try {
      ctx.body = await WalletProvider.createWallet(
        ctx.request.body,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },

  getWalletByUser: async ctx => {
    try {
      ctx.body = await WalletProvider.getWalletByUser(
        ctx.request.params,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },

  paymentWallet: async ctx => {
    try {
      ctx.body = await WalletProvider.paymentWallet(
        ctx.request.body,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },
};

export default WalletResolver;
