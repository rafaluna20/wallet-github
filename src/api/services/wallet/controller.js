import { Op } from "sequelize";

import { PaymentSchema } from "~api/schemas";
import {
  currentInitDate,
  Error,
  filesValidator,
  generateAcountNumber,
  generateOperationNumber,
  Response,
  SequalizeError,
} from "~utils";

class WalletService {
  constructor(db) {
    this.db = db;
    this.walletModel = this.db.Wallet;
    this.WalletHistoialModel = this.db.WalletHistoial;
  }
  /**
   *
   * @param {Object} args Contiene todos los argumentos enviados en la consulta
   * @param {Object} context Objeto que es compartido por todos los servicios
   * @returns
   */
  createWallet = async (args, context) => {
    const tct = await this.db.sequelize.transaction();
    try {
      const { sub: userID, name } = context;
      const config = await this.db.WalletConfig.findOne({
        where: { id: 1 },
      });

      if (!config) {
        throw Error("Sin configuración para billetera", [
          "No se tiene una configuracion valida para la billetera.",
        ]);
      }

      await config.increment(
        {
          accountSequence: 1,
        },
        {
          transaction: tct,
        },
      );

      const wallet = await this.walletModel
        .create(
          {
            accountNumber: generateAcountNumber(config.accountSequence),
            qrCode: `${userID}|${name}`,
            userID,
            statusID: 1, //estado activo de billetera
          },
          {
            transaction: tct,
          },
        )
        .catch(err => {
          throw SequalizeError(err);
        });
      await tct.commit();

      return Response({ acount: wallet.accountNumber });
    } catch (error) {
      console.log("createWallet throw ", error);
      await tct.rollback();
      throw error;
    }
  };

  getWalletByUser = async (args, context) => {
    try {
      const { sub: userID } = context;
      const initFilter = currentInitDate();

      const wallet = await this.walletModel
        .findOne({
          where: {
            userID,
          },
          attributes: ["id", "cash", "accountNumber"],
          include: [
            {
              where: { createdAt: { [Op.gte]: initFilter } },
              model: this.db.WalletHistoial,
              as: "WalletHistrial",
              attributes: ["amount", "createdAt", "numberOperation"],
              include: [
                {
                  model: this.db.Users,
                  as: "DepositUser",
                  attributes: ["names", "lastname", "phone"],
                },
                {
                  model: this.db.GeneralType,
                  as: "Operation",
                  attributes: ["subtype", "subclass", "extra"],
                },
              ],
            },
          ],
          order: [["WalletHistrial", "createdAt", "DESC"]],
        })
        .catch(err => {
          throw SequalizeError(err);
        });

      return Response(wallet);
    } catch (error) {
      console.log("getWalletByUser throw ", error);
      throw error;
    }
  };

  paymentWallet = async (args, context) => {
    const tct = await this.db.sequelize.transaction();
    try {
      const { depositUserID, amount } = filesValidator(PaymentSchema, args);
      const { sub: userID } = context;

      if (depositUserID === userID)
        throw Error("Operación invalida.", [
          "No puedes realizar una operacion para la misma Billetera.",
        ]);

      const config = await this.db.WalletConfig.findByPk(1);

      if (!config) {
        throw Error("Sin configuración para billetera", [
          "No se tiene una configuración valida para la billetera.",
        ]);
      }

      const userWallet = await this.walletModel.findOne({
        where: { userID, statusID: 1 },
        attributes: ["id", "cash"],
      });

      if (!userWallet)
        throw Error("Billetera invalida", [
          "La billetera del usuarios no esta activa",
        ]);

      if (userWallet.cash < amount)
        throw Error("Saldo insuficiente.", [
          "No cuentas con los fondos suficientes para la transferencia",
        ]);

      const destWallet = await this.walletModel.findOne({
        where: { userID: depositUserID, statusID: 1 },
        attributes: ["id", "cash", "accountNumber"],
      });

      if (!destWallet)
        throw Error("Billetera invalida", [
          "La billetera del usuarios al que quieres transferir no esta activa",
        ]);
      const numberOperation = generateOperationNumber(config.operationSequence);
      const historyWallet = [
        // historial del que hace la operacion
        {
          numberOperation,
          amount,
          walletID: userWallet.id,
          userID,
          operationID: 7, // id de operacion de envio de pago
          depositUserID,
        },
        // hisotriañ para destinatario
        {
          numberOperation,
          amount,
          walletID: destWallet.id,
          userID: depositUserID,
          operationID: 8, // id de operacion de recepcion de pago
          depositUserID: userID,
        },
      ];

      destWallet.increment({ cash: amount }, { transaction: tct });
      userWallet.increment({ cash: -1 * amount }, { transaction: tct });
      config.increment({ operationSequence: 1 }, { transaction: tct });

      await this.WalletHistoialModel.bulkCreate(historyWallet, {
        transaction: tct,
        // returning: true,
      }).catch(err => {
        throw SequalizeError(err);
      });

      await tct.commit();
      const walletOper = await this.WalletHistoialModel.findOne({
        where: {
          numberOperation,
          userID,
        },
        attributes: ["createdAt", "numberOperation", "amount"],
        include: [
          {
            model: this.db.Users,
            as: "DepositUser",
            attributes: ["names", "lastname", "phone"],
          },
          {
            model: this.db.GeneralType,
            as: "Operation",
            attributes: ["subtype", "subclass", "extra"],
          },
        ],
      });

      return Response(
        walletOper,
        `Pago exitoso a la cuenta ${destWallet.accountNumber}`,
      );
    } catch (error) {
      console.log("paymentWallet throw", error);
      await tct.rollback();
      throw error;
    }
  };
}

export { WalletService };
