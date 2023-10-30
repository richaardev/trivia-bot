import chalk from "chalk";

enum LEVEL_TYPE {
  LOG,
  WARN,
  ERROR,
  FATAL,
  DEBUG,
}

export class Telemetry {
  private static getCurrentDate() {
    const date = new Date();

    const day = date.getDay().toString().padStart(2, "0");
    const month = date.getMonth().toString().padStart(2, "0");
    const year = date.getFullYear();

    const hour = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return chalk.gray(`[${year}-${month}-${day} ${hour}:${minutes}:${seconds}]`);
  }

  private static levelColor(level: LEVEL_TYPE) {
    const color = {
      "0": chalk.bold.blue("INFO"),
      "1": chalk.bold.yellow("WARN"),
      "2": chalk.bold.red("ERROR"),
      "3": chalk.bold.bgRed("FATAL"),
      "4": chalk.bold.magenta("DEBUG"),
    } as const;

    return color[level];
  }

  private static lg(level: LEVEL_TYPE, ...messages: string[]) {
    console.log(
      [
        `${this.getCurrentDate()}`,
        `${this.levelColor(level)}:`,
        chalk.whiteBright(`${messages.join(" ")}`),
        // EOL,
      ].join(" "),
    );
  }

  static log(...messages: string[]) {
    return this.lg(LEVEL_TYPE.LOG, ...messages);
  }

  static warn(...messages: string[]) {
    return this.lg(LEVEL_TYPE.WARN, ...messages);
  }

  static error(...messages: string[]) {
    return this.lg(LEVEL_TYPE.ERROR, ...messages);
  }

  static fatal(...messages: string[]) {
    return this.lg(LEVEL_TYPE.FATAL, ...messages);
  }

  static debug(...messages: string[]) {
    return this.lg(LEVEL_TYPE.DEBUG, ...messages);
  }
}
