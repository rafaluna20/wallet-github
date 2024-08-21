import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class ChargingAgent extends Model {
    static associate(model) {
      ChargingAgent.belongsTo(model.GeneralType, {
        foreignKey: "statusID",
        as: "Status",
      });

      ChargingAgent.belongsTo(model.Users, {
        foreignKey: "userID",
        as: "User",
      });
    }
  }

  ChargingAgent.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      accountNumber: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      },
      comercialName: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      cash: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      userID: {
        allowNull: false,
        type: DataTypes.UUID,
        unique: true,
      },
      contactNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      ruc: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      address: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "ChargingAgent",
    },
  );

  return ChargingAgent;
};
