export const Response = (data, message) => {
  return {
    message: message ? message : "success",
    data,
  };
};

export const Error = (error, data) => {
  return { error, data };
};

export const SequalizeError = error => {
  let data;
  if (typeof error === "object")
    data = error.errors.map(item => `${item.message}`);
  else data = error.message;
  return {
    error: "Error de Sequalize.",
    data,
  };
};
