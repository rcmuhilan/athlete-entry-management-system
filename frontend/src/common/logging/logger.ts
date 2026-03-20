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
 * Colors for Console Output (Browser CSS styles)
 */
const COLORS = {
  reset: "color: inherit;",
  timestamp: "color: #888;",
  info: "color: #00bcd4;", // Cyan
  success: "color: #4caf50;", // Green
  warn: "color: #ffc107;", // Yellow
  error: "color: #f44336;", // Red
  critical: "color: #9c27b0;", // Magenta
  alert: "background: #f44336; color: white; font-weight: bold;",
  debug: "color: #9e9e9e;",
  path: "color: #9c27b0;",
};

/**
 * Enhanced Logger class with service-specific branding and level filtering for Frontend.
 */
export class LoggerInstance {
  private serviceName: string;
  private filePath?: string;

  constructor({ serviceName, filePath }: { serviceName: string; filePath?: string }) {
    this.serviceName = serviceName;
    this.filePath = filePath;
  }

  private getTimestamp(): string {
    return `[${new Date().toLocaleTimeString()}]`;
  }

  private shouldLog(level: keyof typeof LEVELS): boolean {
    const envLogLevel = (import.meta as any).env?.VITE_LOG_LEVEL;
    const minLevel = envLogLevel ? (LEVELS[envLogLevel.toLowerCase() as keyof typeof LEVELS] ?? 4) : 4;
    return LEVELS[level] <= minLevel;
  }

  private logWithStyle(level: string, message: string, metadata?: any) {
    const timestamp = this.getTimestamp();
    const pathTag = this.filePath ? `(${this.filePath}) ` : "";
    const levelStr = level.toUpperCase();
    const serviceStr = `[${this.serviceName}]`;
    const color = COLORS[level as keyof typeof COLORS] || COLORS.info;

    // Split console message to allow multiple %c styles
    const fullMessage = `%c[FRONTEND] %c${timestamp} %c${levelStr} %c${pathTag}%c${serviceStr} - %c${message}`;
    
    const consoleArgs = [
      fullMessage,
      `${COLORS.info} font-weight: bold;`, // [FRONTEND]
      COLORS.timestamp, // [timestamp]
      color, // LEVEL
      COLORS.timestamp, // (path)
      COLORS.info, // [Service]
      "color: initial;", // -
      "color: initial;", // message
    ];

    if (metadata !== undefined) {
      consoleArgs.push(metadata);
    }

    const consoleMethod = (console as any)[level] || console.log;
    consoleMethod.apply(console, consoleArgs);
  }

  info(message: string, metadata?: any) {
    if (this.shouldLog("info")) this.logWithStyle("info", message, metadata);
  }

  success(message: string, metadata?: any) {
    this.logWithStyle("success", message, metadata);
  }

  warn(message: string, metadata?: any) {
    if (this.shouldLog("warning")) this.logWithStyle("warn", message, metadata);
  }

  error(message: string, metadata?: any) {
    if (this.shouldLog("error")) this.logWithStyle("error", message, metadata);
  }

  critical(message: string, metadata?: any) {
    if (this.shouldLog("critical")) this.logWithStyle("critical", message, metadata);
  }

  alert(message: string, metadata?: any) {
    if (this.shouldLog("alert")) this.logWithStyle("alert", message, metadata);
  }

  debug(message: string, metadata?: any) {
    if (this.shouldLog("debug")) this.logWithStyle("debug", message, metadata);
  }
}

// Default export as a global app logger singleton
export const Logger = new LoggerInstance({ serviceName: "App" });
export default Logger;
