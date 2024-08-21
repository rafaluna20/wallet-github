import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import { UserSchema } from "~api/schemas";
import { Error, Response, SequalizeError } from "~utils";
import { filesValidator, valueValidator } from "~utils/validator";

class UserService {
  constructor(db) {
    this.db = db;
    this.userModel = this.db.Users;
  }

  // consultas de creacion y actualizacion de datos
  createUser = async (args, _context) => {
    try {
      const result = filesValidator(UserSchema, args);
      result.password = bcrypt.hashSync(
        result.password,
        Number(process.env.SALT_ROUNDS || 10),
      );

      const userData = await this.userModel
        .create({
          ...result,
        })
        .catch(err => {
          throw SequalizeError(err);
        });

      return Response(userData);
    } catch (error) {
      console.log("createUser throw", error);
      throw error;
    }
  };

  updatePIN = async (args, context) => {
    try {
      const { password } = args;
      const { sub: userID } = context;
      const pin = valueValidator(password, "pinSix");
      const newPass = bcrypt.hashSync(
        pin,
        Number(process.env.SALT_ROUNDS || 10),
      );
      await this.userModel
        .update(
          { password: newPass },
          {
            where: {
              id: userID,
            },
          },
        )
        .catch(err => {
          throw SequalizeError(err);
        });

      return Response(userID);
    } catch (error) {
      console.log("updatePIN throw", error);
      throw error;
    }
  };

  // consultas de lectura de datos
  token = async (args, _context) => {
    try {
      const { email, password } = args;
      const user = await this.userModel.findOne({
        where: {
          email: email.toLowerCase(),
          // emailVerified: true, // en una autenticación correctamente implementada
          deleted: false,
        },
      });

      if (!user) throw Error("invalid credential", `Usuario no encontrado.`);

      const validatePass = await bcrypt.compare(password, user.password);

      if (!validatePass)
        throw Error("invalid credential", `Contraseña incorrecta.`);

      const profile = await this.userModel.findByPk(user.id, {
        include: [
          {
            model: this.db.Wallet,
            as: "Wallet",
            attributes: ["id", "accountNumber", "statusID"],
          },
          {
            model: this.db.ChargingAgent,
            as: "ChargingAgent",
            attributes: ["id", "statusID"],
          },
        ],
      });
      const payload = {
        sub: profile.id,
        email: profile.email,
        email_verified: profile.emailVerified,
        family_name: profile.names,
        given_name: profile.lastname,
        name: `${profile.names} ${profile.lastname}`,
        phone_number: profile.phone,
        phone_number_verified: profile.phoneVerified,
        wallet: profile.Wallet ? profile.Wallet.id : null,
        wallet_number: profile.Wallet ? profile.Wallet.accountNumber : null,
        wallet_status: profile.Wallet ? profile.Wallet.statusID : null,
        charging_agent: profile.ChargingAgent ? profile.ChargingAgent.id : null,
        charging_agent_status: profile.ChargingAgent
          ? profile.ChargingAgent.statusID
          : null,
      };

      const accessToken = jwt.sign(
        payload,
        process.env.SECRET_TOKEN || "my-key",
        { expiresIn: "5m" },
      );

      return Response({ accessToken });
    } catch (error) {
      console.log("token throw", error);
      throw error;
    }
  };

  me = async (_args, context) => {
    try {
      const { sub: userID } = context;

      const user = await this.userModel
        .findByPk(userID, {
          include: [
            {
              model: this.db.Wallet,
              as: "Wallet",
              attributes: ["id", "accountNumber"],
              include: [
                {
                  model: this.db.GeneralType,
                  as: "Status",
                  attributes: ["subtype", "subclass", "extra"],
                },
              ],
            },
            {
              model: this.db.ChargingAgent,
              as: "ChargingAgent",
              attributes: ["id", "accountNumber", "comercialName", "ruc"],
              include: [
                {
                  model: this.db.GeneralType,
                  as: "Status",
                  attributes: ["subtype", "subclass", "extra"],
                },
              ],
            },
          ],
          attributes: ["id", "names", "lastname", "email", "phone"],
        })
        .catch(err => {
          throw SequalizeError(err);
        });

      return Response(user);
    } catch (error) {
      console.log("me throw", error);
      throw error;
    }
  };

  search = async (args, _context) => {
    try {
      const { term } = args;
      const searchData = await this.userModel
        .findAll({
          where: {
            [Op.or]: [
              {
                names: {
                  [Op.like]: `${term.toLowerCase()}%`,
                },
              },
              {
                lastname: {
                  [Op.like]: `${term.toLowerCase()}%`,
                },
              },
              {
                phone: {
                  [Op.like]: `${term.toLowerCase()}%`,
                },
              },
            ],
          },
          attributes: ["id", "names", "lastname", "phone"],
          include: [
            {
              model: this.db.Wallet,
              as: "Wallet",
              attributes: ["id", "accountNumber", "statusID", "qrCode"],
            },
          ],
        })
        .catch(err => {
          throw SequalizeError(err);
        });

      return Response(searchData);
    } catch (error) {
      console.log("search throw", error);
      throw error;
    }
  };

  searchByID = async (args, _context) => {
    try {
      const { userID } = args;
      const searchData = await this.userModel
        .findByPk(userID, {
          attributes: ["id", "names", "lastname", "email", "phone"],
          include: [
            {
              model: this.db.Wallet,
              as: "Wallet",
              attributes: ["id", "accountNumber", "statusID", "qrCode"],
            },
          ],
        })
        .catch(err => {
          throw SequalizeError(err);
        });

      return Response(searchData);
    } catch (error) {
      console.log("searchByID throw", error);
      throw error;
    }
  };
}

export { UserService };
