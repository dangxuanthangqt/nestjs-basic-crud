/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { type Params } from "nestjs-pino";
import { type IncomingMessage, type ServerResponse } from "http";
import { GenReqId, Options, ReqId } from "pino-http";
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from "@nestjs/config";
import { IEnvConfig } from "src/interface/env.interface";

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup = {
  trace: "DEBUG",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL",
} as const;

const redactPaths = [
  "req.headers.authorization",
  "req.body.token",
  "req.body.email",
  "req.body.phoneNumber",
  "req.body.password",
  "req.body.oldPassword",
  "req.body.newPassword",
];

const customSuccessMessage = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  responseTime: number,
) => {
  return `[${req.id || "*"}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers["host"]}" "${req.headers["user-agent"]}" - ${responseTime} ms`;
};

const customReceivedMessage = (req: IncomingMessage) => {
  return `[${req.id || "*"}] "${req.method} ${req.url}"`;
};

const customErrorMessage = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  err: Error,
) => {
  return `[${req.id || "*"}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers["host"]}" "${req.headers["user-agent"]}" - message: ${err.message}`;
};

const genReqId: GenReqId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const id: ReqId = req.headers["x-request-id"] || uuidv4();
  res.setHeader("X-Request-Id", id.toString());
  return id;
};

function localLoggingConfig(): Options {
  return {
    messageKey: "msg",
    transport: {
      target: "pino-pretty",
      options: {
        singleLine: true,
        ignore:
          "req.id,req.method,req.url,req.headers,req.remoteAddress,req.remotePort,res.headers",
      },
    },
  };
}

function gcpLoggingConfig(): Options {
  return {
    messageKey: "message",
    formatters: {
      level(label: keyof typeof PinoLevelToSeverityLookup, number) {
        return {
          severity:
            PinoLevelToSeverityLookup[label] ||
            PinoLevelToSeverityLookup["info"],
          level: number,
        };
      },
    },
  };
}

export const loggerFactory = (
  configService: ConfigService<IEnvConfig>,
): Params => {
  const logPretty = configService.get("app.logPretty", { infer: true });
  const logLevel = configService.get("app.logLevel", { infer: true });
  console.log("logPretty", logPretty);
  console.log("logLevel", logLevel);
  return {
    pinoHttp: {
      level: logLevel, // Phải có config này thì this.logger.debug mới working correctly

      // level: 'debug': Thiết lập mức độ nhật ký là debug. Điều này có nghĩa là tất cả các thông báo nhật ký từ mức debug trở lên sẽ được ghi lại. Cụ thể, các mức độ debug, info, warn, error, và fatal sẽ được ghi lại.

      // Nếu lv info thì chỉ ghi log từ info trở lên, this.logger.debug sẽ không log đc

      genReqId,
      customSuccessMessage,
      customErrorMessage,
      customReceivedMessage,
      redact: {
        paths: redactPaths, // hide sensitive information
        censor: "**GDPR COMPLIANT**",
      }, // Redact sensitive information
      ...(logPretty === "true" ? localLoggingConfig() : gcpLoggingConfig()),
    },
  };
};
