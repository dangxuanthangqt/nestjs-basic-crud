export interface IEnvConfig {
  app: {
    port: number;
    accessTokenSecret: string;
    accessTokenExpiresIn: string;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: string;
    secretApiKey: string;
    logPretty?: string;
  };
  database: {
    port: string;
    host: string;
  };
}
