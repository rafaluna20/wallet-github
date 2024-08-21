import koa from "koa";
import koaBody from "koa-body";
import logger from "koa-logger";

import cors from "@koa/cors";

import { error_handler } from "~api/middlewares";
import routes from "~routes";
import db from "~sequalize";

const start = async () => {
  const app = new koa();

  app.use(error_handler);
  app.use(cors({ origin: "*" }));
  app.use(logger());
  app.use(koaBody());
  app.use(routes().routes());

  // agregar argumento de sync {force: true} para forzar a que se genere la tabla para modelos
  await db.sequelize.authenticate();
  // await db.sequelize.sync();

  app
    .listen(process.env.PORT, () => {
      console.log(`init service in port: ${process.env.PORT}`);
    })
    .on("error", err => {
      console.log("root error", err);
    });
};

start();
