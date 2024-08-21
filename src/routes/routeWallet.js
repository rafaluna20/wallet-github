import Router from "koa-router";

import { WalletResolver } from "~api";
import { verifyToken } from "~api/middlewares";

export default () => {
  const router = new Router({
    prefix: "/wallet",
  });

  router.post("/", verifyToken, WalletResolver.createWallet);
  router.get("/", verifyToken, WalletResolver.getWalletByUser);
  router.post("/send", verifyToken, WalletResolver.paymentWallet);

  return router;
};
