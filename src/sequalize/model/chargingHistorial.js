import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class ChargingHistorial extends Model {
    static associate(model) {
      ChargingHistorial.belongsTo(model.ChargingAgent, {
        foreignKey: "chargingAgentID",
        as: "ChargingAgent",
      });

      ChargingHistorial.belongsTo(model.GeneralType, {
        foreignKey: "transactionID",
        as: "Transaction",
      });

      ChargingHistorial.belongsTo(model.Users, {
        foreignKey: "rechargedUserID",
        as: "RechargedUser",
      });
    }
  }

  ChargingHistorial.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      numberOperation: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "ChargingHistorial",
    },
  );

  return ChargingHistorial;
};
