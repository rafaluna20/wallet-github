import db from "~sequalize";

import { AgentWalletService } from "./services/agentWallet/controller";
import { UserService } from "./services/user/controller";
import { WalletService } from "./services/wallet/controller";

export const UserProvider = new UserService(db);
export const WalletProvider = new WalletService(db);
export const AgentWalletProvider = new AgentWalletService(db);
