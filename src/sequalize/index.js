import dotenv from "dotenv";
import fs from "fs";
import path from "node:path";
import { DataTypes, Sequelize } from "sequelize";

dotenv.config();

const basename = path.basename(__filename);

let db = {};
let sequelize;

sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    dialect: "postgres",
    timezone: "-05:00",
    logging: false,
    pool: {
      min: 0,
      max: 60,
      idle: 10000,
    },
  },
);

fs.readdirSync(__dirname.concat("/model"))
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname.concat("/model"), file))(
      sequelize,
      DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
