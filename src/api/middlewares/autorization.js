import jwt from "jsonwebtoken";

export const verifyToken = async (ctx, next) => {
  if (!ctx.headers.authorization)
    return ctx.throw(401, "Unauthorized, authorization requerido.");

  const token = ctx.header.authorization?.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN || "my-key");
    ctx.state.context = {
      ...decoded,
      authorization: token,
    };

    await next();
  } catch (error) {
    return ctx.throw(
      401,
      `Unauthorized, token ` +
        (error.message === "jwt expired" ? "expirado." : ` invalido.`),
    );
  }
};
