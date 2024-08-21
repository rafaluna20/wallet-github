import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class WalletHistoial extends Model {
    static associate(model) {
      WalletHistoial.belongsTo(model.Users, {
        foreignKey: "userID",
        as: "User",
      });

      WalletHistoial.belongsTo(model.Wallet, {
        foreignKey: "walletID",
        as: "Wallet",
      });

      WalletHistoial.belongsTo(model.GeneralType, {
        foreignKey: "operationID",
        as: "Operation",
      });

      WalletHistoial.belongsTo(model.Users, {
        foreignKey: "depositUserID",
        as: "DepositUser",
      });
    }
  }

  WalletHistoial.init(
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
      tableName: "WalletHistoial",
    },
  );

  return WalletHistoial;
};
