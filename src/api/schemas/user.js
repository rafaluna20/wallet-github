/**
 * @file propiedades del objeto Usuario para registro.
 * @param {fieldname} args campo obligatorio para el schema, especifica el nombre de campo
 * @param {type} args campo obligatorio para el schema, especifica el tipo de dato para validar
 * @param {nullable} args campo obligatorio para el schema, especifica si puede ser vacio o nulo
 * @param {length} args campo opcional para el schema, especifica el tamaño maximo del dato
 * @param {alias} args campo opcional para el schema, guarda el nombre el alias del campo.
 */

export const UserSchema = [
  {
    fieldname: "names",
    alias: "Nombre",
    type: "alphaNumeric",
    nullable: false,
    length: 50,
  },
  {
    fieldname: "lastname",
    alias: "Apellido",
    type: "alphaNumeric",
    nullable: false,
    length: 80,
  },
  {
    fieldname: "email",
    alias: "Correo",
    type: "stringEmail",
    nullable: false,
    length: 120,
  },
  {
    fieldname: "phone",
    alias: "Telefono",
    type: "phoneNumber",
    nullable: false,
    length: 20,
  },
  {
    fieldname: "password",
    alias: "PIN",
    type: "pinSix",
    nullable: false,
    length: 6,
  },
  {
    fieldname: "documentNumber",
    alias: "Numero de Identidad",
    type: "alphaNumeric",
    nullable: true,
    length: 50,
  },
  {
    fieldname: "address",
    alias: "Dirección",
    type: "strindAddress",
    nullable: true,
    length: 250,
  },
];
