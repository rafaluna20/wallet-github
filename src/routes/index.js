import Router from "koa-router";

import agentWalletResource from "./routeAgentWallet";
import userResource from "./routeUser";
import walletResource from "./routeWallet";

export default () => {
  const path = new Router({
    prefix: "/api",
  });

  path.use(userResource().routes());
  path.use(walletResource().routes());
  path.use(agentWalletResource().routes());

  return path;
};
