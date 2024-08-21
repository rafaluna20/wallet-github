import Router from "koa-router";

import { AgentWalletResolver } from "~api";
import { verifyToken } from "~api/middlewares";

export default () => {
  const router = new Router({
    prefix: "/agent",
  });

  router.post("/", verifyToken, AgentWalletResolver.createAgentWallet);
  router.post("/recharge", verifyToken, AgentWalletResolver.rechargeWallet);

  return router;
};
