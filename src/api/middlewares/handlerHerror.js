export const error_handler = async (ctx, next) => {
  return next().catch(err => {
    const { statusCode, message } = err;
    ctx.type = "json";
    ctx.status = statusCode || 500;
    ctx.body = {
      error: statusCode === 401 ? "Unauthorized" : "Server Error",
      message,
    };
    ctx.app.emit("error", err, ctx);
  });
};
