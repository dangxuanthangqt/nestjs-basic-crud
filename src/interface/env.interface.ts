export interface IEnvConfig {
  app: {
    port: number;
  };
  database: {
    port: string;
    host: string;
  };
}
