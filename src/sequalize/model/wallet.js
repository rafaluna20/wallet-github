import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(model) {
      Wallet.belongsTo(model.GeneralType, {
        foreignKey: "statusID",
        as: "Status",
      });

      Wallet.belongsTo(model.Users, {
        foreignKey: "userID",
        as: "User",
      });

      Wallet.hasMany(model.WalletHistoial, {
        foreignKey: "walletID",
        as: "WalletHistrial",
      });
    }
  }

  Wallet.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userID: {
        allowNull: false,
        type: DataTypes.UUID,
        unique: true,
      },
      cash: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      accountNumber: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      },
      qrCode: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      extra: {
        type: DataTypes.JSONB,
        defaultValue: null,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "Wallets",
    },
  );

  return Wallet;
};
