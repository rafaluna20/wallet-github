import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class GeneralType extends Model {
    static associate(_model) {}
  }

  GeneralType.init(
    {
      subtype: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      class: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      subclass: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      protected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "GeneralTypes",
    },
  );

  return GeneralType;
};
