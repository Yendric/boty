import colors from "colors";

export function log(message: string) {
  console.info(colors.dim(`[${new Date().toLocaleTimeString()}] `) + colors.white(message));
}

export function announce(message: string) {
  log(colors.bgGreen(message));
}

export function success(message: string) {
  log(colors.green(message));
}

export function error(message: string) {
  log(colors.red(message));
}
