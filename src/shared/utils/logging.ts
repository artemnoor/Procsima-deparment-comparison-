const logLevels = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const;

type LogLevelName = keyof typeof logLevels;

function getActiveLogLevel(): number {
  const configuredLevel = (process.env.LOG_LEVEL?.toLowerCase() ??
    "info") as LogLevelName;

  return logLevels[configuredLevel] ?? logLevels.info;
}

export function logWithLevel(
  scope: string,
  level: LogLevelName,
  message: string,
  context: object,
): void {
  if (logLevels[level] < getActiveLogLevel()) {
    return;
  }

  console[level](`[${scope}] ${message}`, context);
}
