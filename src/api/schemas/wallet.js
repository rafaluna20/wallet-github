export const PaymentSchema = [
  {
    fieldname: "depositUserID",
    alias: "cuenta a depositar",
    type: "string",
    nullable: false,
  },
  {
    fieldname: "amount",
    alias: "Monto de operación",
    type: "moneyNumber",
    nullable: false,
  },
];

export const AgentSchema = [
  {
    fieldname: "comercialName",
    alias: "Razón social",
    type: "string",
    nullable: false,
    length: 50,
  },
  {
    fieldname: "contactNumber",
    alias: "Numero de contacto",
    type: "phoneNumber",
    nullable: false,
    length: 20,
  },
  {
    fieldname: "ruc",
    alias: "RUC",
    type: "alphaNumeric",
    nullable: true,
    length: 50,
  },
  {
    fieldname: "address",
    alias: "Dirección",
    type: "strindAddress",
    nullable: true,
  },
];

export const RechargeSchema = [
  {
    fieldname: "rechargedUserID",
    alias: "Usuaria a recargar",
    type: "string",
    nullable: false,
  },
  {
    fieldname: "amount",
    alias: "Monto de operación",
    type: "moneyNumber",
    nullable: false,
  },
];
