export class CommandExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandExecutionError";
  }
}
