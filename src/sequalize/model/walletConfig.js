import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class WalletConfig extends Model {
    static associate(model) {}
  }

  WalletConfig.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      accountSequence: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      operationSequence: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "WalletConfig",
    },
  );

  return WalletConfig;
};
