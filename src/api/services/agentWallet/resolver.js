import { AgentWalletProvider } from "~api";

const WalletHistorialResolver = {
  createAgentWallet: async ctx => {
    try {
      ctx.body = await AgentWalletProvider.createAgentWallet(
        ctx.request.body,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },
  rechargeWallet: async ctx => {
    try {
      ctx.body = await AgentWalletProvider.rechargeWallet(
        ctx.request.body,
        ctx.state.context,
      );
    } catch (error) {
      ctx.status = 400;
      ctx.body = error;
    }
  },
};

export default WalletHistorialResolver;
