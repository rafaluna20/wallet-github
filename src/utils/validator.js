import { Error } from "~utils";

const regexValues = {
  string: value => {
    const regEx =
      /^[A-Za-z0-9#&@\s*=+® áéíóúüÑñÁÉÍÓÚ%{}™,_.()''\n\t[\]/{}|:;<>$'"?-]*$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es un cadena valida. No debe contener numeros o caracteres especiales`,
      ]);
    return value.toLowerCase().trim();
  },
  alphaNumeric: value => {
    const regEx = /^$|^[-'a-zA-Z0-9À-ÖØ-öø-ÿ., :()+*#/<>_"°–´%¡!¿?|]+$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es un valor alfanumerico valido`,
      ]);
    return value.toLowerCase().trim();
  },
  strindAddress: value => {
    const regEx = /^[-'a-zA-Z0-9À-ÖØ-öø-ÿ.,: –#°]+$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es una direccion válida`,
      ]);
    return value.trim();
  },
  stringEmail: value => {
    // eslint-disable-next-line max-len
    const regEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [`${value} no es un email valido`]);
    return value.toLowerCase().trim();
  },
  stringPassword: value => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&?_]).{6,}$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `La contraseña debe contener una letra minúscula, una letra mayúscula, un número, un carácter único como !@#$%^&?_ y tener al menos 6 caracteres.`,
      ]);
    return value.trim();
  },
  int: value => {
    const regEx = /^[0-9]+$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es un número entero valido.`,
      ]);
    return parseInt(value, 10);
  },
  phoneNumber: value => {
    const regEx = /^[0-9 (#*)+-]+$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es un número telefonico.`,
      ]);
    return value.trim();
  },
  float: value => {
    const regEx = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es un número decimal valido.`,
      ]);
    return parseFloat(value);
  },
  pinFour: value => {
    const regEx = /^[0-9]+$/;
    const pin = `${value}`.trim();

    if (!regEx.test(pin) || pin.length !== 4)
      throw Error("Error de validación", [
        `${pin} no es un PIN valido de 4 digitos.`,
      ]);
    return pin;
  },
  pinSix: value => {
    const regEx = /^[0-9]+$/;
    const pin = `${value}`.trim();

    if (!regEx.test(value) || pin.length !== 6)
      throw Error("Error de validación", [
        `${pin} no es un PIN valido de 6 digitos.`,
      ]);
    return pin;
  },
  dateInput: value => {
    const regEx = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es una fecha válida, la fecha debe tener el format YYYY-MM-DD.`,
      ]);
    return value.trim();
  },
  onlyHourInput: value => {
    const regEx = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es una hora válida, la hora debe tener el formato hh:mm. en 24H`,
      ]);
    return value.trim();
  },
  timeInput: value => {
    const regEx = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

    if (!regEx.test(value))
      throw Error("Error de validación", [
        `${value} no es una hora válida, la hora debe tener el formato hh:mm:ss. en 24H`,
      ]);
    return value.trim();
  },
  moneyNumber: value => {
    const regEx = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/g;

    if (!regEx.test(value))
      throw Error("Error de validación", [`${value} no es un monto valido.`]);

    if (parseFloat(value) <= 1)
      throw Error("Error de validación", [
        `${value} no es un monto valido, la cantidad minima es de 1.00.`,
      ]);

    const decimal = `${value}`.split(".")[1];
    if (decimal && decimal.length > 2)
      throw Error("Error de validación", [
        `${value} no tiene formato de moneda, el monto debe tener maximo dos decimales.`,
      ]);

    return parseFloat(value);
  },
};

export const filesValidator = (schema, data) => {
  const result = {};
  schema.forEach(file => {
    if (data[file.fieldname] && `${data[file.fieldname]}`.trim()) {
      if (file.length && file.length < data[file.fieldname].length)
        throw Error("Error de validación", [
          `${data[file.fieldname]} no debe tener más de ${
            file.length
          } caracteres.`,
        ]);

      result[file.fieldname] = regexValues[file.type](data[file.fieldname]);
    } else if (!file.nullable)
      throw Error("Error de validación", [
        `El campo ` + (file.alias || file.fieldname) + ` no puede estar vacio.`,
      ]);
  });
  return result;
};

export const valueValidator = (value, type) => {
  return regexValues[type](value);
};

export const currentInitDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};
