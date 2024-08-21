import Router from "koa-router";

import { UserResolver } from "~api";
import { verifyToken } from "~api/middlewares";

export default () => {
  const router = new Router({
    prefix: "/user",
  });

  router.post("/", UserResolver.createUser);
  router.post("/token", UserResolver.token);
  router.post("/password", verifyToken, UserResolver.updatePIN);
  router.get("/me", verifyToken, UserResolver.me);
  router.get("/search/:term", verifyToken, UserResolver.search);
  router.get("/:userID", verifyToken, UserResolver.searchByID);

  return router;
};
