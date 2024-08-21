import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(model) {
      // the foreign key being defined in the source mode
      Users.hasOne(model.Wallet, {
        foreignKey: "userID",
        as: "Wallet",
      });

      Users.hasOne(model.ChargingAgent, {
        foreignKey: "userID",
        as: "ChargingAgent",
      });
    }
  }

  Users.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      names: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      lastname: {
        allowNull: false,
        type: DataTypes.STRING(80),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(120),
        unique: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(120),
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      documentNumber: {
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
      tableName: "Users",
    },
  );

  return Users;
};
