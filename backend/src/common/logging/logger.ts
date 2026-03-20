/**
 * Log Levels with Numeric Priorities
 */
const LEVELS = {
  alert: 0,
  critical: 1,
  error: 2,
  warning: 3,
  info: 4,
  debug: 5,
};

/**
 * Colors for Console Output
 */
export const COLORS = {
  reset: "\x1b[0m",
  timestamp: "\x1b[90m", // Gray
  info: "\x1b[36m", // Cyan
  success: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  critical: "\x1b[35m", // Magenta
  alert: "\x1b[41m\x1b[37m", // Red BG, White Text
  debug: "\x1b[37m", // White
  path: "\x1b[35m", // Magenta (Same as critical but used for highlight)
};

/**
 * Enhanced Logger class with service-specific branding and level filtering.
 */
export class LoggerInstance {
  private serviceName: string;
  private filePath?: string;

  constructor({ serviceName, filePath }: { serviceName: string; filePath?: string }) {
    this.serviceName = serviceName;
    this.filePath = filePath;
  }

  private getTimestamp(): string {
    return `${COLORS.timestamp}[${new Date().toLocaleTimeString()}]${COLORS.reset}`;
  }

  private shouldLog(level: keyof typeof LEVELS): boolean {
    const minLevel = process.env.LOG_LEVEL ? (LEVELS[process.env.LOG_LEVEL.toLowerCase() as keyof typeof LEVELS] ?? 4) : 4;
    return LEVELS[level] <= minLevel;
  }

  private formatMessage(level: string, color: string, message: string): string {
    const pathTag = this.filePath ? `${COLORS.timestamp}(${this.filePath})${COLORS.reset} ` : "";
    return `${COLORS.info}[BACKEND]${COLORS.reset} ${this.getTimestamp()} ${color}${level.toUpperCase()}${COLORS.reset} ${pathTag}${COLORS.info}[${this.serviceName}]${COLORS.reset} - ${message}`;
  }

  info(message: string, metadata?: any) {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", COLORS.info, message), metadata !== undefined ? metadata : "");
    }
  }

  success(message: string, metadata?: any) {
    console.log(this.formatMessage("success", COLORS.success, message), metadata !== undefined ? metadata : "");
  }

  warn(message: string, metadata?: any) {
    if (this.shouldLog("warning")) {
      console.warn(this.formatMessage("warn", COLORS.warn, message), metadata !== undefined ? metadata : "");
    }
  }

  error(message: string, metadata?: any) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", COLORS.error, message), metadata !== undefined ? metadata : "");
    }
  }

  critical(message: string, metadata?: any) {
    if (this.shouldLog("critical")) {
      console.error(this.formatMessage("critical", COLORS.critical, message), metadata !== undefined ? metadata : "");
    }
  }

  alert(message: string, metadata?: any) {
    if (this.shouldLog("alert")) {
      console.error(this.formatMessage("alert", COLORS.alert, message), metadata !== undefined ? metadata : "");
    }
  }

  debug(message: string, metadata?: any) {
    if (this.shouldLog("debug")) {
      console.log(this.formatMessage("debug", COLORS.debug, message), metadata !== undefined ? metadata : "");
    }
  }
}

// Default export as a global app logger singleton
export const Logger = new LoggerInstance({ serviceName: "App" });
export default Logger;
