import { AgentSchema, RechargeSchema } from "~api/schemas";
import {
  Error,
  filesValidator,
  generateAcountNumber,
  generateOperationNumber,
  Response,
  SequalizeError,
} from "~utils";

class AgentWalletService {
  constructor(db) {
    this.db = db;
    this.ChargingAgentModel = this.db.ChargingAgent;
    this.ChargingHistorialModel = this.db.ChargingHistorial;
    this.WalletHistoialModel = this.db.WalletHistoial;
  }

  createAgentWallet = async (args, context) => {
    const tct = await this.db.sequelize.transaction();
    try {
      const { sub: userID } = context;
      const agentData = filesValidator(AgentSchema, args);

      const config = await this.db.WalletConfig.findOne({
        where: { id: 1 },
      });

      if (!config)
        throw Error("Error de configuracion", [
          "No se tiene una configuracion valida para proceder con lo requerido.",
        ]);

      await config.increment(
        {
          accountSequence: 1,
        },
        {
          transaction: tct,
        },
      );

      const agentWallet = await this.ChargingAgentModel.create(
        {
          ...agentData,
          accountNumber: generateAcountNumber(config.accountSequence),
          statusID: 9,
          userID,
        },
        {
          transaction: tct,
        },
      ).catch(err => {
        throw SequalizeError(err);
      });

      await tct.commit();
      return Response(agentWallet);
    } catch (error) {
      console.log("createAgentWallet throw ", error);
      await tct.rollback();
      throw error;
    }
  };

  rechargeWallet = async (args, context) => {
    const tct = await this.db.sequelize.transaction();
    try {
      const { sub: userID, charging_agent, charging_agent_status } = context;
      const { rechargedUserID, amount } = filesValidator(RechargeSchema, args);

      if (
        !charging_agent ||
        (charging_agent_status && charging_agent_status !== 9)
      )
        throw Error("Usuario sin permiso", [
          "El usuario no tiene permisos para realizar la operación",
        ]);

      const agentWallet = await this.ChargingAgentModel.findOne({
        where: { id: charging_agent },
        attributes: ["id", "cash"],
      });

      const config = await this.db.WalletConfig.findOne({
        where: { id: 1 },
      });

      if (!config)
        throw Error("Error de configuracion", [
          "No se tiene una configuracion valida para proceder con lo requerido.",
        ]);

      const userWallet = await this.db.Wallet.findOne({
        where: { userID: rechargedUserID, statusID: 1 },
        attributes: ["id", "cash", "accountNumber"],
      });

      if (!userWallet)
        throw Error("Billetera invalida", [
          "La billetera del usuarios no esta activa",
        ]);

      const numberOperation = generateOperationNumber(config.operationSequence);

      userWallet.increment({ cash: amount }, { transaction: tct });
      agentWallet.increment({ cash: -1 * amount }, { transaction: tct });
      config.increment({ operationSequence: 1 }, { transaction: tct });

      await this.ChargingHistorialModel.create(
        {
          numberOperation,
          amount,
          rechargedUserID,
          chargingAgentID: agentWallet.id,
          transactionID: 5, // id de operacion de recarga.
        },
        {
          transaction: tct,
        },
      );

      await this.WalletHistoialModel.create(
        {
          numberOperation,
          amount,
          walletID: userWallet.id,
          userID: rechargedUserID,
          depositUserID: userID,
          operationID: 12,
        },
        {
          transaction: tct,
        },
      );

      await tct.commit();
      return Response({
        message: `Recarga exitosa a la cuenta ${userWallet.accountNumber}`,
      });
    } catch (error) {
      console.log("rechargeWallet throw ", error);
      await tct.rollback();
      throw error;
    }
  };
}

export { AgentWalletService };
