import { client } from "..";
import { error } from "../utils/logging";

export function loadDebugLogger() {
  if (process.env.debug) {
    client.on("error", (err) => error(err.message));
    client.on("warn", (err) => error(err));
  }

  process.on("uncaughtException", function (err) {
    error("Onbehandelde error: " + err);
  });
}
