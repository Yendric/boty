import { Sequelize } from "sequelize-typescript";
import Server from "../models/Server";
import User from "../models/User";
import { log } from "../utils/logging";

export function loadDatabase() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    logging: process.env.debug ? log : false,
    storage: "database.sqlite",
  });

  sequelize.addModels([Server, User]);
  sequelize.sync();
}
