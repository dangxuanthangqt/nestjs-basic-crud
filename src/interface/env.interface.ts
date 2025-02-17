export interface IEnvConfig {
  app: {
    port: number;
    accessTokenSecret: string;
    accessTokenExpiresIn: string;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: string;
  };
  database: {
    port: string;
    host: string;
  };
}
